import { MessageSquare, MessageSquareReply, FileSearch, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatChipProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function StatChip({ icon, label, value }: StatChipProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-3.5 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

interface AiAgentsStripProps {
  messagesSent: number;
  repliesReceived: number;
  cvsScreened: number;
  awaitingApproval: number;
}

export function AiAgentsStrip({
  messagesSent,
  repliesReceived,
  cvsScreened,
  awaitingApproval,
}: AiAgentsStripProps) {
  return (
    <Card>
      <CardContent className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">AI agents today</p>
          <p className="text-xs text-muted-foreground">Across every installed app</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatChip
            icon={<MessageSquare className="size-4" />}
            label="Messages sent"
            value={messagesSent.toLocaleString()}
          />
          <StatChip
            icon={<MessageSquareReply className="size-4" />}
            label="Replies received"
            value={repliesReceived.toLocaleString()}
          />
          <StatChip
            icon={<FileSearch className="size-4" />}
            label="CVs screened"
            value={cvsScreened.toLocaleString()}
          />
          <StatChip
            icon={<ClipboardCheck className="size-4" />}
            label="Awaiting approval"
            value={awaitingApproval.toLocaleString()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
