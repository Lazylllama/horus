import useWindowDimensions from "@/lib/use-window-dimensions";
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
  const windowSize = useWindowDimensions();
  return (
    <div
      className={cn(
        "max-w-6xl w-full mx-auto ",
        variant === "tight" || windowSize.width < 650
          ? "px-4 pt-8"
          : "px-24 pt-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
