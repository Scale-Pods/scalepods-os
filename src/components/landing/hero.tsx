"use client";

import Link from "next/link";
import { ArrowRight, Play, Users, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 md:px-6 md:pt-28 md:pb-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.55 0.22 262 / 0.35), transparent)",
        }}
      />
      <div className="mx-auto max-w-5xl text-center">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 border-accent/30 bg-accent/10 px-3 py-1 text-accent"
        >
          <Zap className="size-3" />
          15 months of AI systems, now one product
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Automate the busywork.
          <br />
          <span className="text-primary">Unlock growth.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          One login, one workspace, many AI-powered apps. ScalePods OS packages the AI agents
          that answer leads, screen CVs, draft content and chase invoices into a single platform —
          built around agents that do the work, not forms that people fill in.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/onboarding">
            <Button size="lg" className="gap-2 px-6">
              Enter workspace
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/home/dashboard">
            <Button size="lg" variant="outline" className="gap-2 px-6">
              <Play className="size-4" />
              View live demo
            </Button>
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 text-accent" />
            Built across India, UAE &amp; the USA
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="size-3.5 text-accent" />
            60s median lead response time
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-accent" />
            12,000+ AI actions logged this month
          </span>
        </div>
      </div>
    </section>
  );
}
