import type { PostHogEntities } from "@flags-sdk/posthog";
import { createPostHogAdapter } from "@flags-sdk/posthog";
import type { Identify } from "flags";
import { flag } from "flags/next";
import { authClient } from "./auth-client";

export const identify: Identify<PostHogEntities> = async () => {
  const { data: session } = await authClient.getSession();

  return { distinctId: session?.user?.id || "user-123" };
};

const postHogAdapter = createPostHogAdapter({
  postHogKey: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "",
  postHogOptions: {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "",
  },
});

export const marmaladeFlag = flag({
  key: "marmalade",
  defaultValue: false,
  adapter: postHogAdapter,
  identify,
});
