"use client";

import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";

// Admin page only for super admin
export default function AdminPage() {
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
