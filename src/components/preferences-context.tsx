"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { translate, USD_VND_RATE, type Lang } from "@/lib/i18n";
import { formatVnd } from "@/lib/utils";

export type Currency = "vnd" | "usd";

type PreferencesState = {
  lang: Lang;
  currency: Currency;
  setLang: (l: Lang) => void;
  setCurrency: (c: Currency) => void;
  /** Dịch 1 chuỗi UI tĩnh (không dịch giá trị dữ liệu thô như tên creator/category). */
  t: (vi: string) => string;
  /** Format tiền theo currency đang chọn — input luôn là VND gốc. */
  formatMoney: (vnd: number) => string;
};

const PreferencesContext = createContext<PreferencesState | null>(null);

function formatUsd(vnd: number): string {
  const usd = vnd / USD_VND_RATE;
  const abs = Math.abs(usd);
  if (abs >= 1_000_000) {
    return `$${(usd / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}M`;
  }
  if (abs >= 1_000) {
    return `$${(usd / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`;
  }
  return `$${usd.toLocaleString("en-US", { maximumFractionDigits: usd < 10 ? 2 : 0 })}`;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");
  const [currency, setCurrency] = useState<Currency>("vnd");

  const value = useMemo<PreferencesState>(
    () => ({
      lang,
      currency,
      setLang,
      setCurrency,
      t: (vi: string) => translate(vi, lang),
      formatMoney: (vnd: number) => (currency === "vnd" ? formatVnd(vnd) : formatUsd(vnd)),
    }),
    [lang, currency]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
