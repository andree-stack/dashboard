"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { GroupedBuBar } from "@/components/charts/grouped-bar";
import { BarList } from "@/components/charts/bar-list";
import { KpiCard, KpiRow } from "@/components/kpi-card";
import { PLATFORMS, monthlyPlatformBu, MONTHS, getMonthlyKpi, kpiSnapshot } from "@/lib/data";
import { formatPercent, formatVnd, statusForAchievement } from "@/lib/utils";

export function KpiRowClient() {
  const { month } = useFilters();
  const k = getMonthlyKpi(month);
  const achTone = k.achievementPct != null ? statusForAchievement(k.achievementPct) : null;

  return (
    <>
      <KpiRow>
        <KpiCard
          label="GMV toàn kênh"
          value={k.hasActual ? formatVnd(k.gmvActual!) : "—"}
          foot={k.isMtd ? `${k.label} · số MTD` : k.hasActual ? k.label : `${k.label} · chưa diễn ra`}
        />
        <KpiCard label="Target GMV" value={formatVnd(k.gmvTarget)} foot={k.label} />
        <KpiCard
          label="% Đạt Target"
          value={k.achievementPct != null ? formatPercent(k.achievementPct) : "—"}
          tone={achTone ?? undefined}
          toneLabel={
            achTone === "good" ? "đạt" : achTone === "warn" ? "gần đạt" : achTone === "crit" ? "rủi ro" : undefined
          }
        />
        <KpiCard
          label="Tăng trưởng MoM"
          value={k.momGrowthPct != null ? `${k.momGrowthPct >= 0 ? "+" : ""}${formatPercent(k.momGrowthPct)}` : "—"}
          tone={k.momGrowthPct != null ? (k.momGrowthPct >= 0 ? "good" : "crit") : undefined}
          toneLabel={k.momGrowthPct != null ? (k.momGrowthPct >= 0 ? "▲ tốt" : "▼ giảm") : undefined}
        />
        <KpiCard
          label="Avg Commission % (blend)"
          value={formatPercent(kpiSnapshot.avgCommissionPct, 2)}
          foot={`${kpiSnapshot.period} · 3 kênh MCC`}
        />
        <KpiCard
          label="ROAS toàn kênh (blend)"
          value={`${kpiSnapshot.roasBlend.toFixed(1)}x`}
          foot={kpiSnapshot.period}
        />
        <KpiCard
          label="Tỷ lệ đơn Hoàn thành"
          value={formatPercent(kpiSnapshot.completionRatePct)}
          foot={`ví dụ Shopee PC · ${kpiSnapshot.period}`}
        />
        <KpiCard
          label="Tỷ lệ hoàn (Refund)"
          value={formatPercent(kpiSnapshot.refundPct)}
          tone="good"
          toneLabel="thấp"
          foot={`ví dụ Shopee PC · ${kpiSnapshot.period}`}
        />
      </KpiRow>
      <p className="mt-2 text-[11.5px] text-ink-3">
        4 thẻ đầu cập nhật theo tháng đang chọn (nguồn: VN RunRate&apos;26). 4 thẻ sau cố định theo{" "}
        {kpiSnapshot.period} — dữ liệu vận hành chi tiết hiện chỉ trích xuất cho tháng này.
      </p>
    </>
  );
}

export function PlatformBuSection() {
  const { month, platform } = useFilters();
  const rows = monthlyPlatformBu[month];
  const hasActual = rows.some((r) => r.actual != null);

  const data = useMemo(
    () =>
      PLATFORMS.map((p) => ({
        platform: p,
        PC: rows.find((d) => d.platform === p && d.bu === "PC")?.actual ?? 0,
        MCC: rows.find((d) => d.platform === p && d.bu === "MCC")?.actual ?? 0,
      })),
    [rows]
  );

  const label = MONTHS.find((m) => m.key === month)?.label;

  if (!hasActual) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        {label} chưa diễn ra — chưa có số liệu thực tế, chỉ có target.
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-[12px] text-ink-2">
        {label}, thực tế.
      </p>
      <GroupedBuBar data={data} dimPlatform={platform} />
    </>
  );
}

export function TargetAchievementSection() {
  const { month, platform } = useFilters();
  const rows = monthlyPlatformBu[month];

  const list = useMemo(
    () =>
      rows
        .filter((r) => (platform === "Tất cả" || r.platform === platform) && r.target > 0 && r.actual != null)
        .map((r) => {
          const pct = (r.actual! / r.target) * 100;
          return {
            name: `${r.platform} ${r.bu}`,
            value: pct,
            color:
              pct >= 95 ? "var(--color-good)" : pct >= 80 ? "var(--color-warn)" : "var(--color-crit)",
          };
        })
        .sort((a, b) => a.value - b.value),
    [rows, platform]
  );

  const label = MONTHS.find((m) => m.key === month)?.label;

  if (list.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        {label}: không có kênh nào có cả target và số liệu thực tế cho bộ lọc này.
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-[12px] text-ink-2">{label} — sắp xếp theo % thấp → cao.</p>
      <BarList data={list} valueFormatter={(v) => formatPercent(v, 0)} />
    </>
  );
}
