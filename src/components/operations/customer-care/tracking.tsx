"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Clock, MapPin, RefreshCw, Smartphone, Truck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { CC_CARRIER_PERFORMANCE, CC_EXCEPTION_RULES, CC_SHIPMENTS, ccFmtDateTime, type CcShipment } from "@/lib/mock-data/customer-care";
import { Bar, Field, Pill } from "./shared";

const tone = (s: CcShipment["status"]) =>
  s === "Delivered" ? "green" : s === "Exception" ? "red" : s === "Out for Delivery" ? "blue" : "orange";

export function CarrierTrackingPage() {
  const [loading, setLoading] = React.useState(false);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const ship = CC_SHIPMENTS.find((s) => s.id === openId) ?? null;

  const pull = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Live tracking pulled from all carrier APIs.");
    }, 1200);
  };

  return (
    <>
      <PageHeader
        title="Carrier Tracking"
        description="Real-time status from each carrier's API, with automatic WhatsApp updates."
        actions={
          <Button size="sm" onClick={pull} disabled={loading}>
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Pull all statuses
          </Button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[3fr_2fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {CC_SHIPMENTS.map((s) => (
            <Card key={s.id} className="cursor-pointer gap-2 py-4 transition-shadow hover:shadow-md" onClick={() => setOpenId(s.id)}>
              <CardContent className="space-y-2 px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{s.carrier}</p>
                    <p className="text-xs text-muted-foreground">{s.trackId} · {s.orderId}</p>
                  </div>
                  <Pill tone={tone(s.status)}>{s.status}</Pill>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="size-3" />{s.location}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{s.updated}</span>
                </div>
                <p className="text-xs"><span className="text-muted-foreground">ETA: </span><span className={s.status === "Exception" ? "font-semibold text-destructive" : "font-semibold"}>{s.eta}</span></p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><Truck className="size-4 text-primary" /> Carrier performance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {CC_CARRIER_PERFORMANCE.map((c) => (
                <div key={c.carrier}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{c.carrier} <span className="text-muted-foreground">· {c.shipments} shipments · {c.avgDays}d avg · {c.rto}% RTO</span></span>
                    <span className="font-semibold">{c.onTime}% on-time</span>
                  </div>
                  <Bar pct={c.onTime} tone={c.onTime >= 90 ? "green" : "orange"} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Exception handling rules</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {CC_EXCEPTION_RULES.map((r) => (
                <div key={r.trigger} className="flex gap-2 text-sm">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                  <div><p className="font-medium">{r.trigger}</p><p className="text-xs text-muted-foreground">{r.action}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {ship && (
        <Dialog open onOpenChange={(o) => !o && setOpenId(null)}>
          <DialogContent className={DETAIL_DIALOG_CLASS}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">{ship.carrier} {ship.trackId} <Pill tone={tone(ship.status)}>{ship.status}</Pill></DialogTitle>
              <DialogDescription>Order {ship.orderId} for {ship.customer}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => toast.success(`WhatsApp update sent for ${ship.trackId}: "${ship.status} - ${ship.location}"`)}>
                <Smartphone className="size-3.5" /> WA update
              </Button>
              {ship.status === "Exception" && (
                <Button size="sm" variant="outline" onClick={() => toast.error(`Escalated ${ship.trackId} exception to the ops team.`)}>
                  <AlertTriangle className="size-3.5" /> Escalate
                </Button>
              )}
            </div>
            <Tabs defaultValue="events">
              <TabsList>
                <TabsTrigger value="events">Scan events</TabsTrigger>
                <TabsTrigger value="info">Shipment info</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="mt-3 space-y-2">
                {[...ship.history].reverse().map((h, i) => (
                  <div key={i} className="flex gap-3 border-b pb-2 text-sm last:border-0">
                    <span className="w-28 shrink-0 text-xs text-muted-foreground">{ccFmtDateTime(h.at)}</span>
                    <div><p className="font-medium">{h.event}</p><p className="text-xs text-muted-foreground">{h.location}</p></div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="info" className="mt-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <Field label="Carrier">{ship.carrier}</Field>
                  <Field label="Tracking ID">{ship.trackId}</Field>
                  <Field label="Order">{ship.orderId}</Field>
                  <Field label="Customer">{ship.customer}</Field>
                  <Field label="Location">{ship.location}</Field>
                  <Field label="ETA">{ship.eta}</Field>
                  <Field label="Last update">{ship.updated}</Field>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
