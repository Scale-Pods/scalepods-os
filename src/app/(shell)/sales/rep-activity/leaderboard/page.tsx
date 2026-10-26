"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Trophy, PhoneCall, Mail, MessageCircle, CalendarClock, Zap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { MultiMetricBarChart } from "@/components/sales/charts/multi-metric-bar-chart";
import { TrendLineChart } from "@/components/sales/charts/trend-line-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MOCK_REP_STATS, repResponseTimeSeries } from "@/lib/mock-data/sales";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";

type MetricKey = "meetingsBooked" | "emailsSent" | "whatsappMessages" | "callsLogged";

const METRIC_LABEL: Record<MetricKey, string> = {
  meetingsBooked: "Meetings booked",
  emailsSent: "Emails sent",
  whatsappMessages: "WhatsApp messages",
  callsLogged: "Calls logged",
};

export default function LeaderboardPage() {
  const [metric, setMetric] = React.useState<MetricKey>("meetingsBooked");
  const [logCallOpen, setLogCallOpen] = React.useState(false);

  const reps = MOCK_REP_STATS;
  const totalMeetings = reps.reduce((s, r) => s + r.meetingsBooked, 0);
  const totalCalls = reps.reduce((s, r) => s + r.callsLogged, 0);
  const avgResponse = Math.round(reps.reduce((s, r) => s + r.medianResponseTimeSeconds, 0) / reps.length);

  const chartData = reps.map((r) => ({ name: r.name.split(" ")[0], value: r[metric] }));
  const responseTimeData = React.useMemo(() => repResponseTimeSeries(reps), [reps]);

  function handleLogCall(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const contactId = form.get("contact") as string;
    const contact = MOCK_CONTACTS.find((c) => c.id === contactId);
    toast.success(`Call logged${contact ? ` with ${contact.name}` : ""}`);
    setLogCallOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Leaderboard"
        description="Per-rep activity across calls, emails, WhatsApp and meetings."
        actions={
          <Dialog open={logCallOpen} onOpenChange={setLogCallOpen}>
            <DialogTrigger asChild>
              <Button>
                <PhoneCall className="size-4" />
                Log call
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleLogCall}>
                <DialogHeader>
                  <DialogTitle>Log a call</DialogTitle>
                  <DialogDescription>Manually record a call made outside the system.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="contact">Contact</Label>
                    <Select name="contact" defaultValue={MOCK_CONTACTS[0]?.id}>
                      <SelectTrigger id="contact">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CONTACTS.slice(0, 20).map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input id="duration" name="duration" type="number" defaultValue={12} min={1} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="outcome">Outcome notes</Label>
                    <Textarea id="outcome" name="outcome" placeholder="Discussed headcount needs, sending proposal next." rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save call log</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <KpiCard label="Meetings booked" value={String(totalMeetings)} context="Across all reps" trend="up" trendValue="+9" icon={<CalendarClock className="size-4" />} />
        <KpiCard label="Calls logged" value={String(totalCalls)} context="Manual + agent-assisted" trend="up" trendValue="+14" icon={<PhoneCall className="size-4" />} />
        <KpiCard label="Avg. response time" value={`${avgResponse}s`} context="Across the team" trend="down" trendValue="-5s" trendGood icon={<Zap className="size-4" />} />
        <KpiCard label="Active reps" value={String(reps.length)} context="Tracked this period" icon={<Trophy className="size-4" />} />
      </div>

      <Card className="mb-6">
        <CardContent className="px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Compare reps</h3>
            <Select value={metric} onValueChange={(v) => setMetric(v as MetricKey)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(METRIC_LABEL).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Emails vs calls vs meetings — all reps</h3>
            <MultiMetricBarChart reps={reps} height={260} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="px-4 py-4">
            <h3 className="mb-3 text-sm font-semibold">Median response time by rep (fastest first)</h3>
            <TrendLineChart
              data={responseTimeData}
              xKey="name"
              yKey="medianResponseTimeSeconds"
              valueFormatter={(v) => `${v}s`}
              height={260}
              color="var(--accent)"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {reps.map((rep, i) => (
          <Card key={rep.memberId}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center text-sm font-semibold text-muted-foreground">#{i + 1}</span>
                <InitialsAvatar name={rep.name} />
                <div>
                  <p className="text-sm font-medium">{rep.name}</p>
                  <p className="text-xs text-muted-foreground">Median response {rep.medianResponseTimeSeconds}s</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Stat icon={Mail} value={rep.emailsSent} label="emails" />
                <Stat icon={MessageCircle} value={rep.whatsappMessages} label="WhatsApp" />
                <Stat icon={PhoneCall} value={rep.callsLogged} label="calls" />
                <Stat icon={CalendarClock} value={rep.meetingsBooked} label="meetings" highlight />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  highlight,
}: {
  icon: typeof Mail;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5 text-right">
      <Icon className="size-3.5 text-muted-foreground" />
      <div>
        <p className={highlight ? "font-semibold text-success" : "font-medium"}>{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
