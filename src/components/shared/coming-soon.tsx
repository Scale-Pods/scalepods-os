import { Construction } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        icon={Construction}
        title="Being built"
        description="This screen is under active construction as part of the ScalePods OS MVP build."
      />
    </>
  );
}
