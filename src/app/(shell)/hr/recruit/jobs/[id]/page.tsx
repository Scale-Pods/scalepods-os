import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Briefcase, MapPin, Wallet, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge, AiGeneratedBadge } from "@/components/shared/badges";
import { EmptyState } from "@/components/shared/empty-state";
import { FitScoreBadge } from "@/components/hr/fit-score";
import { StageBadge } from "@/components/hr/stage-badge";
import { FunnelChart } from "@/components/hr/funnel-chart";
import { FitScoreHistogram } from "@/components/hr/fit-score-histogram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getJob,
  candidatesForJob,
  getClient,
  buildFunnelForJob,
  fitScoreHistogramForJob,
} from "@/lib/mock-data/hr";
import { MOCK_CONTACTS } from "@/lib/mock-data/contacts";
import { formatMoney } from "@/lib/format";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const client = job.clientId ? getClient(job.clientId) : undefined;
  const candidates = candidatesForJob(job.id).sort((a, b) => b.fitScore - a.fitScore);
  const funnel = buildFunnelForJob(job.id);
  const histogram = fitScoreHistogramForJob(job.id);

  return (
    <>
      <PageHeader
        title={job.title}
        description={`${job.department} · ${job.location}${client ? ` · Client: ${client.contactPerson}` : ""}`}
        badge={<StatusBadge status={job.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Job description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <FunnelChart data={funnel} title="Candidate pipeline funnel" height={200} />
            <FitScoreHistogram data={histogram} title="Fit score distribution" height={200} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Candidates in pipeline
                <span className="ml-2 font-normal text-muted-foreground">({candidates.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {candidates.length === 0 ? (
                <div className="px-6">
                  <EmptyState
                    icon={Briefcase}
                    title="No candidates yet"
                    description="Candidates applying or sourced for this role will appear here, ranked by AI fit score."
                  />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Candidate</TableHead>
                      <TableHead>Fit score</TableHead>
                      <TableHead>Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((c) => {
                      const contact = MOCK_CONTACTS.find((x) => x.id === c.contactId);
                      if (!contact) return null;
                      return (
                        <TableRow key={c.contactId}>
                          <TableCell className="pl-6 font-medium">
                            <Link href={`/hr/recruit/candidates/${contact.id}`} className="hover:underline">
                              {contact.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <FitScoreBadge score={c.fitScore} />
                          </TableCell>
                          <TableCell>
                            <StageBadge stage={c.stage} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              AI-extracted fields
              <AiGeneratedBadge />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">Required skills</p>
              <div className="flex flex-wrap gap-1.5">
                {job.aiExtracted.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p>{job.aiExtracted.experienceMin}–{job.aiExtracted.experienceMax} years</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p>{job.aiExtracted.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Wallet className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Salary band</p>
                <p>
                  {formatMoney(job.aiExtracted.salaryBandMin * 100, job.aiExtracted.currency)} –{" "}
                  {formatMoney(job.aiExtracted.salaryBandMax * 100, job.aiExtracted.currency)}
                </p>
              </div>
            </div>
            <p className="pt-1 text-xs text-muted-foreground">
              Created {format(new Date(job.createdAt), "MMM d, yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
