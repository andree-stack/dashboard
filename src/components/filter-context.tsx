"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_MONTH, type BuFilter, type MonthKey, type PlatformFilter } from "@/lib/data";
import { DEFAULT_WEEK, shiftWeek, type WeekKey } from "@/lib/weekly-data";
import type { PeriodMode } from "@/lib/affiliate-data";

type FilterState = {
  month: MonthKey;
  platform: PlatformFilter;
  bu: BuFilter;
  week: WeekKey;
  compareWeek: WeekKey | null;
  setMonth: (m: MonthKey) => void;
  setPlatform: (p: PlatformFilter) => void;
  setBu: (b: BuFilter) => void;
  setWeek: (w: WeekKey) => void;
  setCompareWeek: (w: WeekKey | null) => void;
  // Toggle Theo tháng/Theo tuần riêng cho tab Affiliate & Creator — sống ở đây (thay vì local
  // state trong affiliate-client.tsx) để thanh filter sticky ở layout có thể hiển thị chung.
  affiliateMode: PeriodMode;
  setAffiliateMode: (m: PeriodMode) => void;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<MonthKey>(DEFAULT_MONTH);
  const [platform, setPlatform] = useState<PlatformFilter>("Tất cả");
  const [bu, setBu] = useState<BuFilter>("Tất cả");
  const [week, setWeekState] = useState<WeekKey>(DEFAULT_WEEK);
  const [compareWeek, setCompareWeek] = useState<WeekKey | null>(shiftWeek(DEFAULT_WEEK, 1));
  const [affiliateMode, setAffiliateMode] = useState<PeriodMode>("month");

  function setWeek(w: WeekKey) {
    setWeekState(w);
    // Mặc định đổi tuần so sánh sang tuần liền trước của tuần mới chọn; người dùng vẫn có thể tự
    // đổi lại sau đó qua ô "So sánh với".
    setCompareWeek(shiftWeek(w, 1));
  }

  const value = useMemo(
    () => ({
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
    }),
    [month, platform, bu, week, compareWeek, affiliateMode]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}
