"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_MONTH, type BuFilter, type MonthKey, type PlatformFilter } from "@/lib/data";

type FilterState = {
  month: MonthKey;
  platform: PlatformFilter;
  bu: BuFilter;
  setMonth: (m: MonthKey) => void;
  setPlatform: (p: PlatformFilter) => void;
  setBu: (b: BuFilter) => void;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [month, setMonth] = useState<MonthKey>(DEFAULT_MONTH);
  const [platform, setPlatform] = useState<PlatformFilter>("Tất cả");
  const [bu, setBu] = useState<BuFilter>("Tất cả");

  const value = useMemo(
    () => ({ month, platform, bu, setMonth, setPlatform, setBu }),
    [month, platform, bu]
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
