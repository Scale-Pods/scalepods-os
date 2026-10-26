import { Sparkles } from "lucide-react";

const CURRENT_YEAR = 2026;

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-3.5 text-accent" />
          <span>© {CURRENT_YEAR} ScalePods OS — built by ScalePods</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span>India</span>
          <span>UAE</span>
          <span>USA</span>
        </div>
      </div>
    </footer>
  );
}
