import posthog from "posthog-js";
import { Button } from "./ui/button";
import { CogIcon } from "./ui/cog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function SettingsModal() {
  function TogglePosthogCollection() {
    if (posthog.has_opted_in_capturing()) {
      posthog.opt_out_capturing();
    } else {
      posthog.opt_in_capturing();
    }

    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button size="icon-xl" variant="outline">
            <CogIcon size={24} className="text-muted-foreground" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <SettingsHeader
            title="Data Collection"
            description="I use Posthog to collect data so I can improve this faster, you can of course opt-out here if you wish! <3"
          />
          <Button onClick={() => TogglePosthogCollection()}>
            {posthog.has_opted_in_capturing() ? "Opt Out" : "Opt In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingsHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <p className="text-lg font-bold">{title}</p>
      <p className="text-muted-foreground">{description}</p>
    </>
  );
}
