import type { AccountIdentity } from "@/lib/mock-data/outreach-system";

export function AccountBadge({ account }: { account: AccountIdentity }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: account.colorVar }} />
      {account.label}
    </span>
  );
}

export function accountRowTint(account: AccountIdentity) {
  return { backgroundColor: `color-mix(in srgb, ${account.colorVar} 6%, transparent)` };
}
