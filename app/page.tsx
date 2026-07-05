"use client";

import { Check } from "lucide-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { nephthysHosts } from "@/lib/nephthys";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [selectedHost, setSelectedHost] = useState(nephthysHosts[0].host);

  function handleHostCardClick(host: string) {
    setSelectedHost(host);
  }

  function handleSaveHost() {
    localStorage.setItem("nephthysHost", selectedHost);
    router.push("/dashboard");
  }

  // function handleLogin() {
  //   authClient.signIn.oauth2({
  //     providerId: "hack-club",
  //   });
  // }

  if (localStorage.getItem("nephthysHost")) {
    router.push("/dashboard");
    return <Loader />;
  } else {
    return (
      <div className="px-24 pt-16">
        <div className="flex flex-1 flex-col gap-4 px-6">
          <p className="text-xs font-medium tracking-widest text-primary">
            NEPHTHYS · ONBOARDING
          </p>
          <h1 className="text-4xl font-bold">Choose your channel.</h1>
          <p className="text-md text-muted-foreground max-w-xl tracking-wide">
            Pick whichever channel you want to see data for, you can very easily
            change this later on. If you don't see your channel, please reach
            make a PR to add it to the list or send me a{" "}
            <a
              href="https://hackclub.enterprise.slack.com/team/U07F2QA059B"
              target="_blank"
              className="text-primary underline"
              rel="noopener noreferrer"
            >
              DM on Slack
            </a>
            .
          </p>
        </div>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 py-7 px-6">
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
                <CardTitle className="text-lg font-semibold tracking-tight font-sans flex flex-row justify-between">
                  <p>{host.name}</p>
                  {selectedHost === host.host && (
                    <Check className="text-primary" trigger="mount" />
                  )}
                </CardTitle>
                <CardDescription>{host.host.split("://")[1]}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="px-6">
          <Button
            className="text-primary-foreground text-sm p-4"
            size="lg"
            onClick={() => handleSaveHost()}
          >
            Enter{" "}
            {nephthysHosts.find((host) => host.host === selectedHost)?.name}{" "}
            Dashboard &nbsp;→
          </Button>
        </div>
      </div>
    );
  }
}
