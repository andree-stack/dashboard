import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a raw VND number as a compact "x,xx tỷ ₫" / "xxx tr ₫" string. */
export function formatVnd(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })} tỷ ₫`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1,
    })} tr ₫`;
  }
  return `${value.toLocaleString("vi-VN")} ₫`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(value);
}

export function statusForAchievement(pct: number): "good" | "warn" | "crit" {
  if (pct >= 95) return "good";
  if (pct >= 80) return "warn";
  return "crit";
}
