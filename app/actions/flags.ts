"use server";

import { marmaladeFlag } from "@/lib/flags";

export async function getMarmaladeFlagEnabled(): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;
  const marmalade = (await marmaladeFlag()) as boolean;
  return marmalade;
}
