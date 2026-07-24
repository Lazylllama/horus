"use client";

//! This file is made with complete vibes by my dearest claude, will be remade when I actually have decidede the structure of everything,
//! but for now i need this and I dont want to "hourmaxx" by making something i'll throw away love you bai bai

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addOrgMember,
  banUser,
  createInstance,
  deleteInstance,
  deleteUser,
  type listAllUsers,
  removeOrgMember,
  searchUsers,
  setUserGlobalRole,
  unbanUser,
  updateInstance,
  updateNephthysHost,
  updateOrgMemberRole,
} from "@/app/actions/admin";
import { authClient } from "@/lib/auth-client";
import type { InstanceApiData } from "@/types/instances";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type UserRow = Awaited<ReturnType<typeof listAllUsers>>[number];

const ORG_ROLES = ["helper", "jellyHelper", "admin", "sponsor"];
const GLOBAL_ROLES = ["user", "admin"];

async function run(fn: () => Promise<unknown>) {
  try {
    await fn();
    window.location.reload();
  } catch (e) {
    alert(e instanceof Error ? e.message : "Action failed");
  }
}

// --- shared user search (used for the sponsor picker) ---
function UserSearch({
  onSelect,
}: {
  onSelect: (user: { id: string; name: string }) => void;
}) {
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  return (
    <div className="flex flex-col gap-1">
      <Input
        placeholder="Search users by name / email / slack id"
        onChange={async (e) => {
          const q = e.target.value;
          if (q.length < 2) return setResults([]);
          setResults(await searchUsers(q));
        }}
      />
      {results.length > 0 && (
        <div className="flex flex-col border border-input max-h-40 overflow-y-auto">
          {results.map((u) => (
            <button
              key={u.id}
              type="button"
              className="text-left px-2 py-1 text-sm hover:bg-accent"
              onClick={() => {
                onSelect(u);
                setResults([]);
              }}
            >
              {u.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== INSTANCES ====================

export function InstancesManager({
  instances,
}: {
  instances: InstanceApiData[];
}) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Instances</h2>
        <NewInstanceDialog />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Slack channel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((i) => (
              <TableRow key={i.instanceId}>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.slug}</TableCell>
                <TableCell>{i.nephthysHostname ?? "—"}</TableCell>
                <TableCell>{i.slackChannel ?? "—"}</TableCell>
                <TableCell>
                  {i.deprecated && (
                    <Badge className="border-orange-400" variant="outline">
                      Deprecated
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <EditInstanceDialog instance={i} />
                  <ConfirmButton
                    trigger={
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    }
                    title={`Delete ${i.name}?`}
                    description="This deletes the organization, instance, host and all memberships. Cannot be undone."
                    onConfirm={() => deleteInstance(i.organizationId)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function NewInstanceDialog() {
  const [sponsor, setSponsor] = useState<{ id: string; name: string } | null>(
    null,
  );
  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm">New instance</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New instance</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!sponsor) return alert("Pick a sponsor");
            const f = new FormData(e.currentTarget);
            run(() =>
              createInstance({
                name: String(f.get("name")),
                slug: String(f.get("slug")),
                host: String(f.get("host")),
                slackChannel: String(f.get("slackChannel")),
                sponsorId: sponsor.id,
              }),
            );
          }}
        >
          <Field name="name" label="Name" />
          <Field name="slug" label="Slug" />
          <Field name="host" label="Nephthys host" />
          <Field name="slackChannel" label="Slack channel id" />
          <div className="flex flex-col gap-1">
            <Label>Sponsor {sponsor && `→ ${sponsor.name}`}</Label>
            <UserSearch onSelect={setSponsor} />
          </div>
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditInstanceDialog({ instance }: { instance: InstanceApiData }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            Edit
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {instance.name}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            run(async () => {
              await updateInstance(instance.instanceId, {
                name: String(f.get("name")),
                deprecated: f.get("deprecated") === "on",
              });
              await updateNephthysHost(instance.instanceId, {
                host: String(f.get("host")),
                slackChannel: String(f.get("slackChannel")),
              });
            });
          }}
        >
          <Field name="name" label="Name" defaultValue={instance.name} />
          <Field
            name="host"
            label="Nephthys host"
            defaultValue={instance.nephthysHostname ?? ""}
          />
          <Field
            name="slackChannel"
            label="Slack channel id"
            defaultValue={instance.slackChannel ?? ""}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="deprecated"
              defaultChecked={instance.deprecated}
            />
            Deprecated
          </label>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== USERS ====================

export function UsersManager({
  users,
  orgs,
}: {
  users: UserRow[];
  orgs: { id: string; name: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <h2 className="text-xl font-bold">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orgs</TableHead>
              <TableHead>Global role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarImage
                        src={`https://cachet.hackclub.com/users/${u.slack_id}/r`}
                      />
                      <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="flex items-center gap-1">
                      {u.name}
                      {u.banned && (
                        <Badge variant="destructive" className="text-[10px]">
                          Banned
                        </Badge>
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="blur-sm hover:blur-none transition-all duration-300">
                    {u.email}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {u.members.map((m) => (
                      <Badge key={m.id} variant="outline">
                        {m.organization?.slug}:{m.role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={u.role ?? "user"}
                    onValueChange={(v) =>
                      run(() => setUserGlobalRole(u.id, v as "user" | "admin"))
                    }
                  >
                    <SelectTrigger size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GLOBAL_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right flex flex-wrap gap-2 justify-end">
                  <ManageOrgsDialog user={u} orgs={orgs} />
                  <ImpersonateButton userId={u.id} />
                  {u.banned ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => run(() => unbanUser(u.id))}
                    >
                      Unban
                    </Button>
                  ) : (
                    <ConfirmButton
                      trigger={
                        <Button size="sm" variant="outline">
                          Ban
                        </Button>
                      }
                      title={`Ban ${u.name}?`}
                      description="They will be signed out and blocked from signing in."
                      onConfirm={() => banUser(u.id)}
                    />
                  )}
                  <ConfirmButton
                    trigger={
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    }
                    title={`Delete ${u.name}?`}
                    description="Permanently deletes the user and all their data. Cannot be undone."
                    onConfirm={() => deleteUser(u.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ManageOrgsDialog({
  user,
  orgs,
}: {
  user: UserRow;
  orgs: { id: string; name: string }[];
}) {
  const [orgId, setOrgId] = useState(orgs[0]?.id ?? "");
  const [role, setRole] = useState(ORG_ROLES[0]);
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            Orgs
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage orgs — {user.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {user.members.length === 0 && (
              <p className="text-sm text-muted-foreground">No memberships.</p>
            )}
            {user.members.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <span className="flex-1 text-sm">{m.organization?.slug}</span>
                <Select
                  value={m.role}
                  onValueChange={(v) =>
                    run(() => updateOrgMemberRole(m.id, v as string))
                  }
                >
                  <SelectTrigger size="sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => run(() => removeOrgMember(m.id))}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t border-input pt-3 flex flex-col gap-2">
            <Label>Add to org (as org role)</Label>
            <div className="flex items-center gap-2">
              <Select
                value={orgId}
                onValueChange={(v) => setOrgId(v as string)}
              >
                <SelectTrigger size="sm" className="flex-1">
                  <SelectValue placeholder="Org">
                    {orgId ? orgs.find((o) => o.id === orgId)?.name : "Org"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {orgs.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={role} onValueChange={(v) => setRole(v as string)}>
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORG_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={!orgId}
                onClick={() =>
                  run(() =>
                    addOrgMember(
                      orgId,
                      user.id,
                      role as "helper" | "jellyHelper" | "admin" | "sponsor",
                    ),
                  )
                }
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImpersonateButton({ userId }: { userId: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        await authClient.admin.impersonateUser({ userId });
        router.push("/");
      }}
    >
      Impersonate
    </Button>
  );
}

// ==================== shared bits ====================

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} required />
    </div>
  );
}

function ConfirmButton({
  trigger,
  title,
  description,
  onConfirm,
}: {
  trigger: React.ReactElement;
  title: string;
  description: string;
  onConfirm: () => Promise<unknown>;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => run(onConfirm)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
