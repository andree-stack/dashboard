"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { GroupedBuBar } from "@/components/charts/grouped-bar";
import { BarList } from "@/components/charts/bar-list";
import { KpiCard, KpiRow } from "@/components/kpi-card";
import {
  PLATFORMS,
  monthlyPlatformBu,
  MONTHS,
  getFilteredKpi,
  getFilteredOperations,
  getExampleOrderMetrics,
  kpiSnapshot,
} from "@/lib/data";
import { formatPercent, formatVnd, statusForAchievement } from "@/lib/utils";

export function KpiRowClient() {
  const { month, platform, bu } = useFilters();
  const k = getFilteredKpi(month, platform, bu);
  const ops = getFilteredOperations(platform, bu);
  const orderStats = getExampleOrderMetrics(platform, bu);
  const achTone = k.achievementPct != null ? statusForAchievement(k.achievementPct) : null;

  const scopeLabel = [platform !== "Tất cả" ? platform : null, bu !== "Tất cả" ? bu : null]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <KpiRow>
        <KpiCard
          label="GMV toàn kênh"
          value={!k.hasChannels ? "—" : k.hasActual ? formatVnd(k.gmvActual!) : "—"}
          foot={
            !k.hasChannels
              ? `${k.label} · không có kênh khớp bộ lọc`
              : k.isMtd
              ? `${k.label} · số MTD`
              : k.hasActual
              ? k.label
              : `${k.label} · chưa diễn ra`
          }
        />
        <KpiCard
          label="Target GMV"
          value={k.hasChannels && k.gmvTarget > 0 ? formatVnd(k.gmvTarget) : "—"}
          foot={k.label}
        />
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
          label="Avg Commission %"
          value={ops.hasData ? formatPercent(ops.avgCommissionPct, 2) : "—"}
          foot={ops.hasData ? `${kpiSnapshot.period}${scopeLabel ? " · " + scopeLabel : " · 3 kênh MCC"}` : `${kpiSnapshot.period} · không có dữ liệu cho bộ lọc này`}
        />
        <KpiCard
          label="ROAS"
          value={ops.hasData ? `${ops.roasBlend.toFixed(1)}x` : "—"}
          foot={ops.hasData ? `${kpiSnapshot.period}${scopeLabel ? " · " + scopeLabel : ""}` : `${kpiSnapshot.period} · không có dữ liệu cho bộ lọc này`}
        />
        <KpiCard
          label="Tỷ lệ đơn Hoàn thành"
          value={orderStats.hasData ? formatPercent(orderStats.completionRatePct) : "—"}
          foot={
            orderStats.hasData
              ? `ví dụ ${orderStats.platformLabel} · ${kpiSnapshot.period}`
              : "chưa có dữ liệu mẫu cho kênh này"
          }
        />
        <KpiCard
          label="Tỷ lệ hoàn (Refund)"
          value={orderStats.hasData ? formatPercent(orderStats.refundPct) : "—"}
          tone={orderStats.hasData ? "good" : undefined}
          toneLabel={orderStats.hasData ? "thấp" : undefined}
          foot={
            orderStats.hasData
              ? `ví dụ ${orderStats.platformLabel} · ${kpiSnapshot.period}`
              : "chưa có dữ liệu mẫu cho kênh này"
          }
        />
      </KpiRow>
      <p className="mt-2 text-[11.5px] text-ink-3">
        4 thẻ đầu cập nhật theo Tháng + Platform + BU đang chọn (nguồn: VN RunRate&apos;26). 4 thẻ
        sau lọc theo Platform/BU trong phạm vi dữ liệu vận hành chi tiết — hiện chỉ có cho{" "}
        {kpiSnapshot.period} (Payout/ROAS: 3 kênh MCC · Hoàn thành/Refund: Shopee PC &amp; MCC).
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
