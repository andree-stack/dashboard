"use client";

import { usePathname } from "next/navigation";
import { useFilters } from "@/components/filter-context";
import { DEFAULT_MONTH, MONTHS, PLATFORMS, type BuFilter, type MonthKey, type PlatformFilter } from "@/lib/data";
import { WeekPicker } from "@/components/week-picker";
import { usePreferences } from "@/components/preferences-context";
import { translateMonthLabel } from "@/lib/i18n";
import type { PeriodMode } from "@/lib/affiliate-data";
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
  const {
    month,
    platform,
    bu,
    week,
    compareWeek,
    setMonth,
    setPlatform,
    setBu,
    setWeek,
    setCompareWeek,
    affiliateMode,
    setAffiliateMode,
  } = useFilters();
  const pathname = usePathname();
  const { t, lang } = usePreferences();
  const isWeekly = pathname?.startsWith("/weekly");
  const isAffiliate = pathname?.startsWith("/affiliate");
  const showMonth = !isWeekly;
  const showWeekPickers = isWeekly || (isAffiliate && affiliateMode === "week");
  const hasActiveFilter = (showMonth && month !== DEFAULT_MONTH) || platform !== "Tất cả" || bu !== "Tất cả";

  return (
    <div className="sticky top-14 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:bg-surface">
      <div className="flex flex-wrap items-end gap-2">
        {showMonth && (
          <FilterField label={t("Kỳ báo cáo")}>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value as MonthKey)}
              className={CONTROL_CLASS}
            >
              {MONTHS.map((m) => (
                <option key={m.key} value={m.key}>
                  {translateMonthLabel(m.label, lang)}
                </option>
              ))}
            </select>
          </FilterField>
        )}

        <FilterField label={t("Nền tảng")}>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as PlatformFilter)}
            className={CONTROL_CLASS}
          >
            <option value="Tất cả">{t("Tất cả")}</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="BU">
          <select value={bu} onChange={(e) => setBu(e.target.value as BuFilter)} className={CONTROL_CLASS}>
            <option value="Tất cả">{t("Tất cả")}</option>
            <option value="PC">PC</option>
            <option value="MCC">MCC</option>
          </select>
        </FilterField>

        {isAffiliate && (
          <FilterField label={t("Chế độ xem")}>
            <div className="flex h-9 overflow-hidden rounded-full border border-border">
              {(["month", "week"] as PeriodMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAffiliateMode(m)}
                  className={cn(
                    "px-3 text-[12.5px] font-semibold",
                    affiliateMode === m ? "bg-accent-soft text-accent-ink" : "bg-surface text-ink-2"
                  )}
                >
                  {m === "month" ? t("Theo tháng") : t("Theo tuần")}
                </button>
              ))}
            </div>
          </FilterField>
        )}

        {/* Trên /affiliate, giữ mount 2 WeekPicker (chỉ ẩn bằng visibility, không unmount) khi đổi
            Theo tháng/Theo tuần — tránh đổi bề rộng thanh filter rồi nhảy dòng. Trên /weekly luôn
            hiện; các trang khác không render (không cần chừa chỗ trống). */}
        {(isWeekly || isAffiliate) && (
          <div className={cn("flex gap-2", !showWeekPickers && "invisible")} aria-hidden={!showWeekPickers}>
            <FilterField label={t("Tuần xem")}>
              <WeekPicker label={t("Tuần xem")} value={week} onChange={setWeek} />
            </FilterField>
            <FilterField label={t("So sánh với")}>
              <WeekPicker label={t("So sánh với")} value={compareWeek} onChange={setCompareWeek} excludeWeek={week} />
            </FilterField>
          </div>
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
            {t("Xoá lọc")}
          </button>
        )}
      </div>
    </div>
  );
}
