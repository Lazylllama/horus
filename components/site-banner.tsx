import { MessageSquareWarningIcon } from "lucide-react";

export function SiteBanner() {
  return (
    <div className="bg-destructive text-primary-foreground">
      <div className="items-center justify-center px-4 py-2 flex flex-row gap-2">
        <MessageSquareWarningIcon size={18} />
        <p className="text-center text-sm">
          Open-beta software, bugs commonly appear.
        </p>
      </div>
    </div>
  );
}
