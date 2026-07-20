"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { GetInstances, type InstanceData } from "./actions/instance";
import { updatePreferences } from "./actions/preferences";

export default function Home() {
  const { data: session } = authClient.useSession();
  const [instances, setInstances] = useState<InstanceData[]>();

  useEffect(() => {
    async function fetchInstances() {
      const response = await GetInstances();

      if ("error" in response) {
        throw new Error(response.error);
      }

      setInstances(response);
    }

    fetchInstances();
  }, []);

  function handleLogin() {
    authClient.signIn.oauth2({
      providerId: "hack-club",
    });
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
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-7">
          {/* {nephthysHosts.map((host) => (


          ))} */}
          {instances?.map((instance) => (
            <InstanceCard
              key={instance.instanceId}
              name={instance.name}
              slug={instance.slug}
              stats={{
                open: 670,
                resolved: 450,
                teamSize: 12,
              }}
              imageUrl={instance.imageUrl}
              imageStandalone={instance.imageStandalone}
            />
          ))}
          <InstanceCard
            name={"Stardance"}
            slug={"Stardance"}
            stats={{
              open: 670,
              resolved: 450,
              teamSize: 12,
            }}
            imageUrl={"/StardanceBanner_Horus.png"}
            imageStandalone={true}
          />
          <Card className="bg-transparent border-dashed border-2 ring-0 border-primary/60">
            <CardContent className="p-4 justify-center items-center flex flex-col gap-4 h-full w-full px-12 font-semibold text-muted-foreground">
              <button type="button" onClick={handleLogin}>
                Login to see other instances you might have access to&nbsp;→
              </button>
            </CardContent>
          </Card>
        </div>
        {/* <div className="hidden md:block">
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
        </div> */}
      </PageWrapper>
      <Footer />
    </>
  );
}

function InstanceCard({
  name,
  slug,
  stats,
  imageUrl,
  imageStandalone,
}: {
  name: string;
  slug: string;
  stats: {
    open: number;
    resolved: number;
    teamSize: number;
  };
  imageUrl?: string | null;
  imageStandalone: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  async function handleSelectHost() {
    await updatePreferences({
      defaultHost: slug,
    });
    router.push(`/dashboard/${slug}`);
  }

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  return (
    <Card
      key={slug}
      onClick={() => handleSelectHost()}
      className={cn("cursor-pointer border-2 p-0")}
    >
      <CardContent className="p-0 h-full">
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative overflow-hidden cursor-pointer aspect-video w-full h-full",
          )}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`${name} banner`}
              loading="eager"
              className="absolute top-0 left-0 object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div
            className={cn(
              imageUrl
                ? "absolute bottom-0 left-0 w-full h-36 bg-linear-to-t from-black to-transparent p-4 flex flex-col"
                : "w-full h-full p-4 flex flex-col",
            )}
          >
            <div className="flex flex-col gap-2 mt-auto text-left">
              {!imageStandalone && (
                <h3 className="text-lg font-bold">{name}</h3>
              )}
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex flex-col text-left">
                    <p className="text-xl font-bold text-orange-400">
                      {stats.open}
                    </p>
                    <p className="text-xs text-muted-foreground">OPEN</p>
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-xl font-bold text-primary">
                      {stats.resolved}
                    </p>
                    <p className="text-xs text-muted-foreground">RESOLVED</p>
                  </div>
                  <div className="flex flex-col text-left">
                    <p className="text-xl font-bold text-white">
                      {stats.teamSize}
                    </p>
                    <p className="text-xs tracking-tight text-muted-foreground">
                      HELPERS
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "absolute right-4 bottom-4 text-muted-foreground transition-all duration-300 ease-in-out",
                    isHovered && "translate-x-1 text-primary",
                  )}
                />
              </div>
            </div>
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
