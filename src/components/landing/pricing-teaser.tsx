import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Try one app with your team",
    features: ["1 app", "1 seat", "100 AI actions/mo", "50 outbound messages/mo"],
    highlighted: false,
  },
  {
    name: "Basic",
    price: "$149",
    description: "For a single growing team",
    features: ["Up to 5 apps", "5 seats", "2,000 AI actions/mo", "WhatsApp + Email adapters"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$349",
    description: "Most popular for scaling ops",
    features: ["All Pods", "20 seats", "10,000 AI actions/mo", "Outreach sequences", "Executive Board"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$1,099+",
    description: "Custom modules, SSO, dedicated support",
    features: ["Unlimited seats", "Custom Studio apps", "SSO", "Dedicated data residency"],
    highlighted: false,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple plans, per workspace
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Billed in USD via Stripe or INR via Razorpay. Upgrade anytime as your AI usage grows.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col",
                plan.highlighted && "border-primary shadow-lg shadow-primary/10"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most popular
                </Badge>
              )}
              <CardContent className="flex flex-1 flex-col px-5">
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding" className="mt-5">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Get started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
