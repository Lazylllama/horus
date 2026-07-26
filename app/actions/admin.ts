"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { member, organization, user } from "@/db/schemas/auth-schema";
import {
  instance as instanceTable,
  nephthys_host,
} from "@/db/schemas/instance-schema";
import { auth } from "@/lib/auth";
import type { OrgRole } from "@/lib/auth-permissions";
import { userIsSuperAdmin } from "@/lib/utils";
import { searchGlobalUsers } from "./shared";

/**
 * All admin actions require a global "admin" role
 * see lib/utils.ts:userIsSuperAdmin :)
 */
async function assertSuperAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  if (!userIsSuperAdmin(session.user.role)) throw new Error("Forbidden");
  return session;
}

// revalidate after changes
function revalidate() {
  revalidatePath("/dashboard/admin");
}

//? --- Instances / orgs ---
/**
 * Creates a new instance (inlcuding org & nephthys_host) with the provided input.
 * @param input The instance details.
 */
export async function createInstance(input: {
  name: string;
  slug: string;
  sponsorId: string;
  host?: string;
  slackChannel?: string;
}) {
  await assertSuperAdmin();

  const org = await auth.api.createOrganization({
    body: {
      name: input.name,
      slug: input.slug,
      userId: input.sponsorId,
      keepCurrentActiveOrganization: false,
    },
  });
  if (!org?.id) throw new Error("Failed to create organization");

  const instanceId = crypto.randomUUID();
  await db
    .insert(instanceTable)
    .values({ id: instanceId, name: input.name, organizationId: org.id });
  if (input.host && input.slackChannel) {
    await db.insert(nephthys_host).values({
      instanceId,
      host: input.host,
      slackChannel: input.slackChannel,
    });
  }

  revalidate();
}

export async function updateInstance(
  instanceId: string,
  data: { name?: string; deprecated?: boolean },
) {
  await assertSuperAdmin();
  await db
    .update(instanceTable)
    .set(data)
    .where(eq(instanceTable.id, instanceId));
  revalidate();
}

export async function updateNephthysHost(
  instanceId: string,
  data: { host: string; slackChannel: string },
) {
  await assertSuperAdmin();
  await db
    .insert(nephthys_host)
    .values({ instanceId, ...data })
    .onConflictDoUpdate({ target: nephthys_host.instanceId, set: data });
  revalidate();
}

export async function updateOrganization(
  organizationId: string,
  data: { name?: string; slug?: string; logo?: string | null },
) {
  await assertSuperAdmin();
  // Direct db: a global super-admin isn't a member of every org, so
  // auth.api.updateOrganization's org-permission check would reject them.
  await db
    .update(organization)
    .set(data)
    .where(eq(organization.id, organizationId));
  revalidate();
}

export async function deleteInstance(organizationId: string) {
  await assertSuperAdmin();
  // Deleting the org cascades to instance/member/invitation/nephthys_host
  // via existing onDelete: "cascade" FKs.
  await db.delete(organization).where(eq(organization.id, organizationId));
  revalidate();
}

//? --- Org membership ---
/**
 * Look for query in name, slack_id and email and return up to 10 results.
 * @param query what to look for
 * @returns all results
 */
export async function searchUsers(query: string) {
  await assertSuperAdmin();
  return searchGlobalUsers(query, true); // search email too for super-admins
}

export async function addOrgMember(
  organizationId: string,
  userId: string,
  role: OrgRole,
) {
  await assertSuperAdmin();
  await auth.api.addMember({
    body: { organizationId, userId, role },
    headers: await headers(),
  });
  revalidate();
}

/**
 * Update org role of member
 * @param memberId this is the pkey memberId, not the userId
 * @param role type OrgRole
 */
export async function updateOrgMemberRole(memberId: string, role: OrgRole) {
  await assertSuperAdmin();
  await db.update(member).set({ role }).where(eq(member.id, memberId));
  revalidate();
}

/**
 * Removes a member from an organization.
 * @param memberId This is pkey memberId, not the userId
 */
export async function removeOrgMember(memberId: string) {
  await assertSuperAdmin();
  await db.delete(member).where(eq(member.id, memberId));
  revalidate();
}

//? --- Users (global) ---
export async function listAllUsers() {
  await assertSuperAdmin();
  return db.query.user.findMany({
    with: { members: { with: { organization: true } } },
    orderBy: (user, { desc }) => desc(user.createdAt),
  });
}

export async function deleteUser(userId: string) {
  await assertSuperAdmin();
  // Cascades to session/account/user_preferences/member/invitation via FKs.
  await db.delete(user).where(eq(user.id, userId));
  revalidate();
}

export async function setUserGlobalRole(
  userId: string,
  role: "user" | "admin",
) {
  await assertSuperAdmin();
  await auth.api.setRole({
    body: { userId, role },
    headers: await headers(),
  });
  revalidate();
}

export async function banUser(
  userId: string,
  banReason?: string,
  banExpiresIn?: number,
) {
  await assertSuperAdmin();
  await auth.api.banUser({
    body: { userId, banReason, banExpiresIn },
    headers: await headers(),
  });
  revalidate();
}

export async function unbanUser(userId: string) {
  await assertSuperAdmin();
  await auth.api.unbanUser({ body: { userId }, headers: await headers() });
  revalidate();
}
