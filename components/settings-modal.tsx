"use client";

import { LockKeyhole, UnlockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import type React from "react";
import { useState } from "react";
import { updatePreferences } from "@/app/actions/preferences";
import { authClient } from "@/lib/auth-client";
import { GetNephthysNameFromHost, nephthysHosts } from "@/lib/nephthys";
import { Button } from "./ui/button";
import { CogIcon } from "./ui/cog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SettingsModal() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  async function TogglePosthogCollection() {
    await updatePreferences({
      isOptedOutTracking: posthog.has_opted_in_capturing(),
    });

    if (posthog.has_opted_in_capturing()) {
      posthog.opt_out_capturing();
    } else {
      posthog.opt_in_capturing();
    }

    window.location.reload();
  }

  type selectItem = {
    label: string;
    value: string;
  };

  const nephthysHostsSelectItems: selectItem[] = nephthysHosts.map((host) => {
    return {
      label: host.name,
      value: host.host,
    };
  });

  async function handleDefaultHostChange(value: string | null) {
    if (!value || !GetNephthysNameFromHost(value)) return;

    setIsLoading(true);

    await updatePreferences({
      defaultHost: value,
    });

    router.push(
      `/dashboard/${nephthysHosts.find((host) => host.host === value)?.name}`,
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="icon-xl" variant="outline" disabled={isPending}>
            <CogIcon size={24} className="text-muted-foreground" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <SettingContainer>
            <SettingHeader
              title="Data Collection"
              description="I use Posthog to collect data so I can improve this faster, you can of course opt-out here if you wish! <3"
            />
            <Button
              className="gap-2"
              onClick={() => TogglePosthogCollection()}
              disabled={isLoading}
            >
              {posthog.has_opted_in_capturing() ? "Opt Out" : "Opt In"}
              {posthog.has_opted_in_capturing() ? (
                <LockKeyhole size={12} />
              ) : (
                <UnlockKeyhole size={12} />
              )}
            </Button>
          </SettingContainer>
          <SettingContainer>
            <SettingHeader
              title="Default host"
              description="You are redirected to this host automatically instead of having to select your host every time."
            />
            <Select
              items={nephthysHostsSelectItems}
              onValueChange={handleDefaultHostChange}
              defaultValue={session?.preferences?.defaultHost}
            >
              <SelectTrigger className="w-full max-w-48" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nephthysHostsSelectItems.map((host) => (
                  <SelectItem key={host.value} value={host.value}>
                    {host.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-2">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function SettingContainer({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
