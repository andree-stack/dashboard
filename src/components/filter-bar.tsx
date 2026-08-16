"use client";

import { useFilters } from "@/components/filter-context";
import { DEFAULT_MONTH, MONTHS, PLATFORMS, type BuFilter, type MonthKey, type PlatformFilter } from "@/lib/data";

export function FilterBar() {
  const { month, platform, bu, setMonth, setPlatform, setBu } = useFilters();

  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-surface">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface pl-3 pr-1 py-1 text-[12.5px] text-ink-2">
          📅
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value as MonthKey)}
            className="rounded-full bg-transparent py-0.5 pr-2 font-bold text-ink-1 outline-none"
          >
            {MONTHS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </span>

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

        {(month !== DEFAULT_MONTH || platform !== "Tất cả" || bu !== "Tất cả") && (
          <button
            onClick={() => {
              setMonth(DEFAULT_MONTH);
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
