"use client";

import { ProgramCard } from "@/components/program-card";

const DISCOVER = [
  {
    brand: "Feastables",
    programName: "Chocolate Bar Drop Vol. 3",
    category: "Snacks",
    description: "Launch-focused chocolate drops.",
    rate: "14%",
    cookie: "14 days",
    attribution: "Last-click",
    validation: "21 days"
  },
  {
    brand: "Feastables",
    programName: "Creator Collab Series",
    category: "Snacks",
    description: "Creator capsule collabs.",
    rate: "18%",
    cookie: "30 days",
    attribution: "Last-click",
    validation: "21 days"
  },
  {
    brand: "Feastables",
    programName: "Back to School Bundle",
    category: "Snacks",
    description: "Student-themed bundles.",
    rate: "11%",
    cookie: "7 days",
    attribution: "Last-click",
    validation: "14 days"
  },
  {
    brand: "Hydr8",
    programName: "Summer Hydration",
    category: "Wellness",
    description: "Hydration packs + refills.",
    rate: "12%",
    cookie: "21 days",
    attribution: "Last-click",
    validation: "21 days"
  },
  {
    brand: "NordLane",
    programName: "Cold Brew Launch",
    category: "Beverage",
    description: "DTC cold brew subscription.",
    rate: "9%",
    cookie: "30 days",
    attribution: "Last-click",
    validation: "30 days"
  },
  {
    brand: "KiteFuel",
    programName: "Protein Essentials",
    category: "Fitness",
    description: "Protein stack starter pack.",
    rate: "15%",
    cookie: "14 days",
    attribution: "Last-click",
    validation: "14 days"
  }
];

export function DiscoverPrograms({ onOpenProgram }: { onOpenProgram: (name: string) => void }) {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
      {DISCOVER.map((p) => (
        <ProgramCard
          key={p.programName}
          brandName={p.brand}
          status="Open"
          badgeLabel={p.category}
          programName={p.programName}
          description={p.description}
          primaryMetrics={[
            { label: "Commission Rate", value: p.rate },
            { label: "Cookie Window", value: p.cookie }
          ]}
          stats={[
            { label: "Attribution", value: p.attribution },
            { label: "Validation", value: p.validation },
            { label: "Payouts", value: "Monthly" },
            { label: "Status", value: "Open" }
          ]}
          ctaLabel="Review Program"
          onOpen={() => onOpenProgram(p.programName)}
        />
      ))}
    </div>
  );
}
