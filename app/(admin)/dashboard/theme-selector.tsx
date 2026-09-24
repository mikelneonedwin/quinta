"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div className="px-2 py-1">
        <div className="h-8 w-full bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="px-2 py-1">
      <div className="flex items-center justify-between p-1 bg-muted/60 border border-border/60 rounded-xl text-xs font-medium">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all cursor-pointer",
            theme === "light"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
          title="Light theme"
          aria-label="Light theme"
        >
          <Sun className="size-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all cursor-pointer",
            theme === "dark"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
          title="Dark theme"
          aria-label="Dark theme"
        >
          <Moon className="size-3.5" />
          <span>Dark</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all cursor-pointer",
            theme === "system"
              ? "bg-background text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
          title="System theme"
          aria-label="System theme"
        >
          <Monitor className="size-3.5" />
          <span>System</span>
        </button>
      </div>
    </div>
  );
}
