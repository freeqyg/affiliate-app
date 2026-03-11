"use client";

import { AlertTriangle, BadgeDollarSign, ChevronDown, ChevronRight, CircleDashed, Clock, ShieldCheck, Users } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { BrandProgramData, COMMISSIONS, CREATOR_PROFILES, formatCurrency } from "@/lib/mock-data";
import { AttributionState, getAttributionRecord, getAttributionSummary } from "@/lib/verified-influence";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const stateOrder: AttributionState[] = ["verified", "disputed", "unestablished"];

const stateMeta: Record<
  AttributionState,
  {
    label: string;
    chipClassName: string;
    groupClassName: string;
    rowClassName: string;
  }
> = {
  verified: {
    label: "Verified",
    chipClassName: "border-[#0f6d45] bg-[#d9f7e8] text-[#0f6d45]",
    groupClassName: "border-[#0f6d45] bg-[#dff8e8]",
    rowClassName: ""
  },
  disputed: {
    label: "Disputed",
    chipClassName: "border-[#9a4d00] bg-[#ffe8c9] text-[#7a3e00]",
    groupClassName: "border-[#9a4d00] bg-[#ffe3bf]",
    rowClassName: "bg-[#fff7eb] hover:bg-[#ffefd6]"
  },
  unestablished: {
    label: "Unestablished",
    chipClassName: "border-[#66717d] bg-[#eef2f5] text-[#55606c]",
    groupClassName: "border-[#66717d] bg-[#e8edf2]",
    rowClassName: "bg-[#fafbfc] hover:bg-[#f1f4f6]"
  }
};

function StateChip({ state }: { state: AttributionState }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.72px]",
        stateMeta[state].chipClassName
      )}
    >
      {stateMeta[state].label}
    </span>
  );
}

function ConfidenceChip({ confidence }: { confidence: "High" | "Medium" | "Low" }) {
  const className =
    confidence === "High"
      ? "border-[#0f6d45]/30 bg-[#edf9f2] text-[#0f6d45]"
      : confidence === "Medium"
        ? "border-[#9a4d00]/30 bg-[#fff4e1] text-[#8c5800]"
        : "border-[#66717d]/25 bg-[#f3f5f7] text-[#55606c]";

  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium", className)}>{confidence}</span>;
}

