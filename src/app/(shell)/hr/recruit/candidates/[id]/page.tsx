import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Check, X, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { AiGeneratedBadge } from "@/components/shared/badges";
import { StageBadge } from "@/components/hr/stage-badge";
import { FitScoreBadge } from "@/components/hr/fit-score";
import { StageStepper } from "@/components/hr/stage-stepper";
import { ActivityTimeline } from "@/components/hr/activity-timeline";
import { CandidateActions } from "@/components/hr/candidate-actions";
import { FitScoreComparison } from "@/components/hr/fit-score-comparison";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCandidateHr, getJob, candidateActivity, averageFitScoreForJob } from "@/lib/mock-data/hr";
import { MOCK_CONTACTS, getCompany } from "@/lib/mock-data/contacts";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = MOCK_CONTACTS.find((c) => c.id === id);
  const hr = getCandidateHr(id);
  if (!contact || !hr) notFound();

  const job = getJob(hr.appliedJobId);
  const company = getCompany(contact.companyId);
  const activity = candidateActivity(contact.id);
  const jobAvgFitScore = averageFitScoreForJob(hr.appliedJobId);

  return (
    <>
      <PageHeader
        title={contact.name}
        description={`Applied for ${job?.title ?? "a role"}${company ? ` · via ${company.name}` : ""} · ${contact.location ?? ""}`}
        badge={<StageBadge stage={hr.stage} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback>{initials(contact.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <a href={hr.resumeUrl} onClick={(e) => e.preventDefault()}>
                  <FileText className="size-3.5" />
                  View resume
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <StageStepper stage={hr.stage} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activity timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activity} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  Fit score breakdown
                  <AiGeneratedBadge />
                </span>
                <FitScoreBadge score={hr.fitScore} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {hr.fitReasons.map((reason) => (
                  <li key={reason.criterion} className="flex items-start gap-2">
                    <div
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                        reason.met ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                      )}
                    >
                      {reason.met ? <Check className="size-2.5" /> : <X className="size-2.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{reason.criterion}</p>
                      <p className="text-xs text-muted-foreground">{reason.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <FitScoreComparison
            candidateScore={hr.fitScore}
            jobAvgScore={jobAvgFitScore}
            jobTitle={job?.title}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateActions candidateName={contact.name} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied job</span>
                <Link href={`/hr/recruit/jobs/${job?.id}`} className="font-medium hover:underline">
                  {job?.title}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied on</span>
                <span className="font-medium">{format(new Date(hr.appliedAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{contact.source}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
