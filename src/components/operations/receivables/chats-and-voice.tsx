"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { silentWavDataUri } from "@/lib/silent-audio";
import { Bubble, SentimentPill } from "./shared";
import { SplitPane } from "./split-pane";
import { MOCK_OUTREACH } from "@/lib/mock-data/receivables";

/* ----------------------------------------------------------- WhatsApp Chats */

export function WhatsAppChatsPage() {
  const rows = MOCK_OUTREACH.filter((r) => r.wa_conversation.length > 0);

  return (
    <>
      <PageHeader title="WhatsApp Chats" description="Outbound reminders and inbound replies, per party." />
      <SplitPane
        rows={rows}
        emptyDetail="Select a conversation"
        detailTab="whatsapp"
        preview={(r) => {
          const last = r.wa_conversation[r.wa_conversation.length - 1];
          return { text: last.message, at: last.timestamp };
        }}
        detail={(r) => (
          <div className="space-y-2">
            {r.wa_conversation.map((m, i) => (
              <Bubble key={i} entry={m} receipt />
            ))}
          </div>
        )}
      />
    </>
  );
}

/* ---------------------------------------------------------------- Voice Panel */

export function VoicePanelPage() {
  const rows = MOCK_OUTREACH.filter((r) => r.call_1_sent_at);
  const audioSrc = React.useMemo(() => silentWavDataUri(), []);

  return (
    <>
      <PageHeader title="Voice Panel" description="Read-only call log, recording and transcript. Calls are placed by the workflow — there is no dialer here." />
      <SplitPane
        rows={rows}
        emptyDetail="Select a call"
        detailTab="voice"
        preview={(r) => {
          const last = r.call_conversation[r.call_conversation.length - 1];
          return { text: last?.message ?? "Call placed", at: last?.timestamp ?? r.call_1_sent_at ?? undefined };
        }}
        detail={(r) => (
          <div className="space-y-4">
            <section>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Call script</h4>
              <div className="rounded-lg border bg-muted/40 p-3 text-sm">{r.call_1_content}</div>
            </section>

            <section>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recording</h4>
              <audio controls src={audioSrc} className="w-full" />
              {r.call1_url && <p className="mt-1 truncate text-[10px] text-muted-foreground">Source: {r.call1_url} (demo plays silence)</p>}
            </section>

            {r.summary && (
              <section>
                <div className="mb-1.5 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI summary</h4>
                  <SentimentPill sentiment={r.sentiment} />
                </div>
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p className="font-medium">{r.intent}</p>
                  <p className="mt-1 text-muted-foreground">{r.summary}</p>
                </div>
              </section>
            )}

            <section>
              <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Transcript</h4>
              {r.call_conversation.length === 0 ? (
                <p className="text-sm text-muted-foreground">No answer — nothing was transcribed.</p>
              ) : (
                <div className="space-y-2">
                  {r.call_conversation.map((m, i) => (
                    <Bubble key={i} entry={m} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      />
    </>
  );
}
