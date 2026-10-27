"use client";

import * as React from "react";
import { formatRelative } from "@/lib/format";

const subscribe = () => () => {};

/**
 * "12m ago" depends on the current time, so the server and the browser would
 * render different text and trip hydration. The server snapshot is a fixed UTC
 * date; once hydrated the client snapshot switches to the relative form.
 */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const text = React.useSyncExternalStore(
    subscribe,
    () => formatRelative(iso),
    () => new Date(iso).toISOString().slice(0, 10)
  );
  return (
    <span className={className} title={new Date(iso).toISOString()}>
      {text}
    </span>
  );
}
