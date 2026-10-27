"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Rocket } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fmtDate } from "@/lib/mock-data/hr";

const BLANK = {
  name: "",
  description: "",
  jd: "",
  start: "",
  end: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  joining: "",
  rounds: 1,
  roundNames: ["", "", ""],
  weights: { skills: 25, experience: 25, education: 25, jd: 25 },
  active: true,
  quickHire: false,
};

export function CampaignForm() {
  const router = useRouter();
  const [f, setF] = useState(BLANK);
  const set = <K extends keyof typeof BLANK>(k: K, v: (typeof BLANK)[K]) => setF((p) => ({ ...p, [k]: v }));
  const total = f.weights.skills + f.weights.experience + f.weights.education + f.weights.jd;
  const weightsOk = total === 100;

  const submit = () => {
    if (!f.name.trim() || !f.jd.trim() || !f.start || !f.end || !f.location.trim()) {
      toast.error("Campaign name, job description, dates and location are required");
      return;
    }
    if (!weightsOk) {
      toast.error(`Scoring weights must add up to 100 (currently ${total})`);
      return;
    }
    toast.success(`Campaign "${f.name}" created (demo)`);
    router.push("/hr/recruit/campaigns");
  };

  const roundInputs = Array.from({ length: f.rounds }, (_, i) => i);
  const weightFields: { key: keyof typeof BLANK.weights; label: string }[] = [
    { key: "skills", label: "Skills" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "jd", label: "JD Alignment" },
  ];

  return (
    <>
      <PageHeader
        title="Create a Hiring Campaign"
        description="Define the role, interview rounds and how candidates are scored"
        actions={
          <Button variant="ghost" size="sm" onClick={() => setF(BLANK)}>
            <Trash2 className="size-3.5" /> Clear
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campaign details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>
                  Campaign Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={f.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g., Q4 Tech Hiring Campaign"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={f.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Brief description of the campaign"
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  rows={6}
                  value={f.jd}
                  onChange={(e) => set("jd", e.target.value)}
                  placeholder="Paste the full job description here..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input type="date" value={f.start} onChange={(e) => set("start", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input type="date" value={f.end} onChange={(e) => set("end", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={f.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g., Remote / Bangalore Office"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Expected Joining Date</Label>
                  <Input type="date" value={f.joining} onChange={(e) => set("joining", e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Salary Range (LPA)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={f.salaryMin}
                      onChange={(e) => set("salaryMin", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={f.salaryMax}
                      onChange={(e) => set("salaryMax", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interview rounds</CardTitle>
              <CardDescription>Up to three rounds after resume screening</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Label>
                  Number of Rounds <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={3}
                  value={f.rounds}
                  onChange={(e) => set("rounds", Math.min(3, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-20 text-center"
                />
              </div>
              {roundInputs.map((i) => (
                <div key={i} className="space-y-1.5">
                  <Label>Round {i + 1} name</Label>
                  <Input
                    value={f.roundNames[i]}
                    onChange={(e) =>
                      set(
                        "roundNames",
                        f.roundNames.map((n, k) => (k === i ? e.target.value : n)),
                      )
                    }
                    placeholder={["Technical Screening", "System Design", "Founder Round"][i]}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI scoring weights</CardTitle>
              <CardDescription>How resumes are scored against the job description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {weightFields.map((w) => (
                  <div key={w.key} className="space-y-1.5">
                    <Label>{w.label}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={f.weights[w.key]}
                      onChange={(e) =>
                        set("weights", { ...f.weights, [w.key]: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })
                      }
                    />
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${f.weights[w.key]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className={weightsOk ? "text-xs text-success" : "text-xs text-destructive"}>
                Total: {total}% {weightsOk ? "(ready)" : "- weights must add up to 100%"}
              </p>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={f.active} onCheckedChange={(v) => set("active", v)} /> Active campaign
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={f.quickHire} onCheckedChange={(v) => set("quickHire", v)} /> Quick hire
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Campaign" value={f.name || "Q4 Tech Hiring"} />
              <Row
                label="Duration"
                value={f.start && f.end ? `${fmtDate(f.start)} - ${fmtDate(f.end)}` : "Not set"}
              />
              <Row label="Location" value={f.location || "Not set"} />
              <Row label="Rounds" value={String(f.rounds)} />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant="secondary"
                  className={f.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}
                >
                  {f.active ? "Active" : "Draft"}
                </Badge>
              </div>
              <Button className="w-full" onClick={submit}>
                <Rocket className="size-4" /> Launch campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right font-medium">{value}</span>
    </div>
  );
}
