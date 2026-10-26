import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { InitialsAvatar } from "@/components/sales/initials-avatar";
import { getCompany, MOCK_CONTACTS } from "@/lib/mock-data/contacts";
import { MEMBERS } from "@/lib/mock-data/orgs";
import { formatMoney } from "@/lib/format";
import type { Deal } from "@/lib/mock-data/sales";

export function DealCard({ deal }: { deal: Deal }) {
  const company = getCompany(deal.companyId);
  const contact = MOCK_CONTACTS.find((c) => c.id === deal.contactId);
  const owner = MEMBERS.find((m) => m.id === deal.ownerId);

  return (
    <Link href={`/sales/crm/contacts/${deal.contactId ?? ""}`}>
      <Card className="transition-colors hover:border-primary/40">
        <CardContent className="px-3 py-3">
          <p className="text-sm font-medium leading-snug">{deal.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{company?.name ?? "—"}</p>
          <p className="mt-2 text-base font-semibold">{formatMoney(deal.valueMinor, deal.currency)}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Closes {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
            {owner && <InitialsAvatar name={owner.name} size="sm" className="size-5 text-[10px]" />}
          </div>
          {contact && (
            <p className="mt-1 truncate text-[11px] text-muted-foreground">{contact.name}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
