import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  instance: [
    "general:write",
    "general:read",
    "sensitive:write",
    "sensitive:read",
    "danger:write",
    "members:read",
    "members:write",
  ],
  jelly: ["read"],
};

const ac = createAccessControl(statement);

const helper = ac.newRole({
  instance: ["general:read", "members:read"],
});

const jellyHelper = ac.newRole({
  instance: ["general:read", "members:read"],
  jelly: ["read"],
});

const admin = ac.newRole({
  instance: ["general:read", "members:read", "members:write"],
  jelly: ["read"],
});

const sponsor = ac.newRole({
  instance: [
    "general:write",
    "general:read",
    "sensitive:write",
    "sensitive:read",
    "danger:write",
    "members:read",
    "members:write",
  ],
  jelly: ["read"],
});

const ROLES = { helper, jellyHelper, admin, sponsor } as const;
export type InstanceRole = keyof typeof ROLES;

type InstanceAction = (typeof statement.instance)[number];
export type PermissionRequest = {
  instance?: InstanceAction[];
  jelly?: (typeof statement.jelly)[number][];
};

// Same check better-auth's hasPermission runs internally, but in-process.
// Roles can be comma-separated (better-auth convention); allow if ANY grants.
export function authorizeInstanceRole(
  role: string | null | undefined,
  permissions: PermissionRequest,
): boolean {
  if (!role) return false;
  return role.split(",").some((r) => {
    const roleObj = ROLES[r.trim() as InstanceRole];
    return roleObj?.authorize(permissions as never).success ?? false;
  });
}

export { ac, helper, jellyHelper, admin, sponsor };
