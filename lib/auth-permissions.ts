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

export { ac, helper, jellyHelper, admin, sponsor };
