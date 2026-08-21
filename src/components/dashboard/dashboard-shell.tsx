"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  Users,
  Package,
  FileText,
  Target,
  Bell,
  Settings,
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "brand" | "success" | "warning";
  category: "Core" | "Operations" | "System";
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "Core",
  },
  {
    title: "AI Command Center",
    href: "/dashboard/ai-command",
    icon: Cpu,
    badge: "Active",
    badgeVariant: "brand",
    category: "Core",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    category: "Core",
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    category: "Operations",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    category: "Operations",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    category: "Operations",
  },
  {
    title: "Goals",
    href: "/dashboard/goals",
    icon: Target,
    badge: "4 Active",
    badgeVariant: "secondary",
    category: "Operations",
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: "3",
    badgeVariant: "warning",
    category: "System",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    category: "System",
  },
];

export function DashboardShell({ children, unreadCount = 0 }: { children: React.ReactNode, unreadCount?: number }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Handle global ⌘K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentNavItem = navItems.find((item) => item.href === pathname) || {
    title: "Overview",
    href: "/dashboard",
  };

  const navCategories: Array<"Core" | "Operations" | "System"> = [
    "Core",
    "Operations",
    "System",
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-neutral-800 selection:text-neutral-100">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/60 backdrop-blur-md shrink-0 select-none">
        {/* Workspace Brand / Org Switcher */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md p-1 -m-1"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-xs tracking-wider shadow-xs group-hover:scale-95 transition-transform duration-150">
              NX
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                Aura Goods
                <span className="size-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Business Tier
              </span>
            </div>
          </Link>

          <Link
            href="/"
            title="Public Website"
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
          >
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Global Quick Search Button */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-neutral-400 dark:hover:border-neutral-700 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="flex items-center gap-2">
              <Search className="size-3.5" />
              <span>Search or jump to...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-background px-1 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {navCategories.map((category) => {
            const categoryItems = navItems.filter(
              (item) => item.category === category
            );
            return (
              <div key={category} className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {category}
                </div>
                {categoryItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const displayBadge = item.title === "Notifications" && unreadCount > 0 ? unreadCount : item.badge;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-foreground text-background shadow-xs font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={cn(
                            "size-4 shrink-0 transition-transform group-hover:scale-105",
                            isActive
                              ? "text-background"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </div>

                      {displayBadge && (
                        <Badge
                          variant={
                            isActive
                              ? "default"
                              : item.badgeVariant || "secondary"
                          }
                          size="sm"
                          className={cn(
                            isActive && "bg-background/20 text-background border-transparent"
                          )}
                        >
                          {displayBadge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* System Uptime Metric Card */}
        <div className="p-3 border-t border-border">
          <div className="rounded-lg border border-border/80 bg-muted/30 p-2.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                Sync Status
              </span>
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
              <span>Last Sync: 2m ago</span>
              <span>Shopify / QBO</span>
            </div>
          </div>
        </div>

        {/* User Account / Profile Footer */}
        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar fallback="AV" size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-foreground">
                Alex Vance
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                alex@nexa.dev
              </span>
            </div>
          </div>
          <ThemeToggle className="size-7" />
        </div>
      </aside>

      {/* Mobile Navigation Drawer Backdrop & Sheet */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in-0 duration-200"
          onClick={() => setMobileNavOpen(false)}
        >
          <aside
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] flex flex-col bg-card border-r border-border p-4 shadow-xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background font-semibold text-xs">
                  NX
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  Aura Goods
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {navCategories.map((category) => {
                const categoryItems = navItems.filter(
                  (item) => item.category === category
                );
                return (
                  <div key={category} className="space-y-1">
                    <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </div>
                    {categoryItems.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      const displayBadge = item.title === "Notifications" && unreadCount > 0 ? unreadCount : item.badge;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                            isActive
                              ? "bg-foreground text-background font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </div>
                          {displayBadge && (
                            <Badge
                              variant={
                                isActive
                                  ? "default"
                                  : item.badgeVariant || "secondary"
                              }
                              size="sm"
                            >
                              {displayBadge}
                            </Badge>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar fallback="AV" size="sm" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">Alex Vance</span>
                  <span className="text-[10px] text-muted-foreground">
                    Admin
                  </span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Nav Toggle */}
            <Button
              variant="outline"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" />
            </Button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors hidden sm:inline"
              >
                Nexa
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground/40 hidden sm:inline" />
              <span className="font-semibold text-foreground">
                {currentNavItem.title}
              </span>
            </nav>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center gap-2">
            {/* Quick Command Trigger for Tablets / Desktops */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors"
            >
              <Search className="size-3.5" />
              <span>Search</span>
              <kbd className="rounded border border-border bg-background px-1 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>

            {/* System Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>

            {/* Notifications Link */}
            <Link href="/dashboard/notifications">
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative text-muted-foreground hover:text-foreground"
                aria-label="View notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-amber-500" />}
              </Button>
            </Link>

            {/* Theme Toggle (Header Visible) */}
            <ThemeToggle className="size-8 hidden sm:inline-flex" />

            {/* Quick Action Button */}
            <Link href="/dashboard/ai-command">
              <Button
                size="sm"
                className="gap-1.5 font-medium shadow-xs"
              >
                <Sparkles className="size-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
                <span className="sm:hidden">Ask</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Main Page Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Command Palette Modal */}
      {commandPaletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-border px-3 py-2">
              <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Type a command or navigate to a section..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Dashboard Navigation
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setCommandPaletteOpen(false)}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                      <span>{item.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
                      {item.href}
                    </span>
                  </Link>
                );
              })}

              <div className="pt-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-t border-border/50">
                Quick Actions
              </div>
              <Link
                href="/dashboard/ai-command"
                onClick={() => setCommandPaletteOpen(false)}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="size-4 text-amber-500" />
                  <span>Generate Revenue Forecast</span>
                </div>
                <Badge variant="outline" size="sm">
                  AI Action
                </Badge>
              </Link>
              <Link
                href="/dashboard/reports"
                onClick={() => setCommandPaletteOpen(false)}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-indigo-500" />
                  <span>Export Monthly Financial Summary</span>
                </div>
                <Badge variant="outline" size="sm">
                  Report
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
