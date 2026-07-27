"use client";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { unstable_catchError as catchError, type ErrorInfo } from "next/error";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";

function ErrorFallback(
  _props: { title: string },
  { error, unstable_retry }: ErrorInfo,
) {
  function ReachOut() {
    window.open(
      "https://hackclub.enterprise.slack.com/team/U07F2QA059B",
      "_blank",
    );
  }
  return (
    <PageWrapper variant="tight">
      <PageHeader title={error.message} breadcrumb={"ERROR"}>
        <PageDescription>
          {error.name}: {error.message}
          <br />
          <br />
          Stack: {error.stack}
        </PageDescription>
        <div className="flex flex-row gap-2">
          <Button
            size={"xl"}
            className={"text-md px-4 py-0"}
            onClick={unstable_retry}
          >
            Retry
            <RotateCcw size={12} />
          </Button>
          <Button
            onClick={ReachOut}
            variant={"link"}
            size={"xl"}
            className={"text-md"}
          >
            Reach out <ArrowUpRight />
          </Button>
        </div>
      </PageHeader>
    </PageWrapper>
  );
}

export default catchError(ErrorFallback);
