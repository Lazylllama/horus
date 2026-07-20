"use client";

import { ArrowUpRight } from "lucide-react";
import posthog from "posthog-js";
import { authClient } from "@/lib/auth-client";
import { GetNephthysChannelFromName } from "@/lib/nephthys";
import { greet, SlackChannelLink } from "@/lib/utils";
import { PageHeader } from "./text-types";
import { Button } from "./ui/button";

export default function DashboardHeader({
  description,
  selectedHost,
}: {
  description: React.ReactNode;
  selectedHost: string;
}) {
  const { data: session } = authClient.useSession();

  function OpenSlackChannel(channelId: string | null) {
    if (!channelId) return console.error("Channel ID is null?");
    window.open(SlackChannelLink(channelId), "");
  }

  //? Make sure that preferences are applied
  if (
    posthog.has_opted_in_capturing() &&
    session?.preferences?.isOptedOutTracking
  )
    posthog.opt_out_capturing();
  else if (
    !posthog.has_opted_in_capturing() &&
    !session?.preferences?.isOptedOutTracking
  )
    posthog.opt_in_capturing();

  return (
    <PageHeader
      title={greet(session?.user?.name)}
      breadcrumb={selectedHost}
      justifyBetween
    >
      {description}
      <div className="flex flex-row gap-2">
        <Button size="lg" variant="outline" disabled>
          OPEN JELLY
        </Button>
        <Button
          size="lg"
          variant="default"
          onClick={() =>
            OpenSlackChannel(GetNephthysChannelFromName(selectedHost))
          }
        >
          OPEN CHANNEL
          <ArrowUpRight size={16} />
        </Button>
      </div>
    </PageHeader>
  );
}
