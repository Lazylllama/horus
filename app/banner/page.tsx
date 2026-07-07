import { LinkHref } from "@/components/text-types";

export default function BannerPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-2.5 bg-primary"></div>
        <h1 className="text-4xl font-bold mb-1">nephthys</h1>
        <h1 className="text-4xl font-heading font-light mb-1">dashboard</h1>
      </div>
      <p className="text-lg text-gray-600">
        by <LinkHref href="https://github.com/lazylllama">@lazylllama</LinkHref>
      </p>
    </div>
  );
}
