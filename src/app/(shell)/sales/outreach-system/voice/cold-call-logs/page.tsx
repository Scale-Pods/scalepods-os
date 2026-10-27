"use client";

import { DETAIL_DIALOG_CLASS } from "@/components/shared/detail-dialog";
import { silentWavDataUri } from "@/lib/silent-audio";
import * as React from "react";
import { ArrowRight, PhoneIncoming, PhoneOutgoing, Clock, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { AccountBadge } from "@/components/sales/outreach-system/account-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { coldVoiceCallLog, type VoiceLogEntry } from "@/lib/mock-data/outreach-system";

const STATUS_VARIANT: Record<VoiceLogEntry["status"], { label: string; className: string }> = {
  completed: { label: "Completed", className: "bg-success/15 text-success border-0" },
  no_answer: { label: "No answer", className: "bg-muted text-muted-foreground border-0" },
  failed: { label: "Failed", className: "bg-destructive/15 text-destructive border-0" },
};

function formatDuration(seconds: number) {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceColdCallLogsPage() {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<VoiceLogEntry | null>(null);

  const coldLog = React.useMemo(() => coldVoiceCallLog(), []);
  const filtered = coldLog.filter(
    (c) =>
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Cold Call Logs" description="Outbound cold-dial calls only — excludes warm/follow-up calls." />

      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search contact or company..." />

      <Card>
        <CardContent className="px-0 py-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Direction</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Account</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-[11px] uppercase text-muted-foreground">Recording</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setActive(row)}>
                    <TableCell>
                      <p className="font-medium">{row.contact}</p>
                      <p className="text-xs text-muted-foreground">{row.company}</p>
                    </TableCell>
                    <TableCell>
                      {row.direction === "inbound" ? (
                        <Badge className="gap-1 border-0 bg-primary text-primary-foreground">
                          <PhoneIncoming className="size-3" /> Inbound
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <PhoneOutgoing className="size-3" /> Outbound
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell><AccountBadge account={row.account} /></TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_VARIANT[row.status].className}>
                        {STATUS_VARIANT[row.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDuration(row.durationSeconds)}</TableCell>
                    <TableCell>
                      {row.recording === "available" && (
                        <Badge variant="outline" className="border-0 bg-success/15 text-success">Available</Badge>
                      )}
                      {row.recording === "processing" && (
                        <Badge variant="outline" className="border-0 bg-warning/15 text-warning">Processing</Badge>
                      )}
                      {row.recording === "none" && <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} results
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className={DETAIL_DIALOG_CLASS}>
          {active && (
            <>
              <DialogHeader>
                <DialogTitle>Call details</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/40 p-3 text-center text-xs">
                <div>
                  <Badge variant="outline" className={STATUS_VARIANT[active.status].className}>
                    {STATUS_VARIANT[active.status].label}
                  </Badge>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="flex items-center gap-1 font-semibold"><Clock className="size-3" /> {formatDuration(active.durationSeconds)}</span>
                  <p className="text-muted-foreground">Duration</p>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="flex items-center gap-1 font-semibold"><Calendar className="size-3" /> {new Date(active.calledAt).toLocaleDateString()}</span>
                  <p className="text-muted-foreground">Date &amp; time</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Call information</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">From</p>
                    <p className="text-sm font-medium">
                      {active.direction === "inbound" ? active.contact : active.account.label}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">To</p>
                    <p className="text-sm font-medium">
                      {active.direction === "inbound" ? active.account.label : active.contact}
                    </p>
                  </div>
                </div>
              </div>

              {active.recording === "available" ? (
                <div>
                  <audio controls src={silentWavDataUri()} className="w-full" />
                  <p className="mt-1 text-[11px] text-muted-foreground">Demo environment — playback is not wired to a real recording.</p>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  {active.recording === "processing" ? "Recording is being processed…" : "No recording available."}
                </p>
              )}

              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground">Transcript</p>
                <div className="rounded-lg border bg-muted/40 p-4 text-sm whitespace-pre-line text-muted-foreground">
                  {active.transcript ?? "No transcript available."}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
