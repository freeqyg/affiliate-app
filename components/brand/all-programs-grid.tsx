"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { BRAND_PROGRAMS_DATA } from "@/lib/mock-data";
import { ProgramCard } from "@/components/program-card";
import { ListSurface } from "@/components/ui/list-surface";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ProgramViewMode = "grid" | "list";
const BRAND_PROGRAM_VIEW_KEY = "freeq:brand:program-view-mode";

export function AllProgramsGrid({
  businessUnitId,
  onOpenProgram,
  onCreateProgram
}: {
  businessUnitId?: "all" | string;
  onOpenProgram: (programName: string) => void;
  onCreateProgram: () => void;
}) {
  const programs = Object.values(BRAND_PROGRAMS_DATA).filter((program) =>
    !businessUnitId || businessUnitId === "all" ? true : program.businessUnitId === businessUnitId
  );
  const [viewMode, setViewMode] = useState<ProgramViewMode>("list");

  useEffect(() => {
    const stored = window.localStorage.getItem(BRAND_PROGRAM_VIEW_KEY);
    if (stored === "grid" || stored === "list") setViewMode(stored);
  }, []);

  function setProgramViewMode(mode: ProgramViewMode) {
    setViewMode(mode);
    window.localStorage.setItem(BRAND_PROGRAM_VIEW_KEY, mode);
  }

  const summaries: Record<string, string> = {
    "Chocolate Bar Drop Vol. 3": "Limited-run chocolate bar collection including new MrBeast Bar flavors. High conversion, impulse-buy price point.",
    "Creator Collab Series": "Affiliate program for creator-native partnerships driving Feastables multipack and bundle sales across YouTube and TikTok audiences.",
    "Back to School Bundle": "Seasonal bundle program targeting high-volume snack purchases for the back-to-school period. Limited enrollment."
  };
  const brandCardMetrics: Record<string, { primary: [string, string]; secondary: [string, string, string, string] }> = {
    "Chocolate Bar Drop Vol. 3": {
      primary: ["$184k", "1,284"],
      secondary: ["18%", "$21,930", "1,284", "8.5x"]
    },
    "Creator Collab Series": {
      primary: ["$246k", "1,902"],
      secondary: ["18%", "$31,800", "1,902", "9.1x"]
    },
    "Back to School Bundle": {
      primary: ["$128k", "942"],
      secondary: ["11%", "$10,360", "942", "6.7x"]
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] w-full flex-col">
      <div className="mx-auto w-full max-w-[1180px] flex-1 px-8 py-8">
        <div className="flex h-[79.773px] w-full flex-col gap-2">
          <div className="flex h-[50px] items-center justify-between gap-4">
            <h1 className="font-[var(--font-jost)] text-[50px] font-semibold leading-[24px] tracking-[-0.2px] text-[#04070f]">All Programs</h1>
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
          <p className="text-[16px] text-muted-foreground">All affiliate programs created by your organisation.</p>
        </div>

        {viewMode === "grid" ? (
          <div className="mt-[35px] grid items-start gap-4 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard
                key={p.programName}
                brandName={p.brandName}
                status="Active"
                programName={p.programName}
                description={summaries[p.programName] || "Performance-ready affiliate program with transparent governance and reliable payout behavior."}
                primaryMetrics={[
                  { label: "Revenue Generated", value: brandCardMetrics[p.programName]?.primary[0] || "$0" },
                  { label: "Orders Driven", value: brandCardMetrics[p.programName]?.primary[1] || "0" }
                ]}
                stats={[
                  { label: "Affiliate", value: brandCardMetrics[p.programName]?.secondary[0] || p.commissionRate },
                  { label: "Total Payout", value: brandCardMetrics[p.programName]?.secondary[1] || "$0" },
                  { label: "Orders Driven", value: brandCardMetrics[p.programName]?.secondary[2] || "0" },
                  { label: "ROAS", value: brandCardMetrics[p.programName]?.secondary[3] || "0x" }
                ]}
                onOpen={() => onOpenProgram(p.programName)}
              />
            ))}
          </div>
        ) : (
          <ListSurface className="mt-[35px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Programme</TableHead>
                  <TableHead>Business Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((p) => (
                  <TableRow key={p.programName} className="cursor-pointer" onClick={() => onOpenProgram(p.programName)}>
                    <TableCell className="font-semibold">{p.programName}</TableCell>
                    <TableCell>{p.businessUnitName}</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>{brandCardMetrics[p.programName]?.primary[0] || "$0"}</TableCell>
                    <TableCell>{brandCardMetrics[p.programName]?.primary[1] || "0"}</TableCell>
                    <TableCell>{brandCardMetrics[p.programName]?.secondary[0] || p.commissionRate}</TableCell>
                    <TableCell>{brandCardMetrics[p.programName]?.secondary[3] || "0x"}</TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenProgram(p.programName);
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
        <div className="mx-auto flex h-full w-full max-w-[1180px] items-center justify-center px-8 pt-[2px]">
          <button className="flex h-[50.391px] items-center gap-4" onClick={onCreateProgram}>
            <span className="flex h-[50px] w-[50px] items-center justify-center rounded-[14px] border-[3px] border-black bg-primary shadow-[3px_3px_0px_0px_black]">
              <PlusCircle className="h-6 w-6" />
            </span>
            <span className="text-left">
              <span className="block text-[26.4px] font-semibold leading-[26.4px] tracking-[-0.88px] text-[#04070f]">
                Create new programs to grow your network
              </span>
              <span className="text-[16px] leading-[24px] text-muted-foreground">
                Use the left rail to create and manage affiliate programs.
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
