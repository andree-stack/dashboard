"use client";

import { useFilters } from "@/components/filter-context";
import { PLATFORMS, type BuFilter, type PlatformFilter } from "@/lib/data";

const periodLabel = "Tháng 4–5/2026";

export function FilterBar() {
  const { platform, bu, setPlatform, setBu } = useFilters();

  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-surface">
      <div className="flex flex-wrap items-center gap-2">
        <Chip>📅 Kỳ báo cáo: <b>{periodLabel}</b></Chip>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as PlatformFilter)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-ink-1 outline-none focus:border-accent"
        >
          <option>Tất cả</option>
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          value={bu}
          onChange={(e) => setBu(e.target.value as BuFilter)}
          className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-ink-1 outline-none focus:border-accent"
        >
          <option>Tất cả</option>
          <option>PC</option>
          <option>MCC</option>
        </select>

        {(platform !== "Tất cả" || bu !== "Tất cả") && (
          <button
            onClick={() => {
              setPlatform("Tất cả");
              setBu("Tất cả");
            }}
            className="text-[12px] font-semibold text-accent-ink hover:underline"
          >
            Xoá lọc
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-ink-2">
      {children}
    </span>
  );
}
