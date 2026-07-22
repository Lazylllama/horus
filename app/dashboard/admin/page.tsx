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

  if (
    !isPending &&
    session?.user.id !== process.env.NEXT_PUBLIC_SUPER_ADMIN_ID
  ) {
    router.push("/");
  }

  async function handleCreateInstance() {
    const data = await createInstance({
      name: "Test Instance",
      slug: "test",
      sponsorId: "MTFR6CjAvgTxIMW4J56WHMIv33iyQtnQ",
    });

    alert(`Instance created, probably (check console)`);
    console.log(data);
  }

  return (
    <>
      <Navbar />
      <PageWrapper variant="tight">
        <PageHeader title="Admin Dashboard⚡" breadcrumb="ADMIN">
          <PageDescription>Hello shittings</PageDescription>
        </PageHeader>
        <Button onClick={handleCreateInstance}>Create test instance</Button>
      </PageWrapper>
      <Footer />
    </>
  );
}
