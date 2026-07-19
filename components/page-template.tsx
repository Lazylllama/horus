import { cn } from "@/lib/utils";

export function PageWrapper({
  children,
  className,
  variant = "default",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "tight" | "center";
}>) {
  return (
    <div
      className={cn(
        "max-w-6xl w-full mx-auto flex-1",
        variant === "tight"
          ? "pt-8 px-10 sm:pt-8"
          : "px-4 pt-8 sm:px-24 sm:pt-16",
        variant === "center" &&
          "text-center flex flex-row items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
