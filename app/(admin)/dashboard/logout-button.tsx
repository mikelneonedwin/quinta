"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/features/auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to log out");
            setIsLoggingOut(false);
          },
        },
      });
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to log out";
      toast.error(message);
      setIsLoggingOut(false);
    }
  };

  return (
    <SidebarMenuItem className="relative px-2 py-1">
      <SidebarMenuButton
        size="lg"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full justify-start rounded-xl text-sm font-medium transition-colors h-12 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
      >
        {isLoggingOut ? (
          <Loader2 className="w-5 h-5 mr-3 shrink-0 animate-spin" />
        ) : (
          <LogOut className="w-5 h-5 mr-3 shrink-0" />
        )}
        <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
