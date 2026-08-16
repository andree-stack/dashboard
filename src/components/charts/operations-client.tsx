"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { BarList } from "@/components/charts/bar-list";
import { MONTHS, monthlyChannelOps, getChannelOps, platformColor, type Platform, type BU } from "@/lib/data";
import { formatVnd, formatPercent } from "@/lib/utils";

function channelRows(month: ReturnType<typeof useFilters>["month"]) {
  const monthData = monthlyChannelOps[month];
  if (!monthData) return [];
  return Object.entries(monthData).map(([key, v]) => {
    const [platform, bu] = key.split("-") as [Platform, BU];
    return { platform, bu, channel: `${platform} ${bu}`, ...v };
  });
}

function NoOperationsData({ month }: { month: string }) {
  return (
    <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
      {month} chưa có dữ liệu Payout/ROAS chi tiết (tháng chưa diễn ra hoặc chưa trích xuất).
    </p>
  );
}

export function PayoutSection() {
  const { month, platform } = useFilters();
  const monthLabel = MONTHS.find((m) => m.key === month)?.label ?? month;
  const rows = useMemo(
    () =>
      channelRows(month)
        .slice()
        .sort((a, b) => b.payout - a.payout)
        .map((r) => ({
          name: r.channel,
          value: r.payout,
          color: platformColor[r.platform],
          faded: platform !== "Tất cả" && platform !== r.platform,
        })),
    [month, platform]
  );
  if (rows.length === 0) return <NoOperationsData month={monthLabel} />;
  return <BarList data={rows} />;
}

export function RoasSection() {
  const { month, platform } = useFilters();
  const monthLabel = MONTHS.find((m) => m.key === month)?.label ?? month;
  const rows = useMemo(
    () =>
      channelRows(month)
        .slice()
        .sort((a, b) => b.roas - a.roas)
        .map((r) => ({
          name: `${r.channel} · Comm ${formatPercent(r.avgCommissionPct, 2)}`,
          value: r.roas,
          color: platformColor[r.platform],
          faded: platform !== "Tất cả" && platform !== r.platform,
        })),
    [month, platform]
  );
  if (rows.length === 0) return <NoOperationsData month={monthLabel} />;
  return <BarList data={rows} valueFormatter={(v) => `${v.toFixed(1)}x`} />;
}

export function OperationsSummary() {
  const { month, platform, bu } = useFilters();
  const ops = getChannelOps(month, platform, bu);
  const rows = channelRows(month).filter(
    (r) => (platform === "Tất cả" || r.platform === platform) && (bu === "Tất cả" || r.bu === bu)
  );

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          Tổng Payout
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {ops.hasData ? formatVnd(rows.reduce((s, r) => s + r.payout, 0)) : "—"}
        </div>
      </div>
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          ROAS bình quân (blend)
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {ops.hasData ? `${ops.roas.toFixed(1)}x` : "—"}
        </div>
      </div>
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          Số kênh đang chạy
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {ops.hasData ? rows.length : "—"}
        </div>
      </div>
    </div>
  );
}
