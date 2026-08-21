"use client";

import React, { useSyncExternalStore } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        aria-label="Toggle theme placeholder"
        disabled
      >
        <span className="size-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={`relative text-muted-foreground hover:text-foreground transition-colors ${className || ""}`}
      title={`Current: ${theme} mode. Click to change.`}
      aria-label={`Toggle theme, current is ${theme}`}
    >
      {theme === "light" && <Sun className="size-4 transition-transform duration-200 rotate-0 scale-100" />}
      {theme === "dark" && <Moon className="size-4 transition-transform duration-200 rotate-0 scale-100" />}
      {theme === "system" && <Laptop className="size-4 transition-transform duration-200 rotate-0 scale-100" />}
      <span className="sr-only">Toggle theme (current: {theme})</span>
    </Button>
  );
}
