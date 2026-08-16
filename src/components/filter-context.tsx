"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { BuFilter, PlatformFilter } from "@/lib/data";

type FilterState = {
  platform: PlatformFilter;
  bu: BuFilter;
  setPlatform: (p: PlatformFilter) => void;
  setBu: (b: BuFilter) => void;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<PlatformFilter>("Tất cả");
  const [bu, setBu] = useState<BuFilter>("Tất cả");

  const value = useMemo(
    () => ({ platform, bu, setPlatform, setBu }),
    [platform, bu]
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
