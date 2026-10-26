"use client";

import * as React from "react";
import { DEFAULT_ORG_ID, ORGS } from "@/lib/mock-data/orgs";
import type { Organization } from "@/lib/types/core";

interface OrgContextValue {
  org: Organization;
  setOrgId: (id: string) => void;
  orgs: Organization[];
}

const OrgContext = React.createContext<OrgContextValue | null>(null);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [orgId, setOrgId] = React.useState(DEFAULT_ORG_ID);
  const org = React.useMemo(
    () => ORGS.find((o) => o.id === orgId) ?? ORGS[0],
    [orgId]
  );

  return (
    <OrgContext.Provider value={{ org, setOrgId, orgs: ORGS }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const ctx = React.useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}
