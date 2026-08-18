import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardHeader } from "./ui/card";

//! Survey UI is handled by Posthog and opens via the button and it's "feedback-button" class
export function SurveyWidget() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg">
          Enjoying what you're seeing? <em>(or not)</em>
        </h1>
      </CardHeader>
      <CardContent className="flex flex-col items-left gap-2">
        <h1 className={cn("text-lg font-bold")}>
          I'd
          <span className="text-primary">{" <3 "}</span>
          to hear from you either way!
        </h1>
        <p className="text-muted-foreground text-[0.9rem]">
          Your feedback makes it 100x easier for me to prioritize on what to
          add, change or remove next!
        </p>
      </CardContent>
      <CardAction className="w-full px-4 mt-auto">
        <Button
          suppressHydrationWarning // "phwidgetsurveyclicklistener"
          className="w-full text-md feedback-button"
          size="lg"
        >
          FEEDBACK
          <ArrowUpRight size={16} />
        </Button>
      </CardAction>
    </Card>
  );
}
