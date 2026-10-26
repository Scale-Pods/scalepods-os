import { ArrowDownRight, ArrowUpRight, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TILES = [
  { label: "Pipeline value", value: "$486K", trend: "+9.2%", up: true },
  { label: "Median response time", value: "42s", trend: "-8s", up: true },
  { label: "Candidates in pipeline", value: "286", trend: "+32", up: true },
  { label: "AI cost this month", value: "$214", trend: "+4.1%", up: false },
];

export function ProductPreview() {
  return (
    <section className="px-4 pb-16 md:px-6 md:pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border bg-card/60 p-2 shadow-2xl shadow-primary/5 backdrop-blur">
          <div className="flex items-center gap-2 border-b px-3 py-2.5">
            <Circle className="size-2.5 fill-destructive text-destructive" />
            <Circle className="size-2.5 fill-warning text-warning" />
            <Circle className="size-2.5 fill-success text-success" />
            <span className="ml-2 text-xs text-muted-foreground">scalepods.os/home/dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {TILES.map((t) => (
              <Card key={t.label} className="gap-1 py-3">
                <CardContent className="px-3">
                  <p className="text-xs text-muted-foreground">{t.label}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <p className="text-xl font-semibold tracking-tight">{t.value}</p>
                    <span
                      className={`flex items-center text-[11px] font-medium ${
                        t.up ? "text-success" : "text-destructive"
                      }`}
                    >
                      {t.up ? (
                        <ArrowUpRight className="size-3" />
                      ) : (
                        <ArrowDownRight className="size-3" />
                      )}
                      {t.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 pt-0 sm:grid-cols-3">
            {[
              { name: "Lead Response", status: "Active" },
              { name: "CV Screening Agent", status: "Running" },
              { name: "Payment Reminders", status: "Idle" },
            ].map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between rounded-lg border bg-background/40 px-3 py-2.5 text-sm"
              >
                <span className="font-medium">{agent.name}</span>
                <span
                  className={`flex items-center gap-1.5 text-xs ${
                    agent.status === "Idle" ? "text-muted-foreground" : "text-success"
                  }`}
                >
                  <Circle className="size-1.5 fill-current" />
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
