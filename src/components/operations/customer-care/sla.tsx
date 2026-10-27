"use client";

import * as React from "react";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { CC_AUTOMATION_COVERAGE, CC_QUICK_ACTIONS, CC_SLA_RULES } from "@/lib/mock-data/customer-care";
import { Bar, Field, Pill, pctTone } from "./shared";

export function SlaPage() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const rule = CC_SLA_RULES.find((r) => r.id === openId) ?? null;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <PageHeader title="SLA Dashboard" description="Compliance against support targets and automation coverage." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">SLA compliance monitor</CardTitle></CardHeader>
          <CardContent>
            {CC_SLA_RULES.map((r) => (
              <button key={r.id} onClick={() => setOpenId(r.id)} className="flex w-full items-center justify-between border-b py-3 text-left last:border-0 hover:bg-muted/40">
                <div>
                  <p className="text-sm font-medium">{r.rule}</p>
                  <p className="text-xs text-muted-foreground">Target: {r.target}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${r.met ? "text-success" : "text-destructive"}`}>{r.actual}</p>
                  <Pill tone={r.met ? "green" : "red"}>{r.met ? "MET" : "BREACH"}</Pill>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">AI automation coverage</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {CC_AUTOMATION_COVERAGE.map((c) => (
                <div key={c.label}>
                  <div className="mb-1 flex justify-between text-xs"><span>{c.label}</span><span className="font-semibold">{c.pct}%</span></div>
                  <Bar pct={c.pct} tone={pctTone(c.pct === 100 ? 100 : c.pct)} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Quick actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {CC_QUICK_ACTIONS.map((a) => (
                <Button key={a} variant="outline" className="w-full justify-start" onClick={() => toast.success(a)}>
                  <ChevronRight className="size-3.5" /> {a}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {rule && (
        <Dialog open onOpenChange={(o) => !o && setOpenId(null)}>
          <DialogContent className={DETAIL_DIALOG_CLASS}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">{rule.rule} <Pill tone={rule.met ? "green" : "red"}>{rule.met ? "MET" : "BREACH"}</Pill></DialogTitle>
              <DialogDescription>{rule.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4"><Field label="Target">{rule.target}</Field><Field label="Actual">{rule.actual}</Field></div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Last 7 days - % of tickets within SLA</p>
              <div className="flex h-32 items-end gap-2">
                {rule.trend.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px]">{v}%</span>
                    <div className="w-full rounded-t bg-primary" style={{ height: `${Math.max(8, (v - 80) * 4.5)}px` }} />
                    <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
