"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { nephthysHosts } from "@/lib/nephthys";
import useWindowDimensions from "@/lib/use-window-dimensions";
import { SettingsModal } from "./settings-modal";
import { SiteBanner } from "./site-banner";
import { ThemeSwitcher } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const _windowSize = useWindowDimensions();

  function handleLogin() {
    authClient.signIn.oauth2({
      providerId: "hack-club",
    });
  }

  function handleSignOut() {
    authClient.signOut();
  }

  function _handleHostChange(value: string | null) {
    if (!value || !nephthysHosts.some((host) => host.host === value)) return;
    const hostName = nephthysHosts.find((host) => host.host === value)?.name;
    router.push(`/dashboard/${hostName}`);
  }

  return (
    <div className="border-b bg-card">
      <SiteBanner />
      <div className="flex items-center justify-between mx-auto px-10 py-4 max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-2.5 bg-primary"></div>
            <h1 className="text-lg font-semibold tracking-tight">nephthys</h1>
          </div>
          {/* <Select
            value={selectedHost}
            onValueChange={(e) => handleHostChange(e as string)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a channel">
                {nephthysHosts.find((host) => host.host === selectedHost)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {nephthysHosts.map((host) => (
                <SelectItem key={host.host} value={host.host}>
                  {host.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <SettingsModal />
          {session || isPending ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button type="button">
                    <Card className="flex items-center p-1">
                      <CardContent className="flex items-center gap-3 px-0 md:px-1">
                        <Avatar>
                          <AvatarImage
                            className="rounded-xs"
                            src={session?.user.image || ""}
                            alt={session?.user.name}
                          />
                          <AvatarFallback className="rounded-xs">
                            {session?.user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="text-left hidden md:block">
                          {isPending ? (
                            <div className="flex flex-col gap-2 my-1">
                              <Skeleton className="h-3 w-16" />
                              <Skeleton className="h-2 w-20.5" />
                            </div>
                          ) : (
                            <>
                              <p className="font-extrabold">
                                {session?.user.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {session?.user.slack_id}
                              </p>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                }
              />
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="xl" className="text-md" onClick={handleLogin}>
              Sign in →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
