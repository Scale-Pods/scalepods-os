"use client";

import { UploadCloud } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LAST_CAMPAIGN_UPLOAD } from "@/lib/mock-data/outreach-system";

export default function CampaignUploadLeadsPage() {
  return (
    <>
      <PageHeader title="Upload Leads" description="Bulk-import leads into a campaign from a CSV or spreadsheet." />

      <Card className="mb-6">
        <CardContent className="px-4 py-8">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-secondary">
              <UploadCloud className="size-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold">Drop a file here or click to browse</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">Supported formats: CSV, XLSX</p>
            <Button className="mt-4" disabled>
              Upload file
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-4 py-4">
          <h3 className="mb-3 text-sm font-semibold">Last upload</h3>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium">{LAST_CAMPAIGN_UPLOAD.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(LAST_CAMPAIGN_UPLOAD.uploadedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-right">
                <p className="font-semibold">{LAST_CAMPAIGN_UPLOAD.rowsParsed}</p>
                <p className="text-xs text-muted-foreground">rows parsed</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{LAST_CAMPAIGN_UPLOAD.duplicatesSkipped}</p>
                <p className="text-xs text-muted-foreground">duplicates skipped</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-destructive">{LAST_CAMPAIGN_UPLOAD.errors}</p>
                <p className="text-xs text-muted-foreground">errors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
