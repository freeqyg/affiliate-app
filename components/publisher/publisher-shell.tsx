"use client";

import { useMemo, useState } from "react";
import { Compass, DollarSign, LayoutGrid, Settings, ShieldAlert, Store, Eye } from "lucide-react";
import { ViewSwitcher } from "@/components/view-switcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COMMISSIONS, CommissionStatus } from "@/lib/mock-data";
import { EarningsDashboard } from "@/components/publisher/earnings-dashboard";
import { CommissionDetail } from "@/components/publisher/commission-detail";
import { DisputeWizard } from "@/components/publisher/dispute-wizard";
import { DisputeResolution } from "@/components/publisher/dispute-resolution";
import { MyPrograms } from "@/components/publisher/my-programs";
import { EnrolledProgramDetail } from "@/components/publisher/enrolled-program-detail";
import { DiscoverPrograms } from "@/components/publisher/discover-programs";
import { ProgramDetail } from "@/components/publisher/program-detail";
import { ProgramJoinConfirmation } from "@/components/publisher/program-join-confirmation";

type PublisherScreen =
  | "earnings"
  | "detail"
  | "dispute-wizard"
  | "disputes"
  | "dispute-detail"
  | "my-programs"
  | "discover"
  | "program-detail"
  | "program-joined"
  | "enrolled-program-detail";

export function PublisherShell({
  viewMode,
  setViewMode
}: {
  viewMode: "publisher" | "brand";
  setViewMode: (v: "publisher" | "brand") => void;
}) {
  const [screen, setScreen] = useState<PublisherScreen>("earnings");
  const [activeCommissionId, setActiveCommissionId] = useState("COM-1004");
  const [activeProgram, setActiveProgram] = useState("Chocolate Bar Drop Vol. 3");
  const [tab, setTab] = useState<"all" | CommissionStatus>("all");

  const commission = COMMISSIONS.find((c) => c.id === activeCommissionId) || COMMISSIONS[0];

  const crumbs = useMemo(() => {
    const list = [{ label: "Earnings", onClick: () => setScreen("earnings") }];
    if (screen === "detail") list.push({ label: activeCommissionId, onClick: () => setScreen("detail") });
    if (["program-detail", "program-joined", "enrolled-program-detail"].includes(screen)) list.push({ label: activeProgram, onClick: () => setScreen("program-detail") });
    if (screen === "disputes") list.push({ label: "Disputes", onClick: () => setScreen("disputes") });
    return list;
  }, [screen, activeCommissionId, activeProgram]);

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
          <Button className="h-8 w-full justify-between px-3 text-sm" onClick={() => setScreen("discover")}>
            Discover Programs <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
        </div>

        <nav className="space-y-1 pt-1">
          <button className={navItemClass(screen === "earnings" || screen === "detail")} onClick={() => setScreen("earnings")}><DollarSign className="h-4 w-4" />Earnings</button>
          <button className={navItemClass(screen === "my-programs" || screen === "enrolled-program-detail")} onClick={() => setScreen("my-programs")}><Store className="h-4 w-4" />My Programs</button>
          <button className={navItemClass(screen === "disputes" || screen === "dispute-wizard")} onClick={() => setScreen("disputes")}><ShieldAlert className="h-4 w-4" />Disputes</button>
          <button className={navItemClass(screen === "discover" || screen === "program-detail" || screen === "program-joined")} onClick={() => setScreen("discover")}><Compass className="h-4 w-4" />Discover</button>
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/10 px-3 py-3">
          <ViewSwitcher viewMode={viewMode} onChange={(v) => { setViewMode(v); setScreen("earnings"); }} />
          <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><Settings className="h-4 w-4" />Settings</button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="h-[60px] shrink-0 border-b border-white/10 bg-black px-6 flex items-center gap-2 text-sm">
          {crumbs.map((c, i) => (
            <div key={c.label} className="flex items-center gap-2">
              <button onClick={c.onClick} className="text-muted-foreground hover:text-foreground">{c.label}</button>
              {i < crumbs.length - 1 && <span className="text-muted-foreground">/</span>}
            </div>
          ))}
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">
            {screen === "earnings" && <EarningsDashboard tab={tab} onTab={setTab} onOpenCommission={(id) => { setActiveCommissionId(id); setScreen("detail"); }} />}
            {screen === "detail" && <CommissionDetail commission={commission} onDispute={(id) => { setActiveCommissionId(id); setScreen("dispute-wizard"); }} />}
            {screen === "dispute-wizard" && <DisputeWizard commissionId={activeCommissionId} onSubmit={() => setScreen("disputes")} />}
            {screen === "disputes" && <DisputeResolution />}
            {screen === "my-programs" && <MyPrograms onOpenProgram={(name) => { setActiveProgram(name); setScreen("enrolled-program-detail"); }} onDiscover={() => setScreen("discover")} />}
            {screen === "enrolled-program-detail" && <EnrolledProgramDetail programName={activeProgram} onOpenCommission={(id) => { setActiveCommissionId(id); setScreen("detail"); }} />}
            {screen === "discover" && <DiscoverPrograms onOpenProgram={(name) => { setActiveProgram(name); setScreen("program-detail"); }} />}
            {screen === "program-detail" && <ProgramDetail name={activeProgram} onJoin={() => setScreen("program-joined")} />}
            {screen === "program-joined" && <ProgramJoinConfirmation name={activeProgram} onMyPrograms={() => setScreen("my-programs")} onDiscover={() => setScreen("discover")} />}
          </div>
        </div>
      </main>
    </div>
  );
}
