"use client";

import { Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { MoonIcon } from "./ui/moon";
import { SunIcon } from "./ui/sun";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = React.useCallback(() => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  }, [theme, setTheme]);

  return (
    <Button
      onClick={handleToggleTheme}
      size="icon-xl"
      variant="outline"
      className="flex items-center justify-center text-muted-foreground hover:text-muted-foreground"
    >
      {theme === "light" && <SunIcon size={24} className="size-6" />}
      {theme === "dark" && <MoonIcon size={24} className="size-6" />}
      {theme === "system" && <Laptop size={24} className="size-6" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
