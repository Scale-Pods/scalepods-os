"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { silentWavDataUri } from "@/lib/silent-audio";
import { Bubble, RecoveryBadge, SentimentPill, StatusPill, fmtDate, fmtDateTime, inr } from "./shared";
import {
  MOCK_OUTREACH,
  MOCK_PARTY_LEDGER,
  type ConversationEntry,
  type RecoveryOutreachRow,
} from "@/lib/mock-data/receivables";

export type BillTab = "overview" | "invoice" | "email" | "whatsapp" | "voice";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </section>
  );
}

function Thread({ entries, receipt, empty }: { entries: ConversationEntry[]; receipt?: boolean; empty: string }) {
  if (entries.length === 0) return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="max-h-[50vh] space-y-2 overflow-y-auto rounded-lg border bg-muted/20 p-3">
      {entries.map((m, i) => (
        <Bubble key={i} entry={m} receipt={receipt} />
      ))}
    </div>
  );
}

/** Deterministic fake call length so the same call always shows the same duration. */
const callSeconds = (id: number, n: number) => 38 + ((id * 29 + n * 53) % 140);
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * One detail view for a bill: customer, invoice, and every email / WhatsApp / call
 * touch. Opened from every table row and chat pane in the module.
 */
export function BillDetailDialog({
  billNo,
  tab = "overview",
  onClose,
}: {
  billNo: string | null;
  tab?: BillTab;
  onClose: () => void;
}) {
  const ledger = billNo ? MOCK_PARTY_LEDGER.find((l) => l.bill_no === billNo) : undefined;
  const o: RecoveryOutreachRow | undefined = billNo ? MOCK_OUTREACH.find((r) => r.bill_no === billNo) : undefined;
  const audioSrc = React.useMemo(() => silentWavDataUri(), []);

  const partyBills = ledger ? MOCK_PARTY_LEDGER.filter((l) => l.party_name === ledger.party_name) : [];
  const partyOutstanding = partyBills.reduce((s, l) => s + l.Final_Amount, 0);

  return (
    <Dialog open={!!ledger} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={DETAIL_DIALOG_CLASS}>
        {ledger && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
                {ledger.party_name}
                {o ? <StatusPill status={o.status} /> : <RecoveryBadge label={ledger.closed ? "Closed" : "Not yet in outreach"} accent={ledger.closed ? "green" : "neutral"} />}
              </DialogTitle>
              <DialogDescription>
                Bill {ledger.bill_no} · {ledger.voucher_no} · {inr(ledger.debit)} billed {fmtDate(ledger.created_at)}
              </DialogDescription>
            </DialogHeader>

            <Tabs key={`${billNo}-${tab}`} defaultValue={tab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
              </TabsList>

              {/* ----------------------------------------------------------- Overview */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Field label="Outstanding" value={inr(ledger.Final_Amount)} />
                  <Field label="Stage" value={o?.current_stage ?? "Not started"} />
                  <Field label="Next action" value={o ? `${o.next_action}${o.next_action_date ? ` · ${fmtDate(o.next_action_date)}` : ""}` : "—"} />
                  <Field label="Cycle started" value={o ? fmtDate(o.cycle_started_date) : "—"} />
                </div>

                {o?.summary && (
                  <Section title="AI analysis">
                    <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{o.intent}</span>
                        <SentimentPill sentiment={o.sentiment} />
                        {o.sentiment_score !== null && (
                          <span className="text-xs text-muted-foreground">score {o.sentiment_score.toFixed(2)}</span>
                        )}
                        {o.dispute && <RecoveryBadge label="Dispute" accent="red" />}
                        {o.founder_review && <RecoveryBadge label="Founder review" accent="red" />}
                      </div>
                      <p className="mt-1.5 text-muted-foreground">{o.summary}</p>
                    </div>
                  </Section>
                )}

                <Section title="Customer">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Email" value={ledger.email} />
                    <Field label="Phone" value={ledger.phone} />
                    <Field label="GSTIN" value={ledger.gstin} />
                    <Field label="Total outstanding (all bills)" value={inr(partyOutstanding)} />
                  </div>
                </Section>

                <Section title={`All bills for this party (${partyBills.length})`}>
                  <div className="divide-y rounded-lg border text-sm">
                    {partyBills.map((b) => (
                      <div key={b.id} className="flex items-center justify-between gap-3 px-3 py-2">
                        <span className={b.bill_no === ledger.bill_no ? "font-semibold" : ""}>{b.bill_no}</span>
                        <span className="text-xs text-muted-foreground">{fmtDate(b.created_at)}</span>
                        <span className="tabular-nums">{inr(b.Final_Amount)}</span>
                        <RecoveryBadge label={b.closed ? "Closed" : "Open"} accent={b.closed ? "green" : "orange"} />
                      </div>
                    ))}
                  </div>
                </Section>
              </TabsContent>

              {/* ------------------------------------------------------------ Invoice */}
              <TabsContent value="invoice" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Field label="Bill no" value={ledger.bill_no} />
                  <Field label="Voucher no" value={ledger.voucher_no} />
                  <Field label="Particulars" value={ledger.particulars} />
                  <Field label="Debit" value={inr(ledger.debit)} />
                  <Field label="Credit" value={inr(ledger.credit)} />
                  <Field label="Final amount" value={inr(ledger.Final_Amount)} />
                  <Field label="Opening balance" value={inr(ledger.opening_balance)} />
                  <Field label="Running balance" value={inr(ledger.running_balance)} />
                  <Field label="Payment date" value={fmtDate(ledger.Payment_Date)} />
                </div>
                <Field label="Narration" value={ledger.narration} />
                <a
                  href={ledger.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="size-3.5" /> Open invoice PDF
                </a>
              </TabsContent>

              {/* -------------------------------------------------------------- Email */}
              <TabsContent value="email" className="mt-4 space-y-3">
                <p className="text-xs text-muted-foreground">To {ledger.email}</p>
                <Thread entries={o?.email_conversation ?? []} empty="No emails sent for this bill yet." />
              </TabsContent>

              {/* ----------------------------------------------------------- WhatsApp */}
              <TabsContent value="whatsapp" className="mt-4 space-y-3">
                <p className="text-xs text-muted-foreground">To {ledger.phone}</p>
                <Thread entries={o?.wa_conversation ?? []} receipt empty="No WhatsApp messages sent for this bill yet." />
              </TabsContent>

              {/* -------------------------------------------------------------- Voice */}
              <TabsContent value="voice" className="mt-4 space-y-5">
                {!o || !o.call_1_sent_at ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No calls placed for this bill yet.</p>
                ) : (
                  ([
                    [1, o.call_1_content, o.call_1_sent_at, o.call1_url],
                    [2, o.call_2_content, o.call_2_sent_at, o.call2_url],
                  ] as const)
                    .filter(([, , at]) => at)
                    .map(([n, script, at, url]) => {
                      const turns = o.call_conversation.filter((m) => m.stage === `Call ${n}` || (n === 1 && m.stage === "Confirmation"));
                      return (
                        <div key={n} className="space-y-3 rounded-xl border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold">Call {n}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{fmtDateTime(at)}</span>
                              <span>·</span>
                              <span>{mmss(callSeconds(o.id, n))}</span>
                              <RecoveryBadge label={o.call_replied && n === 1 ? "Answered" : "No answer"} accent={o.call_replied && n === 1 ? "green" : "neutral"} />
                            </div>
                          </div>
                          <Section title="Call script">
                            <div className="rounded-lg border bg-muted/40 p-3 text-sm">{script}</div>
                          </Section>
                          <Section title="Recording">
                            <audio controls src={audioSrc} className="w-full" />
                            {url && <p className="mt-1 truncate text-[10px] text-muted-foreground">Source: {url} (demo plays silence)</p>}
                          </Section>
                          <Section title="Transcript">
                            {turns.length === 0 ? (
                              <p className="text-sm italic text-muted-foreground">
                                No pickup — the script above was left as a voicemail.
                              </p>
                            ) : (
                              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                                {turns.map((m, i) => (
                                  <Bubble key={i} entry={m} />
                                ))}
                              </div>
                            )}
                          </Section>
                        </div>
                      );
                    })
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
