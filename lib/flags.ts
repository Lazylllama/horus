import { createPostHogAdapter } from "@flags-sdk/posthog";
import { flag } from "flags/next";

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
});
