"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { COMMISSIONS, DISPUTES } from "@/lib/mock-data";
import { ProgramCard } from "@/components/program-card";
import { ListSurface } from "@/components/ui/list-surface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ProgramViewMode = "grid" | "list";
const CREATOR_PROGRAM_VIEW_KEY = "freeq:creator:program-view-mode";

export function buildProgramData() {
  return Object.values(
    COMMISSIONS.reduce<Record<string, any>>((acc, c) => {
      acc[c.programName] ??= {
        programName: c.programName,
        brand: c.brandName,
        rate: c.programName === "Creator Collab Series" ? "18%" : c.programName === "Chocolate Bar Drop Vol. 3" ? "14%" : "11%",
        cookie: c.cookieWindow,
        approvalRate: 0,
        status: "Active",
        lastCommission: c.conversionTimestamp,
        commissions: 0,
        approved: 0,
        openDisputes: 0
      };
      acc[c.programName].commissions += 1;
      if (["approved", "locked", "paid"].includes(c.status)) acc[c.programName].approved += 1;
      if (new Date(c.conversionTimestamp).getTime() > new Date(acc[c.programName].lastCommission).getTime()) acc[c.programName].lastCommission = c.conversionTimestamp;
      return acc;
    }, {})
  ).map((row: any) => ({
    ...row,
    approvalRate: `${Math.round((row.approved / row.commissions) * 100)}%`,
    openDisputes: DISPUTES.filter((d) => COMMISSIONS.find((c) => c.id === d.commissionId)?.programName === row.programName && d.status.includes("open")).length
  }));
}

