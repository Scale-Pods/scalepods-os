"use client";

import * as React from "react";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { useOrg } from "@/lib/org-context";

const REGIONS = [
  { value: "india", label: "India" },
  { value: "uae", label: "UAE" },
  { value: "us", label: "US" },
];

const TEMPLATES = [
  { value: "staffing", label: "Staffing agency" },
  { value: "realty", label: "Real estate brokerage" },
  { value: "home_services", label: "Property & home services" },
  { value: "general", label: "General SMB" },
];

export function OrganizationForm() {
  const { org } = useOrg();
  const [name, setName] = React.useState(org.name);
  const [slug, setSlug] = React.useState(org.slug);
  const [region, setRegion] = React.useState<string>(org.region);
  const [template, setTemplate] = React.useState<string>(org.industryTemplate);

  function handleSave() {
    toast.success("Organization settings saved", {
      description: `${name} is now set to the ${REGIONS.find((r) => r.value === region)?.label} region.`,
    });
  }

  return (
    <>
      <PageHeader title="Organization" description="Your workspace profile and regional settings." />
      <Card className="max-w-2xl">
        <CardContent className="space-y-5 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-6" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast("Logo upload is simulated in this demo")}>
              Upload logo
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-name">Organization name</Label>
            <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-slug">Slug</Label>
            <Input id="org-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <p className="text-xs text-muted-foreground">scalepods.co/{slug}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Industry template</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
