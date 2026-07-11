"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  function GoBack() {
    router.back();
  }

  return (
    <PageWrapper variant="center">
      <PageHeader center title={"404 🥀"} breadcrumb={"NOT FOUND"}>
        <PageDescription>So uh, this is awkward...</PageDescription>
        <Button onClick={GoBack} className={"max-w-28 text-md p-4"}>
          <ArrowLeft size={12} />
          Go back
        </Button>
      </PageHeader>
    </PageWrapper>
  );
}
