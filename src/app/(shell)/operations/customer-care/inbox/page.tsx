import { PageHeader } from "@/components/shared/page-header";
import { OperationsInbox } from "@/components/operations/inbox";

export default function Page() {
  return (
    <>
      <PageHeader
        title="Inbox"
        description="Unified conversations from WhatsApp, email and web chat."
      />
      <OperationsInbox />
    </>
  );
}
