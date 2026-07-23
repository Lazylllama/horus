import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createInstance } from "@/app/actions/admin";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { userIsSuperAdmin } from "@/lib/utils";

// Admin page only for super admin
export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !userIsSuperAdmin(session.user.role)) {
    return redirect("/");
  }

  return (
    <>
      <Navbar />
      <PageWrapper variant="tight">
        <PageHeader title="Admin Dashboard⚡" breadcrumb="ADMIN">
          <PageDescription>Hello shittings</PageDescription>
        </PageHeader>
      </PageWrapper>
      <Footer />
    </>
  );
}
