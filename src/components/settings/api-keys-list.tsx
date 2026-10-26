"use client";

import * as React from "react";
import { toast } from "sonner";
import { KeyRound, Plus, Copy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/page-header";

interface ApiKey {
  id: string;
  label: string;
  masked: string;
  createdAt: string;
  lastUsed: string;
}

const INITIAL_KEYS: ApiKey[] = [
  { id: "key-1", label: "Production", masked: "sk_live_••••••••4f2a", createdAt: "2026-08-02", lastUsed: "2 hours ago" },
  { id: "key-2", label: "n8n Webhook Relay", masked: "sk_live_••••••••9c31", createdAt: "2026-09-10", lastUsed: "1 day ago" },
  { id: "key-3", label: "Staging", masked: "sk_test_••••••••11be", createdAt: "2026-09-28", lastUsed: "6 days ago" },
];

function randomKey() {
  const chars = "abcdef0123456789";
  let out = "sk_live_";
  for (let i = 0; i < 32; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function ApiKeysList() {
  const [keys, setKeys] = React.useState(INITIAL_KEYS);
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [generated, setGenerated] = React.useState<string | null>(null);

  function handleGenerate() {
    const key = randomKey();
    setGenerated(key);
    setKeys((prev) => [
      {
        id: `key-${Date.now()}`,
        label: label || "New key",
        masked: `sk_live_••••••••${key.slice(-4)}`,
        createdAt: new Date().toISOString().slice(0, 10),
        lastUsed: "Never",
      },
      ...prev,
    ]);
  }

  function copyKey() {
    if (generated) {
      navigator.clipboard?.writeText(generated).catch(() => {});
      toast.success("Copied to clipboard");
    }
  }

  function resetDialog(o: boolean) {
    setOpen(o);
    if (!o) {
      setGenerated(null);
      setLabel("");
    }
  }

  return (
    <>
      <PageHeader
        title="API Keys"
        description="Keys for programmatic access to your ScalePods OS workspace."
        actions={
          <Dialog open={open} onOpenChange={resetDialog}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Plus className="size-4" />
                Generate new key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Generate API key</DialogTitle>
                <DialogDescription>Give it a label so you can identify it later.</DialogDescription>
              </DialogHeader>
              {!generated ? (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="key-label">Label</Label>
                    <Input
                      id="key-label"
                      placeholder="e.g. Zapier integration"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-3">
                    <code className="truncate text-xs">{generated}</code>
                    <Button size="icon-sm" variant="ghost" onClick={copyKey}>
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-xs text-warning">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    This key is shown only once. Copy it now — you won&apos;t be able to view it again.
                  </div>
                </div>
              )}
              <DialogFooter>
                {!generated ? (
                  <>
                    <Button variant="outline" onClick={() => resetDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerate}>Generate</Button>
                  </>
                ) : (
                  <Button onClick={() => resetDialog(false)}>Done</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-3">
        {keys.map((k) => (
          <Card key={k.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <KeyRound className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{k.label}</p>
                  <code className="text-xs text-muted-foreground">{k.masked}</code>
                </div>
              </div>
              <div className="flex gap-6 text-xs text-muted-foreground">
                <div>
                  <p className="text-[10px] uppercase tracking-wide">Created</p>
                  <p>{k.createdAt}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide">Last used</p>
                  <p>{k.lastUsed}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setKeys((prev) => prev.filter((key) => key.id !== k.id));
                  toast("API key revoked", { description: k.label });
                }}
              >
                Revoke
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
