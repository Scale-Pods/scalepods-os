"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DemoAdapterBadge, StatusBadge } from "@/components/shared/badges";
import { PlatformBadge } from "@/components/marketing/platform-badge";
import type { EstimatedEngagementRow } from "@/lib/mock-data/marketing";

export function EngagementSummaryTable({ data }: { data: EstimatedEngagementRow[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Estimated engagement</CardTitle>
            <CardDescription>Per published or scheduled piece.</CardDescription>
          </div>
          <DemoAdapterBadge />
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs text-muted-foreground">
          These engagement numbers are simulated. The SocialPublisher integration that will report
          real likes/comments/shares is stubbed for this demo, so figures below are illustrative
          estimates rather than live platform data.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Content</th>
                <th className="py-2 pr-3 font-medium">Platform</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 text-right font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="size-3" /> Likes
                  </span>
                </th>
                <th className="py-2 pr-3 text-right font-medium">
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="size-3" /> Comments
                  </span>
                </th>
                <th className="py-2 text-right font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Share2 className="size-3" /> Shares
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row) => (
                <tr key={row.draftId} className="hover:bg-muted/30">
                  <td className="max-w-56 truncate py-2 pr-3 font-medium">{row.title}</td>
                  <td className="py-2 pr-3">
                    <PlatformBadge platform={row.platform} />
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.likes.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{row.comments.toLocaleString()}</td>
                  <td className="py-2 text-right tabular-nums">{row.shares.toLocaleString()}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No published or scheduled content yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
