"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { GroupedBuBar } from "@/components/charts/grouped-bar";
import { BarList } from "@/components/charts/bar-list";
import { KpiCard, KpiRow } from "@/components/kpi-card";
import { PLATFORMS, monthlyPlatformBu, MONTHS, getFilteredKpi, getChannelOps } from "@/lib/data";
import { formatPercent, formatVnd, statusForAchievement } from "@/lib/utils";

export function KpiRowClient() {
  const { month, platform, bu } = useFilters();
  const k = getFilteredKpi(month, platform, bu);
  const ops = getChannelOps(month, platform, bu);
  const achTone = k.achievementPct != null ? statusForAchievement(k.achievementPct) : null;

  const scopeLabel = [platform !== "Tất cả" ? platform : null, bu !== "Tất cả" ? bu : null]
    .filter(Boolean)
    .join(" ");
  const monthLabel = MONTHS.find((m) => m.key === month)?.label;
  const noOpsNote = `${monthLabel} · không có dữ liệu cho ${scopeLabel || "bộ lọc này"}`;

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
          foot={ops.hasData ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}` : noOpsNote}
        />
        <KpiCard
          label="ROAS"
          value={ops.hasData ? `${ops.roas.toFixed(1)}x` : "—"}
          foot={ops.hasData ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}` : noOpsNote}
        />
        <KpiCard
          label="Tỷ lệ đơn Hoàn thành"
          value={ops.completionRatePct != null ? formatPercent(ops.completionRatePct) : "—"}
          foot={
            ops.completionRatePct != null
              ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}`
              : ops.hasData
              ? `${monthLabel} · ${scopeLabel || "kênh này"} không có cột Order Status`
              : noOpsNote
          }
        />
        <KpiCard
          label="Tỷ lệ hoàn (Refund)"
          value={ops.refundRatePct != null ? formatPercent(ops.refundRatePct) : "—"}
          tone={ops.refundRatePct != null ? "good" : undefined}
          toneLabel={ops.refundRatePct != null ? (ops.refundRatePct < 12 ? "thấp" : "theo dõi") : undefined}
          foot={
            ops.refundRatePct != null
              ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}`
              : ops.hasData
              ? `${monthLabel} · ${scopeLabel || "kênh này"} không có cột Refund`
              : noOpsNote
          }
        />
      </KpiRow>
      <p className="mt-2 text-[11.5px] text-ink-3">
        4 thẻ đầu nguồn VN RunRate&apos;26. 4 thẻ sau (Avg Commission/ROAS/Hoàn thành/Refund) tính
        trực tiếp từ 5 sheet chi tiết giao dịch, theo đúng Tháng + Platform + BU đang chọn — GMV nội
        bộ của nhóm này có thể lệch nhẹ so với 4 thẻ đầu do khác nguồn tổng hợp. Lazada không có cột
        Order Status/Refund nên Tỷ lệ Hoàn thành/Refund luôn để trống cho kênh đó.
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
