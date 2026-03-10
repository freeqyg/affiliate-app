"use client";

import { useMemo, useState } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { BRAND_PROGRAMS_DATA, BRANDS, BUSINESS_UNITS, COMMISSIONS } from "@/lib/mock-data";

type UnitRow = {
  id: string;
  brandId: string;
  name: string;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BusinessUnitsManager() {
  const [units, setUnits] = useState<UnitRow[]>(() => Object.values(BUSINESS_UNITS));
  const [name, setName] = useState("");

  const counts = useMemo(() => {
    return units.reduce<Record<string, { programs: number; commissions: number }>>((acc, unit) => {
      const programs = Object.values(BRAND_PROGRAMS_DATA).filter((program) => program.businessUnitId === unit.id);
      const programIds = new Set(programs.map((program) => program.programId));
      const commissions = COMMISSIONS.filter((commission) => programIds.has(commission.programId));

      acc[unit.id] = {
        programs: programs.length,
        commissions: commissions.length
      };
      return acc;
    }, {});
  }, [units]);

  function addUnit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `bu-${toSlug(trimmed) || "new-unit"}`;
    if (units.some((unit) => unit.id === id)) return;
    setUnits((prev) => [...prev, { id, brandId: "brand-mr-beast", name: trimmed }]);
    setName("");
  }

  function removeUnit(id: string) {
    setUnits((prev) => prev.filter((unit) => unit.id !== id));
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="mx-auto w-full max-w-[860px] space-y-2 pt-[26px] text-center">
        <h1 className="text-[44px] font-semibold leading-[1] tracking-[-0.2px] text-[#04070f]">Business Units</h1>
        <p className="text-[18px] text-muted-foreground">
          Organize programmes under business units tied to your brand.
        </p>
      </div>

      <div className="mx-auto w-full max-w-[860px] rounded-[20px] border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_black]">
        <div className="mb-5 flex flex-wrap items-end gap-3 border-b border-black/10 pb-5">
          <div className="min-w-[260px] flex-1">
            <label className="mb-2 block text-sm font-semibold text-[#04070f]">Add Business Unit</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addUnit();
              }}
              placeholder="e.g. New Category Team"
              className="h-11 w-full rounded-[11px] border border-black/10 bg-[var(--background)] px-3 text-[16px] outline-none focus:ring-2 focus:ring-[#37dcff]"
            />
          </div>
          <button
            onClick={addUnit}
            className="flex h-11 items-center gap-2 rounded-[11px] border-2 border-black bg-primary px-4 text-[16px] font-semibold text-[#04070f] shadow-[3px_3px_0px_0px_black] hover:brightness-105"
          >
            <Plus className="h-4 w-4" />
            Add Unit
          </button>
        </div>

        <div className="space-y-3">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="flex items-center justify-between rounded-[12px] border border-black/10 bg-[rgba(242,253,255,0.42)] px-4 py-3 transition-colors hover:bg-[rgba(242,253,255,0.82)]"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-black/10 bg-white">
                  <Building2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[17px] font-semibold leading-none text-[#04070f]">{unit.name}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {BRANDS[unit.brandId]?.name || "Brand"} · {counts[unit.id]?.programs || 0} programs · {counts[unit.id]?.commissions || 0} commissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeUnit(unit.id)}
                className="flex h-9 items-center gap-2 rounded-[10px] border border-black/10 bg-white px-3 text-[13px] font-medium hover:bg-black/5"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
