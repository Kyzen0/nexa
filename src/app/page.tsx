import React from "react";
import Link from "next/link";
import {
  BarChart3,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  PackageSearch,
  LineChart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Financial Insights",
      description:
        "Automatically detect revenue anomalies, forecast cash flow, and identify growth opportunities across all your sales channels.",
    },
    {
      icon: LineChart,
      title: "Unified Commerce Analytics",
      description:
        "Connect your POS, e-commerce, and accounting platforms to get a single, real-time source of truth for your business health.",
    },
    {
      icon: PackageSearch,
      title: "Predictive Inventory Management",
      description:
        "Never run out of stock. Nexa predicts demand spikes and optimizes your reorder points based on historical sales data.",
    },
  ];

  const metrics = [
    { value: "32%", label: "Average Margin Increase" },
    { value: "15 hrs", label: "Weekly Time Saved" },
    { value: "$2.4B+", label: "Processed SMB Revenue" },
    { value: "99.8%", label: "Forecasting Accuracy" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-neutral-800 selection:text-neutral-100">
      {/* Top Announcement Bar */}
      <div className="border-b border-border/70 bg-muted/30 px-4 py-1.5 text-center text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Nexa BI v2.4</span>
        <span className="mx-2 text-muted-foreground/50">•</span>
        <span>The intelligent growth platform for modern SMBs</span>
        <Link
          href="/dashboard"
          className="ml-2 font-medium text-foreground hover:underline inline-flex items-center gap-0.5"
        >
          <span>Explore Live Console</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo Mark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background font-bold text-xs tracking-wider shadow-xs group-hover:scale-95 transition-transform duration-150">
              NX
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Nexa
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Platform
            </a>
            <a href="#insights" className="hover:text-foreground transition-colors">
              Insights
            </a>
            <a href="#metrics" className="hover:text-foreground transition-colors">
              Results
            </a>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Console
            </Link>
          </nav>

          {/* Header Action Items */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle className="size-8" />
            <Link href="/dashboard">
              <Button size="sm" className="gap-1.5 font-medium text-xs shadow-xs">
                <span>Launch Console</span>
                <ArrowUpRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] font-medium text-foreground">
                AI Business Assistant Live
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">Trusted by 2,000+ Businesses</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              The intelligent business platform for growth.
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Nexa unifies your revenue, inventory, and customer data, delivering AI-powered insights that help your small business scale effortlessly.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 font-medium text-xs px-5 shadow-sm">
                  <span>Open Dashboard Console</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <a href="#insights" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-medium text-xs px-5">
                  <BarChart3 className="size-4 text-muted-foreground" />
                  <span>See How It Works</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Interactive Hero Product Mockup */}
          <div className="mx-auto max-w-5xl pt-12 sm:pt-16">
            <div className="rounded-xl border border-border bg-card/90 shadow-2xl p-2 sm:p-3 text-left">
              {/* Mockup Header Bar */}
              <div className="flex items-center justify-between border-b border-border/80 px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="size-2.5 rounded-full bg-border" />
                    <div className="size-2.5 rounded-full bg-border" />
                    <div className="size-2.5 rounded-full bg-border" />
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground ml-2">
                    nexa.app/dashboard/overview
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Live Data Syncing
                  </span>
                </div>
              </div>

              {/* Mockup Content Grid */}
              <div className="p-4 sm:p-6 space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">Total Revenue</div>
                    <div className="text-lg font-bold font-mono text-foreground">$124,500.00</div>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">Net Margin</div>
                    <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">24.8%</div>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">Active Orders</div>
                    <div className="text-lg font-bold font-mono text-foreground">342</div>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">Inventory Health</div>
                    <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">Good</div>
                  </div>
                </div>

                {/* AI Insights Feed */}
                <div className="rounded-lg border border-border/80 bg-background/50 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Zap className="size-3.5 text-amber-500" />
                      <span>AI Business Insights</span>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">Updated just now</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between rounded bg-muted/30 px-2.5 py-1 text-muted-foreground">
                      <span>[Growth] Revenue from recurring customers increased by 15% this week.</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Actionable</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-muted/30 px-2.5 py-1 text-muted-foreground">
                      <span>[Inventory] &apos;Artisan Coffee Blend&apos; is predicted to stock out in 4 days.</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">Reorder</span>
                    </div>
                    <div className="flex items-center justify-between rounded bg-muted/30 px-2.5 py-1 text-muted-foreground">
                      <span>[Marketing] Recent email campaign drove $4,200 in attributed sales.</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Trust Logos */}
        <section className="border-y border-border/70 bg-muted/20 py-10 px-4">
          <div className="mx-auto max-w-5xl text-center space-y-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Trusted by growing retail, e-commerce, and service businesses
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
              <span className="font-mono text-sm font-semibold tracking-wider">AURA GOODS</span>
              <span className="font-mono text-sm font-semibold tracking-wider">LUMINA RETAIL</span>
              <span className="font-mono text-sm font-semibold tracking-wider">NOVA ROASTERS</span>
              <span className="font-mono text-sm font-semibold tracking-wider">ATLAS SUPPLY</span>
              <span className="font-mono text-sm font-semibold tracking-wider">MERIDIAN CO.</span>
            </div>
          </div>
        </section>

        {/* Core Pillars Feature Grid */}
        <section id="features" className="px-4 py-20 sm:py-28 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Everything you need to run your business, all in one place.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Stop juggling spreadsheets. Nexa brings your finances, operations, and customers together with actionable AI guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
                  <CardContent className="p-6 space-y-3">
                    <div className="size-9 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center text-foreground">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Code / Architecture Preview Section */}
        <section id="insights" className="border-t border-border bg-muted/20 px-4 py-20 sm:py-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="brand" size="sm">
                Developer Friendly
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Connect your existing tools in minutes.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Use our pre-built integrations for Shopify, Square, and QuickBooks, or use our simple API to push custom commerce events directly into your Nexa dashboard.
              </p>
              <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Real-time webhook ingestion for orders and inventory</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Automated data normalization and currency conversion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Secure, encrypted data storage and compliance</span>
                </div>
              </div>
            </div>

            {/* Terminal Code Snippet */}
            <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/80 px-4 py-2 bg-muted/30">
                <span className="font-mono text-xs text-muted-foreground">
                  sync-orders.ts
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  TypeScript
                </span>
              </div>
              <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground">
                <div className="text-muted-foreground">{"// 1. Initialize Nexa Client"}</div>
                <div><span className="text-indigo-600 dark:text-indigo-400">import</span> &#123; NexaClient &#125; <span className="text-indigo-600 dark:text-indigo-400">from</span> <span className="text-emerald-600 dark:text-emerald-400">&quot;@nexa/sdk&quot;</span>;</div>
                <div className="mt-2"><span className="text-indigo-600 dark:text-indigo-400">const</span> nexa = <span className="text-indigo-600 dark:text-indigo-400">new</span> <span className="text-amber-600 dark:text-amber-400">NexaClient</span>(&#123;</div>
                <div className="pl-4">apiKey: process.env.<span className="text-foreground">NEXA_API_KEY</span>,</div>
                <div>&#125;);</div>
                <div className="mt-3 text-muted-foreground">{"// 2. Push a new commerce event"}</div>
                <div><span className="text-indigo-600 dark:text-indigo-400">await</span> nexa.events.<span className="text-amber-600 dark:text-amber-400">track</span>(&#123;</div>
                <div className="pl-4">type: <span className="text-emerald-600 dark:text-emerald-400">&quot;order.completed&quot;</span>,</div>
                <div className="pl-4">amount: <span className="text-emerald-600 dark:text-emerald-400">145.00</span>,</div>
                <div className="pl-4">currency: <span className="text-emerald-600 dark:text-emerald-400">&quot;USD&quot;</span>,</div>
                <div className="pl-4">items: [&#123; id: <span className="text-emerald-600 dark:text-emerald-400">&quot;prod_123&quot;</span>, qty: <span className="text-emerald-600 dark:text-emerald-400">2</span> &#125;]</div>
                <div>&#125;);</div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Key Metrics Section */}
        <section id="metrics" className="px-4 py-20 sm:py-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {metrics.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-foreground">
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="border-t border-border bg-muted/30 px-4 py-16 sm:py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to take control of your business data?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Join thousands of SMBs using Nexa to drive growth and streamline operations.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 font-medium text-xs px-6 shadow-sm">
                  <span>Launch Nexa Console</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Footer */}
      <footer className="border-t border-border bg-background py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background font-bold text-[10px]">
              NX
            </div>
            <span>© 2026 Nexa Systems Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="hover:text-foreground transition-colors">
              Platform
            </a>
            <a href="#insights" className="hover:text-foreground transition-colors">
              Insights
            </a>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Console
            </Link>
            <Link href="/dashboard/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
