import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

export const marmaladeFlag = flag({
  key: "marmalade",
  defaultValue: false,
  adapter: vercelAdapter(),
});
