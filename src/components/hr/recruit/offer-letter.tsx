"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Printer, RotateCcw, User, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OFFER_LETTER_DEFAULTS,
  MOCK_CANDIDATES,
  getCandidateStage,
  fmtDate,
} from "@/lib/mock-data/hr";

type Form = typeof OFFER_LETTER_DEFAULTS;

export function OfferLetter() {
  const [f, setF] = useState<Form>(OFFER_LETTER_DEFAULTS);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const hired = MOCK_CANDIDATES.filter((c) => getCandidateStage(c) === "hired");

  const fill = (id: string) => {
    const c = MOCK_CANDIDATES.find((x) => x.id === id);
    if (!c) return;
    setF((p) => ({ ...p, name: c.name, role: c.role }));
    toast.success(`Loaded ${c.name}`);
  };

  const full = f.type === "fulltime";
  const title = full ? "Offer of Employment" : "Internship Appointment Letter";

  return (
    <>
      <style>{`@media print { body * { visibility: hidden; } #offer-letter-preview, #offer-letter-preview * { visibility: visible; } #offer-letter-preview { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; } }`}</style>
      <PageHeader
        title="Offer Letter Generator"
        description="Generate and customize internship appointment letters and full-time offers"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setF(OFFER_LETTER_DEFAULTS)}>
              <RotateCcw className="size-3.5" /> Reset
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Printer className="size-3.5" /> Print / PDF
            </Button>
          </>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="size-4 text-primary" /> Candidate details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  <Search className="size-3" /> Load a hired candidate
                </Label>
                <Select onValueChange={fill}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {hired.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} - {c.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Candidate Name</Label>
                <Input value={f.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Role / Position</Label>
                <Input value={f.role} onChange={(e) => set("role", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Company</Label>
                <Input value={f.company} onChange={(e) => set("company", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{full ? "Annual CTC (INR)" : "Stipend (INR / month)"}</Label>
                <Input value={f.stipend} onChange={(e) => set("stipend", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Letter Type</Label>
                <Select value={f.type} onValueChange={(v) => set("type", v as Form["type"])}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internship">Internship Appointment</SelectItem>
                    <SelectItem value="fulltime">Full-Time Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div id="offer-letter-preview" className="mx-auto w-full max-w-[720px] rounded-lg border bg-white p-10 text-[13px] leading-relaxed text-zinc-800 shadow-sm">
          <div className="flex items-center justify-between border-b-2 border-sky-300 pb-4">
            <p className="text-xl font-extrabold tracking-tight text-sky-700">{f.company || "Company"}</p>
            <p className="text-xs text-zinc-500">{f.date ? fmtDate(f.date) : ""}</p>
          </div>
          <h2 className="mt-6 text-lg font-bold">{title}</h2>
          <p className="mt-4">Dear {f.name || "Candidate"},</p>
          <p className="mt-3">
            We are delighted to offer you the position of <strong>{f.role || "Role"}</strong> at{" "}
            <strong>{f.company || "Company"}</strong>.{" "}
            {full
              ? "Your skills and the way you carried yourself through our interview rounds stood out, and we believe you will make a strong contribution to the team."
              : "Your performance across our interview rounds impressed the panel, and we are pleased to welcome you to our team as an intern."}
          </p>
          <p className="mt-3 font-semibold">Terms of engagement</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              {full ? "Annual compensation (CTC)" : "Monthly stipend"}: INR {f.stipend || "—"}
              {full ? " per annum" : " per month"}
            </li>
            <li>Start date: to be confirmed with your reporting manager, within 30 days of acceptance</li>
            {full ? (
              <li>Probation: 3 months, followed by confirmation subject to performance review</li>
            ) : (
              <li>Duration: 6 months, extendable based on performance, with a certificate on completion</li>
            )}
            <li>Work mode: hybrid, with core collaboration hours 11 AM to 5 PM IST</li>
            <li>Reporting to: the team lead of the {f.role || "assigned"} function</li>
          </ul>
          <p className="mt-3">
            Please confirm your acceptance by signing and returning a copy of this letter within 5 working days. This
            offer is subject to successful verification of the documents you have shared with us.
          </p>
          <p className="mt-6">We look forward to building with you.</p>
          <div className="mt-8 flex justify-between">
            <div>
              <p className="font-semibold">Abeer Gandhi</p>
              <p className="text-xs text-zinc-500">Co-founder, {f.company || "Company"}</p>
            </div>
            <div className="text-right">
              <div className="mb-1 h-8 w-40 border-b border-zinc-400" />
              <p className="text-xs text-zinc-500">Candidate signature</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
