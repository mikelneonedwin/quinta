import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth";
import { FileText, Briefcase, LayoutDashboard, Globe } from "lucide-react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavMenuItem } from "./nav-menu-item";
import { LogoutButton } from "./logout-button";
import { ThemeSelector } from "./theme-selector";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const heads = await headers();
  const session = await auth.api.getSession({
    headers: heads,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarContent className="pt-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                <NavMenuItem
                  label="Overview"
                  href="/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5 mr-3 shrink-0" />}
                  exact
                />
                <NavMenuItem
                  label="Articles"
                  href="/dashboard/articles"
                  icon={<FileText className="w-5 h-5 mr-3 shrink-0" />}
                />
                <NavMenuItem
                  label="Projects"
                  href="/dashboard/projects"
                  icon={<Briefcase className="w-5 h-5 mr-3 shrink-0" />}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-border/40 gap-2">
          <ThemeSelector />
          <SidebarMenu className="gap-1.5">
            <SidebarMenuItem className="relative px-2 py-1">
              <SidebarMenuButton
                size="lg"
                render={<Link href="/" />}
                className="w-full justify-start rounded-xl text-sm font-medium transition-colors h-12 px-4 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <Globe className="w-5 h-5 mr-3 shrink-0" />
                <span>View Public Site</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <LogoutButton />
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
          <SidebarTrigger />
        </header>
        <div className="flex-1 overflow-y-auto bg-muted/10 p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
