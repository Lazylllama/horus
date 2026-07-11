import { LinkHref } from "./text-types";

export function NephthysBanner() {
  return (
    <>
      <div className="flex flex-row items-center justify-center md:gap-2 gap-1 mb-2">
        <div className="size-2.5 bg-primary"></div>
        <h1 className="text-2xl md:text-4xl font-bold mb-1">nephthys</h1>
        <h1 className="text-2xl md:text-4xl font-heading font-light mb-1">
          dashboard
        </h1>
      </div>
      <p className="flex flex-row justify-center items-center text-lg text-gray-600">
        {"by "}
        <LinkHref className="ml-1" href="https://github.com/lazylllama">
          @lazylllama
        </LinkHref>
      </p>
    </>
  );
}
