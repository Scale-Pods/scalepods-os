import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CASES = [
  {
    name: "Lotus Manor",
    location: "Dubai, UAE",
    pod: "Sales Pod",
    stats: [
      { label: "Prospects contacted", value: "1,000+" },
      { label: "Response rate", value: "21%" },
      { label: "Hours saved weekly", value: "25+" },
    ],
  },
  {
    name: "ZV Steels",
    location: "India",
    pod: "HR Pod",
    stats: [
      { label: "CVs screened per role", value: "150+" },
      { label: "Time to shortlist", value: "1.8 days" },
      { label: "Avg. fit score", value: "76/100" },
    ],
  },
  {
    name: "A Squared",
    location: "Dubai, UAE",
    pod: "Sales Pod",
    stats: [
      { label: "Median response time", value: "42s" },
      { label: "Meetings booked", value: "34/mo" },
      { label: "Pipeline value", value: "$486K" },
    ],
  },
  {
    name: "Lootah Group",
    location: "Dubai, UAE",
    pod: "Operations Pod",
    stats: [
      { label: "Invoices tracked", value: "200+" },
      { label: "Amount recovered", value: "$58K" },
      { label: "Avg. days to pay", value: "-6.1%" },
    ],
  },
];

export function CaseStudies() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 text-accent border-accent/30 bg-accent/10">
            Success stories
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by lean teams across three continents
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c) => (
            <Card key={c.name}>
              <CardContent className="px-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.location}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{c.pod}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {c.stats.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                      <span className="text-sm font-semibold text-accent">{s.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Illustrative figures based on representative ScalePods deployments.
        </p>
      </div>
    </section>
  );
}
