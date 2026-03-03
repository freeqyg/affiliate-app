"use client";

import { useMemo, useState } from "react";
import { FolderKanban, LayoutGrid, LayoutList, Settings, Eye } from "lucide-react";
import { ViewSwitcher } from "@/components/view-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND_PROGRAMS_DATA, COMMISSIONS } from "@/lib/mock-data";
import { AllProgramsGrid } from "@/components/brand/all-programs-grid";
import { BrandProgramDetail } from "@/components/brand/brand-program-detail";
import { CommissionQueue } from "@/components/brand/commission-queue";
import { CommissionDetailBrand } from "@/components/brand/commission-detail-brand";
import { DisputeInbox } from "@/components/brand/dispute-inbox";
import { PublishersList } from "@/components/brand/publishers-list";
import { CreateProgram, CreateProgramDraft } from "@/components/brand/create-program";

type BrandScreen = "all-programs" | "program-detail" | "queue" | "disputes" | "dispute-detail" | "publishers" | "detail" | "create-program";

export function BrandShell({
  viewMode,
  setViewMode
}: {
  viewMode: "publisher" | "brand";
  setViewMode: (v: "publisher" | "brand") => void;
}) {
  const [screen, setScreen] = useState<BrandScreen>("all-programs");
  const [activeProgram, setActiveProgram] = useState<"all" | string>("all");
  const [activeCommissionId, setActiveCommissionId] = useState<string>("COM-1001");
  const [createdPrograms, setCreatedPrograms] = useState<(CreateProgramDraft & { status: "draft" | "active" })[]>([]);

  const selectedProgram = activeProgram !== "all" ? (BRAND_PROGRAMS_DATA[activeProgram] || createdPrograms.find((p) => p.programName === activeProgram)) : null;
  const activeCommission = COMMISSIONS.find((c) => c.id === activeCommissionId) || COMMISSIONS[0];

  const crumbs = useMemo(() => {
    const list = [{ label: "All Programs", onClick: () => { setScreen("all-programs"); setActiveProgram("all"); } }];
    if (activeProgram !== "all") list.push({ label: activeProgram, onClick: () => setScreen("program-detail") });
    if (screen === "detail") list.push({ label: activeCommissionId, onClick: () => setScreen("detail") });
    if (screen === "disputes") list.push({ label: "Disputes", onClick: () => setScreen("disputes") });
    return list;
  }, [screen, activeProgram, activeCommissionId]);

  function openCommission(id: string) {
    setActiveCommissionId(id);
    setScreen("detail");
  }

  const isAllPrograms = screen === "all-programs" || screen === "program-detail";
  const isAllCommissions = screen === "queue" || screen === "detail";
  const navItemClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
      active
        ? "border-l-[3px] border-l-[#37dcff] bg-card text-foreground"
        : "border-l-[3px] border-l-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-[226px] shrink-0 border-r border-white/10 bg-card flex flex-col">
        <div className="flex h-[60px] items-center justify-between border-b border-white/10 px-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black">
              <Eye className="h-4 w-4 text-yellow-300" />
            </div>
            <span className="font-semibold tracking-wide">FREEQ</span>
          </div>
          <button className="text-muted-foreground hover:text-foreground">‹</button>
        </div>
        <div className="p-2">
          <Button className="h-8 w-full justify-between px-3 text-sm" onClick={() => setScreen("create-program")}>
            Create Program <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
        </div>
        <nav className="space-y-1 pt-1">
          <button className={navItemClass(isAllPrograms)} onClick={() => { setScreen("all-programs"); setActiveProgram("all"); }}><FolderKanban className="h-4 w-4" />All Programs</button>
          <button className={navItemClass(isAllCommissions)} onClick={() => { setScreen("queue"); setActiveProgram("all"); }}><LayoutList className="h-4 w-4" />All Commissions</button>
          <button className={navItemClass(screen === "disputes")} onClick={() => setScreen("disputes")}>Disputes</button>
          <button className={navItemClass(screen === "publishers")} onClick={() => setScreen("publishers")}>Publishers</button>
        </nav>
        <div className="my-3 border-t border-white/10" />
        <div className="space-y-1 overflow-y-auto px-1 text-sm">
          {[...Object.keys(BRAND_PROGRAMS_DATA), ...createdPrograms.map((p) => p.programName)].map((program) => {
            const isDraft = createdPrograms.find((p) => p.programName === program)?.status === "draft";
            return (
              <button key={program} onClick={() => { setActiveProgram(program); setScreen("program-detail"); }} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground">
                <span className="truncate">{program}</span>
                {isDraft && <Badge>Draft</Badge>}
              </button>
            );
          })}
        </div>

        <div className="mt-auto space-y-3 border-t border-white/10 px-3 py-3">
          <ViewSwitcher viewMode={viewMode} onChange={(v) => { setViewMode(v); setScreen("all-programs"); setActiveProgram("all"); }} />
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Settings className="h-4 w-4" />Settings</button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="h-[60px] shrink-0 border-b border-white/10 bg-black px-6 flex items-center gap-2 text-sm">
          {crumbs.map((c, i) => (
            <div key={c.label} className="flex items-center gap-2">
              <button className="text-muted-foreground hover:text-foreground" onClick={c.onClick}>{c.label}</button>
              {i < crumbs.length - 1 && <span className="text-muted-foreground">/</span>}
            </div>
          ))}
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {screen === "all-programs" && <AllProgramsGrid onOpenProgram={(p) => { setActiveProgram(p); setScreen("program-detail"); }} onCreateProgram={() => setScreen("create-program")} />}
            {screen === "program-detail" && selectedProgram && "trustSummary" in selectedProgram && <BrandProgramDetail program={selectedProgram as any} onOpenCommission={openCommission} />}
            {screen === "queue" && <CommissionQueue programFilter={activeProgram} onOpenCommission={openCommission} />}
            {screen === "detail" && <CommissionDetailBrand commission={activeCommission} />}
            {screen === "disputes" && <DisputeInbox onOpenCommission={openCommission} />}
            {screen === "publishers" && <PublishersList programFilter={activeProgram} />}
            {screen === "create-program" && (
              <CreateProgram
                onSaveDraft={(draft) => {
                  setCreatedPrograms((prev) => [...prev.filter((p) => p.programName !== draft.programName), { ...draft, status: "draft" }]);
                  setActiveProgram(draft.programName);
                }}
                onPublish={(draft) => {
                  setCreatedPrograms((prev) => [...prev.filter((p) => p.programName !== draft.programName), { ...draft, status: "active" }]);
                  setActiveProgram(draft.programName);
                  setScreen("all-programs");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
