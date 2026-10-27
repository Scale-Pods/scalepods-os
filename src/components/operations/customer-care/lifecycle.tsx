"use client";

import * as React from "react";
import { toast } from "sonner";
import { CheckCircle2, Send, Smartphone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { cn } from "@/lib/utils";
import {
  CC_AUTOMATION_RULES,
  CC_ORDERS,
  buildOrderTimeline,
  ccFmtDateTime,
  type CcOrder,
} from "@/lib/mock-data/customer-care";
import { Bar, Field, inr, Pill } from "./shared";

export function OrderLifecyclePage() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const order = CC_ORDERS.find((o) => o.id === openId) ?? null;

  return (
    <>
      <PageHeader
        title="Order Lifecycle"
        description="Every stage triggers an automatic WhatsApp message to the customer. Open an order to preview each message."
      />

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CC_ORDERS.map((o) => {
                const tl = buildOrderTimeline(o);
                return (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => setOpenId(o.id)}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell className="max-w-48 truncate text-xs">{o.product}</TableCell>
                    <TableCell className="text-xs">{o.carrier}<div className="text-muted-foreground">{o.trackId}</div></TableCell>
                    <TableCell className="min-w-36">
                      <div className="mb-1 text-xs">{tl[o.currentStage].stage} ({o.currentStage + 1}/{tl.length})</div>
                      <Bar pct={((o.currentStage + 1) / tl.length) * 100} tone={o.currentStage === 6 ? "green" : "primary"} />
                    </TableCell>
                    <TableCell className="text-right">{inr(o.amount)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Card className="h-fit">
          <CardHeader><CardTitle className="text-sm">Automation rules active</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {CC_AUTOMATION_RULES.map((r) => (
              <div key={r.stage} className="border-b pb-2 text-sm last:border-0">
                <div className="flex justify-between"><span className="font-medium">{r.stage}</span><span className="text-xs text-muted-foreground">{r.sentToday} sent today</span></div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>{r.rule}</span><span>{r.deliveryRate}% delivered</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <OrderDialog order={order} onClose={() => setOpenId(null)} />
    </>
  );
}

function OrderDialog({ order, onClose }: { order: CcOrder | null; onClose: () => void }) {
  return order ? <OrderDialogInner key={order.id} order={order} onClose={onClose} /> : null;
}

function OrderDialogInner({ order, onClose }: { order: CcOrder; onClose: () => void }) {
  const [step, setStep] = React.useState(0);
  const tl = buildOrderTimeline(order);
  const cur = tl[step];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        <DialogHeader>
          <DialogTitle>Order {order.id} - {order.customer}</DialogTitle>
          <DialogDescription>{order.product} · {inr(order.amount)} · {order.payment}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline &amp; WhatsApp</TabsTrigger>
            <TabsTrigger value="details">Order details</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              {tl.map((s, i) => (
                <button
                  key={s.stage}
                  onClick={() => setStep(i)}
                  className={cn("flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted/50", step === i && "bg-muted")}
                >
                  <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", s.done ? "bg-success text-white" : step === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    {s.done ? <CheckCircle2 className="size-4" /> : i + 1}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{s.stage}</span>
                    <span className="block text-[11px] text-muted-foreground">{s.trigger}</span>
                  </span>
                  <span className="text-right text-[11px] text-muted-foreground">{s.time}</span>
                </button>
              ))}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-semibold"><Smartphone className="size-4 text-success" /> WhatsApp preview</span>
                <span className="text-xs text-muted-foreground">Stage {step + 1}: {cur.stage}</span>
              </div>
              <div className="rounded-xl bg-neutral-900 p-3">
                <div className="rounded-t-lg bg-[#075e54] px-3 py-2 text-xs font-bold text-white">Shills Beauty (Official)</div>
                <div className="min-h-44 rounded-b-lg bg-black p-3">
                  <div className="ml-auto max-w-[90%] rounded-lg bg-[#1f2c34] p-3">
                    <p className="whitespace-pre-line text-xs leading-relaxed text-[#e9edef]">{cur.waMsg}</p>
                    <p className="mt-1 text-right text-[10px] text-[#8696a0]">{cur.done ? cur.time : "Pending"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="flex-1" onClick={() => toast.success(`WhatsApp sent to ${order.customer}: "${cur.stage}"`)}>
                  <Send className="size-3.5" /> Send this message now
                </Button>
                <Button variant="outline" onClick={() => toast.info("Message copied to clipboard.")}>Copy</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-3">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Order ID">{order.id}</Field>
              <Field label="Customer">{order.customer}</Field>
              <Field label="Placed">{ccFmtDateTime(order.placedAt)}</Field>
              <Field label="Product">{order.product}</Field>
              <Field label="Amount">{inr(order.amount)}</Field>
              <Field label="Payment">{order.payment}</Field>
              <Field label="Delivery to">{order.city}</Field>
              <Field label="Carrier">{order.carrier}</Field>
              <Field label="Tracking ID">{order.trackId}</Field>
              <Field label="Current stage"><Pill tone={order.currentStage === 6 ? "green" : "blue"}>{tl[order.currentStage].stage}</Pill></Field>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
