"use client";

import { RotateCcw } from "lucide-react";
import type { ErrorInfo } from "next/error";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, unstable_retry }: ErrorInfo) {
  return (
    <PageWrapper>
      <PageHeader title={error.name} breadcrumb={"ERROR"}>
        <PageDescription>{error.message}</PageDescription>
        <Button onClick={unstable_retry} className={"max-w-28 text-md p-4"}>
          Retry
          <RotateCcw size={12} />
        </Button>
      </PageHeader>
    </PageWrapper>
  );
}
