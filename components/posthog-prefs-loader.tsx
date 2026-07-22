"use client";

import posthog from "posthog-js";
import { authClient } from "@/lib/auth-client";

export function PosthogPrefsLoader() {
  const { data: session } = authClient.useSession();
  if (
    posthog.has_opted_in_capturing() &&
    session?.preferences?.isOptedOutTracking
  ) {
    // <3
    posthog.opt_out_capturing();
  }

  return null;
}
