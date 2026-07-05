"use client";

import { LucideDoorOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { nephthysHosts } from "@/lib/nephthys";
import { ThemeSwitcher } from "./theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CogIcon } from "./ui/cog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";

export default function Navbar() {
  const session = authClient.useSession();

  function handleLogin() {
    authClient.signIn.oauth2({
      providerId: "hack-club",
    });
  }

  function handleSignOut() {
    authClient.signOut();
  }

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-2.5 bg-primary"></div>
          <h1 className="text-lg font-semibold tracking-tight">nephthys</h1>
        </div>
        <NativeSelect>
          {nephthysHosts.map((host) => (
            <NativeSelectOption key={host.name} value={host.host}>
              {host.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Button size="icon-xl" variant="outline">
          <CogIcon size={24} className="text-muted-foreground" />
        </Button>
        {session.data ? (
          <Card className="flex items-center p-1">
            <CardContent className="flex items-center gap-3 px-1">
              <Avatar>
                <AvatarImage
                  className="rounded-xs"
                  src={session.data.user.image || ""}
                  alt={session.data.user.name}
                />
                <AvatarFallback>
                  {session.data.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button type="button" className="text-left">
                      <p className="font-extrabold">{session.data.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.data.user.slack_id}
                      </p>
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
            </CardContent>
          </Card>
        ) : (
          <Button size="xl" className="text-md" onClick={handleLogin}>
            Sign in →
          </Button>
        )}
      </div>
    </div>
  );
}
