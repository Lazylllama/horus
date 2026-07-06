"use client";

import { Check } from "lucide-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageWrapper } from "@/components/page-template";
import { LinkHref, PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { nephthysHosts } from "@/lib/nephthys";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending: _ } = authClient.useSession();
  const [selectedHost, setSelectedHost] = useState(nephthysHosts[0].host);

  function handleHostCardClick(host: string) {
    setSelectedHost(host);
  }

  function handleSelectHost() {
    console.log("Selected host:", selectedHost);
    const hostName = nephthysHosts.find(
      (host) => host.host === selectedHost,
    )?.name;
    console.log("Host name:", hostName);
    router.push(`/dashboard/${hostName}`);
  }

  function handleLogin() {
    authClient.signIn.oauth2({
      providerId: "hack-club",
    });
  }

  // TODO: Replace with account preferences when logged in
  // if (localStorage.getItem("nephthysHost")) {
  //   router.push("/dashboard");
  //   return <Loader />;
  // } else {
  return (
    <PageWrapper>
      <PageHeader breadcrumb="onboarding" title="Choose your channel.">
        <PageDescription>
          Pick whichever channel you want to see data for, you can very easily
          change this later on. If you don't see your channel, please reach make
          a PR to add it to the list or send me a{" "}
          <LinkHref href="https://hackclub.enterprise.slack.com/team/U07F2QA059B">
            DM on Slack
          </LinkHref>
          .
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
                {selectedHost === host.host && (
                  <Check className="text-primary" trigger="mount" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{host.host.split("://")[1]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="px-6">
        <Button
          className="text-primary-foreground text-sm p-4"
          size="lg"
          onClick={() => handleSelectHost()}
        >
          Enter {nephthysHosts.find((host) => host.host === selectedHost)?.name}{" "}
          Dashboard
        </Button>
        {!session?.user && (
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
  );
}
