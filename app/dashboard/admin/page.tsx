import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";
import { PageWrapper } from "@/components/page-template";
import { PageDescription, PageHeader } from "@/components/text-types";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <PageWrapper variant="tight">
        <PageHeader title="Admin Dashboard" breadcrumb="ADMIN">
          <PageDescription>Hello shittings</PageDescription>
        </PageHeader>
      </PageWrapper>
      <Footer />
    </>
  );
}
