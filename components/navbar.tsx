"use client";

import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn, userIsSuperAdmin } from "@/lib/utils";
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
  const { data: session, isPending } = authClient.useSession();

  function handleLogin() {
    authClient.signIn.oauth2({
      providerId: "hack-club",
    });
  }

  function handleSignOut() {
    authClient.signOut();
  }

  return (
    <>
      <SiteBanner />
      <div className="border-b bg-card">
        <div className="flex items-center justify-between mx-auto px-10 py-4 max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2.5 bg-primary" />
              <h1 className="text-lg font-semibold tracking-tight">horus</h1>
            </div>
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
                                  {session?.user.name}{" "}
                                  {userIsSuperAdmin(session?.user.id) && "⚡"}
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
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto flex flex-row items-center px-10">
          <PageButton path={"/"} displayName="Home" />
          <PageButton
            path={`/dashboard/${session?.preferences?.defaultHost}`}
            displayName="Dashboard"
            disabled={!session?.preferences?.defaultHost}
          />
          <PageButton path={"/dashboard/settings"} displayName="Settings" />
          {userIsSuperAdmin(session?.user.id) && (
            <PageButton
              path={"/dashboard/admin"}
              displayName="Admin"
              superAdminOnly={true}
            />
          )}
        </div>
      </div>
    </>
  );
}

function PageButton({
  path,
  displayName,
  isPending,
  disabled,
  superAdminOnly = false,
}: {
  path: string;
  displayName: string;
  isPending?: boolean;
  disabled?: boolean;
  superAdminOnly?: boolean;
}) {
  const router = useRouter();
  const pathName = usePathname();

  function isCurrentPage() {
    if (path === "/dashboard" && pathName.startsWith("/dashboard")) {
      if (pathName.includes("settings")) return false;
      if (pathName.includes("admin")) return false;
      return true;
    }
    return pathName === path;
  }

  return (
    <button
      type="button"
      onClick={() => router.push(path)}
      className={cn(
        "p-3 border-b-3 border-b-transparent text-muted-foreground",
        "disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
        isCurrentPage() && "border-b-primary text-foreground",
        superAdminOnly && "border-b-3 border-restricted border-dashed",
      )}
      disabled={isPending || disabled}
    >
      {displayName}
    </button>
  );
}
