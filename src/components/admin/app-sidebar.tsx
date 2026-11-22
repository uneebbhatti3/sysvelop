"use client";

// Adapted from the shadcn dashboard-01 block (ui.shadcn.com/blocks), trimmed to what the
// dashboard needs.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusinessIcon, ExternalLinkIcon, InboxIcon, LayersIcon, LogOutIcon, QuoteIcon } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { site } from "@/content/site";
import { LogoImage } from "@/components/shared/logo";
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
  useSidebar,
} from "@/components/ui/sidebar";

const contentLinks = [
  { href: "/admin/case-studies", label: "Case studies", icon: BriefcaseBusinessIcon },
  { href: "/admin/services", label: "Services", icon: LayersIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: QuoteIcon },
];

export function AppSidebar({
  open,
  ...props
}: React.ComponentProps<typeof Sidebar> & { open: number }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  // The layout persists across pages, so the mobile drawer has to be closed by hand.
  const close = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <nav aria-label="Admin" className="contents">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link
                href="/admin"
                onClick={close}
                className="flex h-11 items-center gap-2 rounded-md px-2"
              >
                <LogoImage className="h-[22px]" />
                <span className="sr-only">{site.name}</span>
                <span className="text-xs font-medium text-muted-foreground">Admin</span>
              </Link>
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
                    isActive={pathname === "/admin"}
                    tooltip="Enquiries"
                    render={<Link href="/admin" onClick={close} aria-current={pathname === "/admin" ? "page" : undefined} />}
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
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {contentLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname.startsWith(href);
                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={label}
                        render={<Link href={href} onClick={close} aria-current={active ? "page" : undefined} />}
                      >
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
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
