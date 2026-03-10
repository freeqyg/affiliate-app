"use client";

import { BadgeDollarSign, Clock, ShieldCheck, Users } from "lucide-react";
import type { ComponentType } from "react";
import { COMMISSIONS, BrandProgramData, CREATOR_PROFILES, CUSTOMER_PROFILES, formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CommissionQueue } from "@/components/brand/commission-queue";

export function BrandProgramDetail({
  program,
  onOpenCommission,
  onOpenCreator
}: {
  program: BrandProgramData;
  onOpenCommission: (id: string) => void;
  onOpenCreator: (name: string) => void;
}) {
  const programRows = COMMISSIONS.filter((c) => c.programName === program.programName);
  const totalVolume = programRows.reduce((acc, row) => acc + row.amount, 0);
  const pendingVolume = programRows
    .filter((row) => ["pending", "recorded"].includes(row.status))
    .reduce((acc, row) => acc + row.amount, 0);
  const participatingCreators = Object.values(
    programRows.reduce<Record<string, { name: string; commissions: number; total: number }>>((acc, row) => {
      acc[row.publisher] ??= { name: row.publisher, commissions: 0, total: 0 };
      acc[row.publisher].commissions += 1;
      acc[row.publisher].total += row.amount;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);
  const audienceRows = programRows
    .map((row) => ({ row, customer: CUSTOMER_PROFILES[row.orderId] }))
    .filter((entry) => Boolean(entry.customer));
  const segmentCounts = audienceRows.reduce<Record<string, number>>((acc, entry) => {
    const segment = classifyBuyerType(entry.customer?.buyerProfile ?? "General Buyer", entry.row.customerType);
    acc[segment] = (acc[segment] ?? 0) + 1;
    return acc;
  }, {});
  const topBuyerTypes = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const uniqueBuyers = new Set(audienceRows.map((entry) => entry.row.orderId)).size;
  const topPurchased = Object.entries(
    audienceRows.reduce<Record<string, number>>((acc, entry) => {
      const purchased = entry.customer?.purchased ?? "Unknown";
      acc[purchased] = (acc[purchased] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const topGeographies = Object.entries(
    audienceRows.reduce<Record<string, number>>((acc, entry) => {
      const customer = entry.customer;
      const location = customer ? `${customer.city}, ${customer.region}` : "Unknown";
      acc[location] = (acc[location] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([location]) => location)
    .join(" · ") || "—";
  const dominantAgeRanges = Object.entries(
    audienceRows.reduce<Record<string, number>>((acc, entry) => {
      const range = inferAgeRange(entry.customer?.buyerProfile ?? "", entry.row.customerType);
      acc[range] = (acc[range] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([range]) => range)
    .join(" · ") || "—";
  const primaryDeviceType = Object.entries(
    programRows.reduce<Record<string, number>>((acc, row) => {
      const device = row.device || "Unknown";
      acc[device] = (acc[device] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const trafficOrigins = Object.entries(
    programRows.reduce<Record<string, number>>((acc, row) => {
      const origin = row.referrerSource || "Direct";
      acc[origin] = (acc[origin] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([origin]) => origin)
    .join(" · ") || "—";
  const buyerTypeClassification = topBuyerTypes.map(([type]) => type).join(" · ") || "—";

  return (
    <div className="relative grid min-h-[calc(100vh-60px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_404px]">
      <div className="pointer-events-none absolute right-[404px] top-0 hidden h-full w-[2px] bg-black xl:block" />

      <section className="space-y-6 px-8 py-8 xl:pr-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="space-y-1">
            <h1 className="text-[40px] font-semibold leading-[34px] tracking-[-0.2px] text-[#04070f]">{program.programName}</h1>
            <p className="text-sm text-muted-foreground">{program.brandName}</p>
          </div>
          <Badge variant="secondary">{program.status}</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <LargeStat label="Total Volume" value={formatCurrency(totalVolume, "USD")} />
          <LargeStat label="Pending Volume" value={formatCurrency(pendingVolume, "USD")} />
          <LargeStat label="Reversals Explained" value={program.trustSummary.reversalsExplained} />
        </div>

        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-semibold leading-[22px] text-[#04070f]">Audience Snapshot</h2>
                <p className="text-sm text-muted-foreground">
                  Understand what kind of buyers this programme is attracting.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {topBuyerTypes.map(([segment, count]) => (
                  <span
                    key={segment}
                    className="rounded-full border border-black/10 bg-[rgba(55,220,255,0.2)] px-3 py-1 text-xs font-medium text-[#04070f]"
                  >
                    {segment} · {count}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <MiniInsight label="Buyer Geography" value={topGeographies} />
              <MiniInsight label="Age Range Distribution" value={dominantAgeRanges} />
              <MiniInsight label="Primary Device Type" value={primaryDeviceType} />
              <MiniInsight label="Traffic Origin" value={trafficOrigins} />
              <MiniInsight label="Buyer Type Classification" value={buyerTypeClassification} />
              <MiniInsight label="Top Purchased Product" value={topPurchased} />
              <MiniInsight label="Total Unique Buyers" value={`${uniqueBuyers}`} />
            </div>
          </CardContent>
        </Card>

        <CommissionQueue programFilter={program.programName} onOpenCommission={onOpenCommission} />
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

        <section className="px-4 py-5">
          <h2 className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#04070f]/50">Participating Creators</h2>
          <div className="mt-4 space-y-2">
            {participatingCreators.length === 0 && (
              <p className="text-sm text-muted-foreground">No creators enrolled yet.</p>
            )}
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

function classifyBuyerType(profile: string, customerType: string) {
  const value = profile.toLowerCase();
  if (customerType === "Returning" || value.includes("repeat")) return "Repeat customer";
  if (value.includes("deal") || value.includes("price")) return "Deal-driven buyer";
  if (value.includes("impulse")) return "Impulse buyer";
  if (customerType === "New") return "First-time buyer";
  return "First-time buyer";
}

function inferAgeRange(profile: string, customerType: string) {
  const value = profile.toLowerCase();
  if (value.includes("campus") || value.includes("impulse")) return "18–24";
  if (value.includes("lifestyle") || value.includes("repeat") || value.includes("creator")) return "25–34";
  if (value.includes("subscription") || value.includes("premium") || customerType === "Returning") return "35–44";
  return "25–34";
}

function MiniInsight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-black/10 bg-[rgba(242,253,255,0.45)] px-3 py-2.5">
      <p className="text-[12px] uppercase tracking-[0.72px] text-[#04070f]/50">{label}</p>
      <p className="mt-1 text-[15px] font-semibold leading-[20px] text-[#04070f]">{value}</p>
    </div>
  );
}

function LargeStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="h-[160px]">
      <CardContent className="flex h-full flex-col justify-between p-[22px]">
        <p className="text-[12px] font-semibold uppercase leading-[16px] tracking-[0.72px] text-[#ff6088]">{label}</p>
        <p className="text-[45px] font-semibold leading-[35px] tracking-[-0.2px] text-[#04070f]">{value}</p>
      </CardContent>
    </Card>
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
