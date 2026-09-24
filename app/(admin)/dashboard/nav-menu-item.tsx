"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavMenuItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
}

export function NavMenuItem({ label, href, icon, exact }: NavMenuItemProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <SidebarMenuItem className="relative px-2 py-1">
      <SidebarMenuButton
        size="lg"
        render={<Link href={href} />}
        isActive={isActive}
        className={cn(
          "w-full justify-start rounded-xl text-sm font-medium transition-colors h-12 px-4 hover:bg-muted",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {icon}
        <span className="truncate">{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
