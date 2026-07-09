"use client";

import type { CachetEnrichedHelper } from "@/types/nephthys";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader } from "./ui/card";

export function HelperLeaderboardWidget({
  helperData,
  maxHelperCount = 8,
}: {
  helperData: CachetEnrichedHelper[];
  maxHelperCount?: number;
}) {
  const leaderTicketCount = Math.max(...helperData.map((h) => h.count));

  return (
    <Card className="grid-cols-1">
      <CardHeader>
        <h1 className="text-lg">Helper leaderboard (half disabled)</h1>
      </CardHeader>
      <CardContent className="flex flex-col items-left gap-2">
        {helperData
          .sort((a, b) => b.count - a.count)
          .slice(0, maxHelperCount)
          .map((helper, index) => (
            <div className="flex flex-col gap-2 w-full" key={helper.slack_id}>
              <div className="flex flex-row items-center gap-2 w-full">
                <p className="text-muted-foreground">{index + 1}</p>
                <Avatar>
                  <AvatarImage
                    className="rounded-sm"
                    src={
                      helper.imageUrl ||
                      `https://cachet.hackclub.com/users/${helper.slack_id}/r`
                    }
                  />
                  <AvatarFallback>
                    {helper.displayName?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <p>{helper.displayName || helper.slack_id}</p>
                  <div className="bg-muted w-full h-1">
                    <div
                      className="bg-primary h-1"
                      style={{
                        width: `${(helper.count / leaderTicketCount) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="font-bold">{helper.count}</p>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
