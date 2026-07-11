"use client";
import { ArrowUpRight, RotateCcw } from "lucide-react";

import { unstable_catchError as catchError, type ErrorInfo } from "next/error";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";
import { GetErrorDescription } from "@/lib/utils";

function ErrorFallback(
  props: { title: string },
  { error, unstable_retry }: ErrorInfo,
) {
  console.log(JSON.stringify(error));
  return (
    <PageWrapper variant="tight">
      <PageHeader title={error.message} breadcrumb={"ERROR"}>
        <PageDescription>
          {GetErrorDescription(error)} This error was automatically logged, if
          this is a major disruption, please reach out using the button below.
          Thank you.
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
          <Button variant={"link"} size={"xl"} className={"text-md"}>
            Reach out <ArrowUpRight />
          </Button>
        </div>
      </PageHeader>
    </PageWrapper>
  );
}

export default catchError(ErrorFallback);