export function MyPrograms({ onOpenProgram, onDiscover }: { onOpenProgram: (programName: string) => void; onDiscover: () => void }) {
  const rows = buildProgramData();
  const [viewMode, setViewMode] = useState<ProgramViewMode>("list");

  useEffect(() => {
    const stored = window.localStorage.getItem(CREATOR_PROGRAM_VIEW_KEY);
    if (stored === "grid" || stored === "list") setViewMode(stored);
  }, []);

  function setProgramViewMode(mode: ProgramViewMode) {
    setViewMode(mode);
    window.localStorage.setItem(CREATOR_PROGRAM_VIEW_KEY, mode);
  }
  const summaries: Record<string, string> = {
    "Chocolate Bar Drop Vol. 3": "Limited-run chocolate bar collection including new MrBeast Bar flavors. High conversion, impulse-buy price point.",
    "Creator Collab Series": "Affiliate program for creator-native partnerships driving Feastables multipack and bundle sales across YouTube and TikTok audiences.",
    "Back to School Bundle": "Seasonal bundle program targeting high-volume snack purchases for the back-to-school period. Limited enrollment."
  };
  const creatorCardMetrics: Record<string, { primary: [string, string]; secondary: [string, string, string, string] }> = {
    "Chocolate Bar Drop Vol. 3": {
      primary: ["$4,280", "$1,960"],
      secondary: ["$2,320", "$11.40", "1,284", "$28,400"]
    },
    "Creator Collab Series": {
      primary: ["$5,140", "$1,420"],
      secondary: ["$3,720", "$12.75", "1,146", "$36,480"]
    },
    "Back to School Bundle": {
      primary: ["$2,920", "$880"],
      secondary: ["$1,640", "$9.20", "724", "$18,520"]
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] w-full flex-col">
      <div className="mx-auto w-full max-w-[1180px] flex-1 px-8 py-8">
        <div className="flex h-[79.773px] w-full flex-col gap-2">
          <div className="flex h-[50px] items-center justify-between gap-4">
            <h1 className="font-[var(--font-jost)] text-[50px] font-semibold leading-[24px] tracking-[-0.2px] text-[#04070f]">My Programs</h1>
            <div className="inline-flex items-center rounded-[10px] border-2 border-black bg-black p-1">
              <button
                type="button"
                onClick={() => setProgramViewMode("grid")}
                className={[
                  "rounded-[8px] px-3 py-1 text-[14px] font-semibold",
                  viewMode === "grid" ? "bg-white text-[#04070f]" : "text-white/80 hover:text-white"
                ].join(" ")}
              >
                Grid View
              </button>
              <button
                type="button"
                onClick={() => setProgramViewMode("list")}
                className={[
                  "rounded-[8px] px-3 py-1 text-[14px] font-semibold",
                  viewMode === "list" ? "bg-white text-[#04070f]" : "text-white/80 hover:text-white"
                ].join(" ")}
              >
                List View
              </button>
            </div>
          </div>
          <p className="text-[16px] text-muted-foreground">Review your active partnerships, performance, and program health.</p>
        </div>

        {viewMode === "grid" ? (
          <div className="mt-[35px] grid items-start gap-4 lg:grid-cols-3">
            {rows.map((r: any) => (
              <ProgramCard
                key={r.programName}
                brandName={r.brand}
                status={r.status}
                programName={r.programName}
                description={summaries[r.programName] || "Performance-ready affiliate program with transparent governance and reliable payout behavior."}
                primaryMetrics={[
                  { label: "Earnings this month", value: creatorCardMetrics[r.programName]?.primary[0] || "$0" },
                  { label: "pending approval", value: creatorCardMetrics[r.programName]?.primary[1] || "$0" }
                ]}
                stats={[
                  { label: "Approved", value: creatorCardMetrics[r.programName]?.secondary[0] || "$0" },
                  { label: "Earnings/Order", value: creatorCardMetrics[r.programName]?.secondary[1] || "$0.00" },
                  { label: "Orders Driven", value: creatorCardMetrics[r.programName]?.secondary[2] || "0" },
                  { label: "Sales Generated", value: creatorCardMetrics[r.programName]?.secondary[3] || "$0" }
                ]}
                onOpen={() => onOpenProgram(r.programName)}
              />
            ))}
          </div>
        ) : (
          <ListSurface className="mt-[35px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programme</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r: any) => (
                  <TableRow key={r.programName} className="cursor-pointer" onClick={() => onOpenProgram(r.programName)}>
                    <TableCell className="font-semibold">{r.programName}</TableCell>
                    <TableCell>{r.brand}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{creatorCardMetrics[r.programName]?.primary[0] || "$0"}</TableCell>
                    <TableCell>{creatorCardMetrics[r.programName]?.primary[1] || "$0"}</TableCell>
                    <TableCell>{creatorCardMetrics[r.programName]?.secondary[0] || "$0"}</TableCell>
                    <TableCell>{creatorCardMetrics[r.programName]?.secondary[3] || "$0"}</TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenProgram(r.programName);
                        }}
                        className="rounded-[8px] border border-black px-3 py-1 text-[13px] font-semibold hover:bg-[rgba(55,220,255,0.2)]"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ListSurface>
        )}
      </div>

      <div className="mt-auto h-[138px] w-full border-t-2 border-black bg-[var(--lime)]">
        <div className="mx-auto flex h-full w-full max-w-[1180px] items-center justify-between px-8 pt-[2px]">
          <span className="flex h-[50.391px] items-center gap-4">
            <span className="flex h-[50px] w-[50px] items-center justify-center rounded-[14px] border-[3px] border-black bg-primary shadow-[3px_3px_0px_0px_black]">
              <PlusCircle className="h-6 w-6" />
            </span>
            <span className="text-left">
              <span className="block text-[26.4px] font-semibold leading-[26.4px] tracking-[-0.88px] text-[#04070f]">
                Looking for new partnerships?
              </span>
              <span className="text-[16px] leading-[24px] text-muted-foreground">
                Discover programs with transparent governance metrics.
              </span>
            </span>
          </span>
          <button
            className="flex h-[44px] items-center justify-center gap-2 rounded-[11px] border-2 border-black bg-primary px-6 text-[20px] font-semibold leading-[30px] tracking-[-0.2px] text-[#04070f] shadow-[4px_4px_0px_0px_black] hover:brightness-105"
            onClick={onDiscover}
          >
            Discover Programs
            <span aria-hidden className="relative top-[-0.5px]">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
