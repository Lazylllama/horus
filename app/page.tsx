"use client";

import { Check } from "lucide-motion";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useState } from "react";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { LinkHref, PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { GetNephthysNameFromHost, nephthysHosts } from "@/lib/nephthys";
import useWindowDimensions from "@/lib/use-window-dimensions";
import { cn } from "@/lib/utils";
import { updatePreferences } from "./actions/preferences";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [selectedHost, setSelectedHost] = useState("");
  const windowSize = useWindowDimensions();
  const searchParams = useSearchParams();

  function handleHostCardClick(host: string) {
    setSelectedHost(host);
    if (windowSize.width < 768) handleSelectHost(host);
  }

  async function handleSelectHost(overrideHost?: string) {
    const hostName = GetNephthysNameFromHost(overrideHost || selectedHost);
    await updatePreferences({
      defaultHost: overrideHost || selectedHost,
    });
    router.push(`/dashboard/${hostName}`);
  }

  function handleLogin() {
    authClient.signIn.oauth2({
      providerId: "hack-club",
    });
  }

  if (
    !searchParams.has("ignorePreference") &&
    session?.preferences?.defaultHost
  ) {
    router.push(
      `/dashboard/${GetNephthysNameFromHost(
        session?.preferences?.defaultHost || "",
      )}`,
    );
  }

  if (
    posthog.has_opted_in_capturing() &&
    session?.preferences?.isOptedOutTracking
  ) {
    // <3
    posthog.opt_out_capturing();
  }

  return (
    <>
      <Navbar />
      <PageWrapper variant="tight">
        <PageHeader breadcrumb="directory" title="Hacker help, made simple.">
          <PageDescription>
            Horus centralizes your support channels and gives you a unified view
            of your support operations.
          </PageDescription>
        </PageHeader>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-7 px-6">
          {nephthysHosts.map((host) => (
            <Card
              key={host.host}
              onClick={() => handleHostCardClick(host.host)}
              className={cn(
                "cursor-pointer",
                "border-2",
                selectedHost === host.host
                  ? "border-primary bg-card-selected"
                  : "border-border",
              )}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold tracking-tight flex flex-row justify-between">
                  <p>{host.name}</p>
                  {selectedHost === host.host &&
                    (windowSize.width > 768 ? (
                      <Check className="text-primary" trigger="mount" />
                    ) : (
                      <Loader className="text-primary animate-spin" />
                    ))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{host.host}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="px-6 hidden md:block">
          <Button
            className="text-primary-foreground text-sm p-4"
            size="lg"
            onClick={() => handleSelectHost()}
            disabled={selectedHost === ""}
          >
            Enter {GetNephthysNameFromHost(selectedHost)} Dashboard
          </Button>
          {!session?.user && !isPending && (
            <Button
              className="text-sm p-4 ml-2"
              size="lg"
              variant="ghost"
              onClick={() => handleLogin()}
            >
              Login with HCA&nbsp;→
            </Button>
          )}
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}
