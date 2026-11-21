"use client";

// Adapted from the shadcn dashboard-01 block (ui.shadcn.com/blocks), trimmed to what the
// enquiries dashboard needs.

import { ExternalLinkIcon, InboxIcon, LogOutIcon } from "lucide-react";
import { logout } from "@/app/admin/actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({
  open,
  ...props
}: React.ComponentProps<typeof Sidebar> & { open: number }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <nav aria-label="Admin" className="contents">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <a
                href="/admin"
                className="flex h-11 items-baseline gap-2 rounded-md px-2 pt-2 font-display text-[22px] leading-none font-medium tracking-[-0.05em]"
              >
                <span>
                  sys<span className="text-signal-text">v</span>elop
                </span>
                <span className="font-sans text-xs font-medium tracking-normal text-muted-foreground">
                  Admin
                </span>
              </a>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Contact</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive
                    tooltip="Enquiries"
                    render={<a href="/admin" />}
                  >
                    <InboxIcon />
                    <span>Enquiries</span>
                  </SidebarMenuButton>
                  {open > 0 ? (
                    <SidebarMenuBadge>{open}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="View site"
                    render={
                      <a href="/" target="_blank" rel="noopener noreferrer" />
                    }
                  >
                    <ExternalLinkIcon />
                    <span>View site</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <form action={logout}>
                <SidebarMenuButton type="submit" tooltip="Log out">
                  <LogOutIcon />
                  <span>Log out</span>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </nav>
    </Sidebar>
  );
}
