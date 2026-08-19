"use client";

import { usePathname } from "next/navigation";
import { useFilters } from "@/components/filter-context";
import { DEFAULT_MONTH, MONTHS, PLATFORMS, type BuFilter, type MonthKey, type PlatformFilter } from "@/lib/data";
import { WeekPicker } from "@/components/week-picker";
import { cn } from "@/lib/utils";

const CONTROL_CLASS =
  "h-9 rounded-full border border-border bg-surface px-3.5 text-[12.5px] font-semibold text-ink-1 outline-none focus:border-accent";

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-3">{label}</span>
      {children}
    </div>
  );
}

export function FilterBar() {
  const { month, platform, bu, week, compareWeek, setMonth, setPlatform, setBu, setWeek, setCompareWeek } =
    useFilters();
  const pathname = usePathname();
  const isWeekly = pathname?.startsWith("/weekly");
  const showMonth = !isWeekly;
  const hasActiveFilter = (showMonth && month !== DEFAULT_MONTH) || platform !== "Tất cả" || bu !== "Tất cả";

  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-surface">
      <div className="flex flex-wrap items-end gap-2">
        {showMonth && (
          <FilterField label="Kỳ báo cáo">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value as MonthKey)}
              className={CONTROL_CLASS}
            >
              {MONTHS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </FilterField>
        )}

        <FilterField label="Nền tảng">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as PlatformFilter)}
            className={CONTROL_CLASS}
          >
            <option>Tất cả</option>
            {PLATFORMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </FilterField>

        <FilterField label="BU">
          <select value={bu} onChange={(e) => setBu(e.target.value as BuFilter)} className={CONTROL_CLASS}>
            <option>Tất cả</option>
            <option>PC</option>
            <option>MCC</option>
          </select>
        </FilterField>

        {isWeekly && (
          <>
            <FilterField label="Tuần xem">
              <WeekPicker label="Tuần xem" value={week} onChange={setWeek} />
            </FilterField>
            <FilterField label="So sánh với">
              <WeekPicker label="So sánh với" value={compareWeek} onChange={setCompareWeek} excludeWeek={week} />
            </FilterField>
          </>
        )}

        {hasActiveFilter && (
          <button
            onClick={() => {
              if (showMonth) setMonth(DEFAULT_MONTH);
              setPlatform("Tất cả");
              setBu("Tất cả");
            }}
            className={cn("h-9 text-[12px] font-semibold text-accent-ink hover:underline")}
          >
            Xoá lọc
          </button>
        )}
      </div>
    </div>
  );
}
