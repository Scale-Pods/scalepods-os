"use client";

import * as React from "react";
import {
  MOCK_CONTENT_DRAFTS,
  type ContentComment,
  type ContentDraft,
  type ContentStatus,
} from "@/lib/mock-data/marketing";
import { BOARD_TICKETS, type BoardColumnId, type BoardTicket } from "@/components/marketing/mock/workspace";

interface ContentStore {
  drafts: ContentDraft[];
  tickets: BoardTicket[];
  setStatus: (id: string, status: ContentStatus) => void;
  addComment: (id: string, comment: ContentComment) => void;
  moveTicket: (id: string, column: BoardColumnId) => void;
}

const Ctx = React.createContext<ContentStore | null>(null);

/**
 * Session-local store so approve / send back / comment / board moves made in
 * one dialog are reflected by every list, KPI and the board. Seeded from the
 * deterministic mock data; nothing is persisted.
 */
export function ContentStoreProvider({ children }: { children: React.ReactNode }) {
  const [statuses, setStatuses] = React.useState<Record<string, ContentStatus>>({});
  const [extraComments, setExtraComments] = React.useState<Record<string, ContentComment[]>>({});
  const [columns, setColumns] = React.useState<Record<string, BoardColumnId>>({});

  const drafts = React.useMemo(
    () =>
      MOCK_CONTENT_DRAFTS.map((d) => ({
        ...d,
        status: statuses[d.id] ?? d.status,
        comments: [...(extraComments[d.id] ?? []), ...d.comments],
      })),
    [statuses, extraComments]
  );

  const tickets = React.useMemo(
    () => BOARD_TICKETS.map((t) => ({ ...t, column: columns[t.id] ?? t.column })),
    [columns]
  );

  const value = React.useMemo<ContentStore>(
    () => ({
      drafts,
      tickets,
      setStatus: (id, status) => setStatuses((p) => ({ ...p, [id]: status })),
      addComment: (id, comment) => setExtraComments((p) => ({ ...p, [id]: [comment, ...(p[id] ?? [])] })),
      moveTicket: (id, column) => setColumns((p) => ({ ...p, [id]: column })),
    }),
    [drafts, tickets]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContentStore() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useContentStore must be used within ContentStoreProvider");
  return ctx;
}
