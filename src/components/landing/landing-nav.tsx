import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">ScalePods OS</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
          <a href="#pods" className="hover:text-foreground transition-colors">Pods</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/home/dashboard">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm" className="gap-1.5">Enter workspace</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
