"use client";

function PageBreadcrumb({ name }: { name: string }) {
  return (
    <p className="text-xs font-medium tracking-widest text-primary">
      NEPHTHYS · {name.toUpperCase()}
    </p>
  );
}

function PageTitle({ title }: { title: string }) {
  return <h1 className="text-4xl font-bold font-heading">{title}</h1>;
}

export function PageDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-md text-muted-foreground max-w-xl tracking-wide">
      {children}
    </p>
  );
}

export function LinkHref({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="text-primary underline"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function PageHeader({
  breadcrumb,
  title,
  justifyBetween = false,
  children,
}: {
  breadcrumb: string;
  title: string;
  justifyBetween?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-2">
      <PageBreadcrumb name={breadcrumb} />
      <PageTitle title={title} />
      <div
        className={`flex flex-col gap-4 ${
          justifyBetween ? "lg:flex-row lg:justify-between" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
