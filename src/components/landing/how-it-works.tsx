import { Rocket, PlugZap, Sparkle, Gauge } from "lucide-react";

const STEPS = [
  {
    icon: Rocket,
    title: "Create your workspace",
    description: "Sign up, pick an industry template — Staffing, Real Estate, Home Services or General SMB — and your workspace seeds itself with sample data.",
  },
  {
    icon: PlugZap,
    title: "Connect one channel",
    description: "WhatsApp, Gmail or Google Calendar. Each integration sits behind an adapter, so credentials stay encrypted per org.",
  },
  {
    icon: Sparkle,
    title: "Let the agents work",
    description: "Agents screen CVs, answer leads and draft content in the background — auto-send or draft-for-approval, your call, per agent.",
  },
  {
    icon: Gauge,
    title: "Watch it on one dashboard",
    description: "Every KPI tile is a real query against your data. Switch apps, switch orgs — nothing leaks, nothing is hard-coded.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Our simple &amp; smart automation process
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            From signup to your first AI-screened candidate in under two minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-5" />
              </div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
