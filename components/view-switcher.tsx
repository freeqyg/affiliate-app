"use client";

export function ViewSwitcher({
  viewMode,
  onChange
}: {
  viewMode: "publisher" | "brand";
  onChange: (v: "publisher" | "brand") => void;
}) {
  return (
    <div className="w-full">
      <div className="flex h-10 w-full rounded-[10px] border-2 border-black bg-black/10 p-1 shadow-[2px_2px_0px_0px_black]">
        <button
          type="button"
          onClick={() => onChange("brand")}
          className={[
            "h-7 flex-1 rounded-[6px] px-3 text-sm font-medium transition-colors",
            viewMode === "brand"
              ? "bg-[var(--nav)] text-black"
              : "text-black hover:bg-black/5"
          ].join(" ")}
          aria-pressed={viewMode === "brand"}
        >
          Brand
        </button>
        <button
          type="button"
          onClick={() => onChange("publisher")}
          className={[
            "h-7 flex-1 rounded-[6px] px-3 text-sm font-medium transition-colors",
            viewMode === "publisher"
              ? "bg-[var(--nav)] text-black"
              : "text-black hover:bg-black/5"
          ].join(" ")}
          aria-pressed={viewMode === "publisher"}
        >
          Creator
        </button>
      </div>
    </div>
  );
}
