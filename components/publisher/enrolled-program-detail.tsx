"use client";

import { Activity, BadgeDollarSign, Clock, Copy, Users } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import { ENROLLED_PROGRAMS, EnrolledProgram } from "@/lib/mock-data";
import { COMMISSIONS, CommissionStatus, formatCurrency } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EarningsDashboard } from "@/components/publisher/earnings-dashboard";

export function EnrolledProgramDetail({
  programName,
  onOpenCommission
}: {
  programName: string;
  onOpenCommission: (id: string) => void;
}) {
  const program = ENROLLED_PROGRAMS[programName] as EnrolledProgram;
  const [tab, setTab] = useState<"all" | CommissionStatus>("all");
  if (!program) return null;

  const programRows = useMemo(
    () => COMMISSIONS.filter((c) => c.programName === program.programName),
    [program.programName]
  );
  const totalEarned = programRows
    .filter((c) => ["paid", "locked", "approved"].includes(c.status))
    .reduce((acc, c) => acc + c.amount, 0);
  const pending = programRows
    .filter((c) => ["pending", "recorded"].includes(c.status))
    .reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="relative grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_404px]">
      <div className="pointer-events-none absolute right-[404px] top-0 hidden h-full w-[2px] bg-black xl:block" />
      <section className="space-y-6 px-8 py-8 xl:pr-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="space-y-1">
            <h1 className="text-[40px] font-semibold leading-[34px] tracking-[-0.2px] text-[#04070f]">{program.programName}</h1>
            <p className="text-sm text-muted-foreground">{program.brandName} · Enrolled {program.enrolledDate}</p>
          </div>
          <div className="flex max-w-full items-center gap-2">
            <code className="max-w-[340px] truncate rounded-[10px] border-2 border-black bg-white px-3 py-2 text-xs shadow-[2px_2px_0px_0px_black]">
              {program.affiliateLink}
            </code>
            <Button size="sm" variant="outline">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <LargeStat label="Total Earned" value={formatCurrency(totalEarned, "USD")} />
          <LargeStat label="Pending" value={formatCurrency(pending, "USD")} />
          <LargeStat label="Conversion Rate" value="6.4%" />
        </div>

        <EarningsDashboard tab={tab} onTab={setTab} onOpenCommission={onOpenCommission} showTopStats={false} />
      </section>

      <aside className="border-t-2 border-black xl:sticky xl:top-0 xl:self-start xl:border-t-0">
        <div className="grid grid-cols-2 border-b-2 border-black">
          <SidebarMetric className="border-b border-r border-[#04070f]/20" icon={Activity} label="Approval Rate" value={program.trustSummary.approvalRate} />
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
      </aside>
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
