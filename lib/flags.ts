import { postHogAdapter } from "@flags-sdk/posthog";
import { flag } from "flags/next";

export const marmaladeFlag = flag({
  key: "marmalade",
  defaultValue: false,
  adapter: postHogAdapter,
});
