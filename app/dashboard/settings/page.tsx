"use client";

import { useRouter } from "next/navigation";
import { createInstance } from "@/app/actions/admin";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

// Admin page only for super admin
export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  return (
    <>
      <Navbar />
      <PageWrapper variant="tight">
        <PageHeader title="Settings" breadcrumb="SETTINGS">
          <PageDescription>Hello shittings</PageDescription>
        </PageHeader>
      </PageWrapper>
      <Footer />
    </>
  );
}
