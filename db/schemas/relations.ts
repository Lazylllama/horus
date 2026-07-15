import { defineRelations } from "drizzle-orm";
import {
  account,
  session,
  user,
  user_preferences,
  verification,
} from "./auth-schema";
import { instance, jelly_host, nephthys_host } from "./instance-schema";

export const relations = defineRelations(
  {
    user,
    user_preferences,
    session,
    account,
    verification,
    instance,
    nephthys_host,
    jelly_host,
  },
  (r) => ({
    // auth-schema.ts
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      preferences: r.one.user_preferences(),
    },
    session: {
      user: r.one.user({ from: r.session.userId, to: r.user.id }),
    },
    account: {
      user: r.one.user({ from: r.account.userId, to: r.user.id }),
    },
    user_preferences: {
      user: r.one.user({ from: r.user_preferences.userId, to: r.user.id }),
    },

    // instance-schema.ts
    instance: {
      sponsor_user_id: r.one.user({
        from: r.instance.sponsorUserId,
        to: r.user.id,
      }),
      nephthys_host: r.one.nephthys_host({
        from: r.instance.id,
        to: r.nephthys_host.instanceId,
      }),
      jelly_host: r.one.jelly_host({
        from: r.instance.id,
        to: r.jelly_host.instanceId,
      }),
    },
    nephthys_host: {
      instance: r.one.instance(),
    },
    jelly_host: {
      instance: r.one.instance(),
    },
  }),
);
