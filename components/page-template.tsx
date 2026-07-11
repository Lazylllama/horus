import { cn } from "@/lib/utils";

export function PageWrapper({
  children,
  className,
  variant = "default",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "tight";
}>) {
  return (
    <div
      className={cn(
        "max-w-6xl w-full mx-auto ",
        variant === "tight"
          ? "pt-8 sm:px-4 sm:pt-8"
          : "px-4 pt-8 sm:px-24 sm:pt-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