function BuyerBehaviourTag({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-[rgba(4,7,15,0.05)] px-2.5 py-1 text-[11px] font-medium text-[#04070f]/74">
      {label}
    </span>
  );
}

export function BrandProgramDetail({
  program,
  onOpenCommission,
  onOpenCreator
}: {
  program: BrandProgramData;
  onOpenCommission: (id: string) => void;
  onOpenCreator: (name: string) => void;
}) {
  const programRows = useMemo(
    () =>
      COMMISSIONS.filter((commission) => commission.programName === program.programName).sort(
        (a, b) => +new Date(b.conversionTimestamp) - +new Date(a.conversionTimestamp)
      ),
    [program.programName]
  );
  const records = useMemo(() => programRows.map((commission) => getAttributionRecord(commission)), [programRows]);
  const summary = useMemo(() => getAttributionSummary(programRows), [programRows]);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<AttributionState, boolean>>({
    verified: false,
    disputed: false,
    unestablished: false
  });

  const participatingCreators = Object.values(
    programRows.reduce<Record<string, { name: string; commissions: number; total: number }>>((acc, row) => {
      acc[row.publisher] ??= { name: row.publisher, commissions: 0, total: 0 };
      acc[row.publisher].commissions += 1;
      acc[row.publisher].total += row.amount;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const totalConversions = programRows.length;
  const verifiedShare = totalConversions > 0 ? Math.round((summary.verified.conversions / totalConversions) * 100) : 0;
  const totalCommission = programRows.reduce((acc, row) => acc + row.amount, 0);

  return (
    <div className="relative grid min-h-[calc(100vh-60px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_404px]">
      <div className="pointer-events-none absolute right-[404px] top-0 hidden h-full w-[2px] bg-black xl:block" />

      <section className="space-y-6 px-8 py-8 xl:pr-6">
        <div className="space-y-[18px] px-2 pb-4 pt-1">
          <div className="space-y-1">
            <h1 className="text-[50px] font-semibold leading-none tracking-[-1px] text-[#04070f]">{program.programName}</h1>
            <p className="text-sm text-muted-foreground">
              {program.brandName} • {program.businessUnitName}
            </p>
          </div>
        </div>

        <section className="border-t border-black/20 pt-[30px]">
          <div className="space-y-4 px-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.78px] text-[#04070f]/54">
              Programme Attribution Reliability
            </p>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[740px]">
                <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-1.36px] text-[#04070f]">
                  {verifiedShare}% of programme conversions include verified creator influence
                </h2>
              </div>
              <div className="w-full max-w-[388px]">
                <p className="text-[15px] leading-6 text-[#04070f]/72">
                  This programme view shows whether commissions are defensible, contested, or still
                  unestablished. Click any record to open the commission detail page and inspect the full evidence.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-2 pb-[30px] pt-[30px] md:grid-cols-3">
            <SummaryCard label="Verified Influence" conversions={summary.verified.conversions} revenue={summary.verified.revenue} commission={summary.verified.commission} state="verified" />
            <SummaryCard label="Disputed Influence" conversions={summary.disputed.conversions} revenue={summary.disputed.revenue} commission={summary.disputed.commission} state="disputed" />
            <SummaryCard label="Unestablished Influence" conversions={summary.unestablished.conversions} revenue={summary.unestablished.revenue} commission={summary.unestablished.commission} state="unestablished" />
          </div>
        </section>

        <section className="border-t border-black/20 pt-[26px]">
          <div className="flex flex-col gap-5 px-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.78px] text-[#04070f]/54">
                Influence Records
              </p>
              <h2 className="text-[28px] font-semibold leading-none tracking-[-1.12px] text-[#04070f]">
                Programme commissions by attribution state
              </h2>
            </div>
            <div className="flex w-full max-w-[388px] flex-col gap-3">
              <p className="text-[15px] leading-6 text-[#04070f]/68">
                Each row is a conversion claim for this programme. Open a commission to inspect supporting
                evidence, disputed signals, and review context.
              </p>
              <div className="text-[12px] leading-[18px] text-[#04070f]/64">
                {totalConversions} conversions • {formatCurrency(totalCommission, "USD")} commission value
              </div>
            </div>
          </div>

          <div className="space-y-5 px-2 pb-2 pt-5">
              {stateOrder.map((state) => {
                const rows = records.filter((record) => record.state === state);
                const isCollapsed = collapsedGroups[state];
                const stateSummary = summary[state];

                return (
                  <section key={state} className="space-y-3">
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedGroups((current) => ({
                          ...current,
                          [state]: !current[state]
                        }))
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-[16px] border-2 px-4 py-3 text-left shadow-[2px_2px_0px_0px_black]",
                        stateMeta[state].groupClassName
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <div>
                          <p className="text-[14px] font-semibold text-[#04070f]">
                            {state === "verified" ? "Verified Influence" : state === "disputed" ? "Disputed Influence" : "Unestablished Influence"}
                            {rows.length === 0 ? " — 0 records" : ""}
                          </p>
                          <p className="text-[12px] text-[#04070f]/64">
                            {stateSummary.conversions} conversions • {formatCurrency(stateSummary.revenue, "USD")} revenue • {formatCurrency(stateSummary.commission, "USD")} commission
                          </p>
                        </div>
                      </div>
                      <StateChip state={state} />
                    </button>

                    {!isCollapsed && rows.length > 0 && (
                      <div className="overflow-hidden rounded-[18px] border-2 border-black bg-white shadow-[3px_3px_0px_0px_black]">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead>Creator</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Order Value</TableHead>
                              <TableHead>Commission</TableHead>
                              <TableHead>State</TableHead>
                              <TableHead>Confidence</TableHead>
                              <TableHead>Buyer Behaviour</TableHead>
                              <TableHead className="text-right">Evidence</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rows.map((record) => (
                              <TableRow
                                key={record.commissionId}
                                className={cn("cursor-pointer align-top", stateMeta[state].rowClassName)}
                                onClick={() => onOpenCommission(record.commissionId)}
                              >
                                <TableCell className="font-semibold">{record.creator}</TableCell>
                                <TableCell className="max-w-[160px] text-[#04070f]/72">{record.source}</TableCell>
                                <TableCell className="max-w-[210px] text-[#04070f]/78">{record.product}</TableCell>
                                <TableCell className="font-medium">{record.orderValue}</TableCell>
                                <TableCell className="font-medium">{record.commission}</TableCell>
                                <TableCell><StateChip state={record.state} /></TableCell>
                                <TableCell><ConfidenceChip confidence={record.confidence} /></TableCell>
                                <TableCell><BuyerBehaviourTag label={record.buyerBehaviour} /></TableCell>
                                <TableCell className="text-right">
                                  <span className="inline-flex items-center gap-1 rounded-full border border-black/15 bg-white px-3 py-1.5 text-[12px] font-medium text-[#04070f]">
                                    <ChevronRight className="h-3.5 w-3.5" />
                                    Open Commission
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </section>
                );
              })}
          </div>
        </section>
      </section>

      <aside className="border-t-2 border-black xl:sticky xl:top-0 xl:self-start xl:border-t-0">
        <div className="grid grid-cols-2 border-b-2 border-black">
          <SidebarMetric className="border-b border-r border-[#04070f]/20" icon={ShieldCheck} label="Approval Rate" value={program.trustSummary.approvalRate} />
          <SidebarMetric className="border-b border-[#04070f]/20" icon={BadgeDollarSign} label="Avg Payout" value={program.trustSummary.avgPayout} />
          <SidebarMetric className="border-r border-[#04070f]/20" icon={Users} label="Active Publishers" value={program.trustSummary.activePublishers} />
          <SidebarMetric icon={Clock} label="Validation" value={program.validationWindow} />
        </div>

        <section className="border-b border-[#04070f]/20 px-6 py-6">
          <h2 className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#04070f]/50">Program Terms</h2>
          <div className="mt-4 grid grid-cols-2 gap-1.5 text-sm">
            <TermCard label="Commission" value={`${program.commissionRate} ${program.commissionType}`} />
            <TermCard label="Attribution" value={program.attributionModel} />
            <TermCard label="Validation" value={program.validationWindow} />
            <TermCard label="Dispute Window" value={program.disputeWindow} />
          </div>
        </section>

        <section className="border-b border-[#04070f]/20 px-6 py-6">
          <h2 className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#04070f]/50">Attribution Policy</h2>
          <div className="mt-4 space-y-3">
            <PolicyNote label="Explanation Commitment" value={program.explanationCommitment} />
            <PolicyNote label="Evidence Note" value={program.explanationNote} />
            <PolicyNote label="Cookie Window" value={program.cookieWindow} />
          </div>
        </section>

        <section className="px-4 py-5">
          <h2 className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#04070f]/50">Participating Creators</h2>
          <div className="mt-4 space-y-2">
            {participatingCreators.length === 0 && <p className="text-sm text-muted-foreground">No creators enrolled yet.</p>}
            {participatingCreators.map((creator) => (
              <button
                type="button"
                key={creator.name}
                onClick={() => onOpenCreator(creator.name)}
                className="flex w-full items-center justify-between rounded-[8px] bg-[rgba(242,253,255,0.3)] px-3 py-2.5 text-left transition-colors hover:bg-[rgba(242,253,255,0.6)]"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    alt={creator.name}
                    className="h-9 w-9 rounded-full border border-black/10 object-cover"
                    src={CREATOR_PROFILES[creator.name]?.avatar ?? "https://i.pravatar.cc/80"}
                  />
                  <div>
                    <p className="text-[14px] font-medium leading-[18px] text-[#04070f]">{creator.name}</p>
                    <p className="text-[12px] leading-[16px] text-muted-foreground">
                      {CREATOR_PROFILES[creator.name]?.handle ?? "@creator"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[12px] leading-[16px] text-muted-foreground">{creator.commissions} commissions</p>
                  <p className="text-[13px] font-medium leading-[18px] text-[#04070f]">{formatCurrency(creator.total, "USD")}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function SummaryCard({
  label,
  conversions,
  revenue,
  commission,
  state
}: {
  label: string;
  conversions: number;
  revenue: number;
  commission: number;
  state: AttributionState;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border-2 p-5 shadow-[3px_3px_0px_0px_black]",
        state === "verified"
          ? "border-[#0f6d45] bg-[#effcf4]"
          : state === "disputed"
            ? "border-[#9a4d00] bg-[#fff5e7]"
            : "border-[#73808c] bg-[#f6f8fa]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/52">{label}</p>
          <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-1.2px] text-[#04070f]">{conversions}</p>
          <p className="mt-1 text-[13px] text-[#04070f]/64">{conversions === 1 ? "conversion" : "conversions"}</p>
        </div>
        <div className="grid h-[34px] w-[34px] place-items-center rounded-full border border-black bg-white/75">
          {state === "verified" ? (
            <ShieldCheck className="h-4 w-4 text-[#55606c]" />
          ) : state === "disputed" ? (
            <AlertTriangle className="h-4 w-4 text-[#55606c]" />
          ) : (
            <CircleDashed className="h-4 w-4 text-[#55606c]" />
          )}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/12 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/50">Revenue</p>
          <p className="mt-1 text-[18px] font-semibold text-[#04070f]">{formatCurrency(revenue, "USD")}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.72px] text-[#04070f]/50">Commission</p>
          <p className="mt-1 text-[18px] font-semibold text-[#04070f]">{formatCurrency(commission, "USD")}</p>
        </div>
      </div>
    </div>
  );
}

function SidebarMetric({
  className,
  icon: Icon,
  label,
  value
}: {
  className?: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className={`min-h-[153px] p-5 ${className ?? ""}`}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#04070f]/50">{label}</p>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[35px] font-semibold leading-[35px] tracking-[-0.2px] text-[#04070f]">{value}</p>
    </div>
  );
}

function TermCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] bg-[rgba(55,220,255,0.3)] px-3 py-2.5">
      <p className="text-[14px] font-normal leading-[16px] text-[#525c63]">{label}</p>
      <p className="mt-1 text-[16px] font-medium leading-[20px] text-[#04070f]">{value}</p>
    </div>
  );
}

function PolicyNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-black/10 bg-[rgba(242,253,255,0.45)] px-3 py-3">
      <p className="text-[12px] uppercase tracking-[0.72px] text-[#04070f]/50">{label}</p>
      <p className="mt-1 text-[14px] leading-5 text-[#04070f]">{value}</p>
    </div>
  );
}
