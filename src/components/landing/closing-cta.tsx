import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCta() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent/5 px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to automate smarter?
          <br />
          Let&apos;s build together.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Spin up a workspace, pick your industry template and see AI-screened candidates or
          AI-answered leads inside two minutes.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/onboarding">
            <Button size="lg" className="gap-2 px-6">
              Enter workspace
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/home/dashboard">
            <Button size="lg" variant="outline" className="px-6">
              View live demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
