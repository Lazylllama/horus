import { Suspense } from "react";
import { Footer } from "@/components/footer";
import {
  InstanceCard,
  InstanceCardLogin,
  InstanceCardSkeleton,
} from "@/components/instance-card";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PosthogPrefsLoader } from "@/components/posthog-prefs-loader";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Skeleton } from "@/components/ui/skeleton";
import { GetInstances } from "./actions/instance";

export default async function Home() {
  return (
    <>
      <PosthogPrefsLoader />
      <Navbar />
      <PageWrapper variant="tight">
        <PageHeader breadcrumb="directory" title="Hacker help, made simple.">
          <PageDescription>
            Horus centralizes your support channels and gives you a unified view
            of your support operations.
          </PageDescription>
        </PageHeader>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 py-7">
          <Suspense fallback={<InstanceGridFallback />}>
            <InstanceGrid />
          </Suspense>
          <InstanceCardLogin />
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}

async function InstanceGrid() {
  const instances = await GetInstances();
  if ("error" in instances) throw new Error(instances.error);

  const sortedInstances = instances
    .sort((a, b) => {
      const statsA = a.openTickets + a.resolvedTickets + a.inProgressTickets;
      const statsB = b.openTickets + b.resolvedTickets + b.inProgressTickets;

      return statsB - statsA;
    })
    .sort((a, b) => {
      const hasImageA = a.imageUrl ? 1 : 0;
      const hasImageB = b.imageUrl ? 1 : 0;

      return hasImageB - hasImageA;
    });

  return (
    <>
      {sortedInstances?.map((instance) => (
        <InstanceCard
          key={instance.instanceId}
          name={instance.name}
          slug={instance.slug}
          stats={{
            open: instance.openTickets,
            resolved: instance.resolvedTickets,
            inProgress: instance.inProgressTickets,
          }}
          imageUrl={instance.imageUrl && `/instances/${instance.imageUrl}`}
        />
      ))}
    </>
  );
}

function InstanceGridFallback() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: not worth it
        <InstanceCardSkeleton key={index} />
      ))}
    </>
  );
}
