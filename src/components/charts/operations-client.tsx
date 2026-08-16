"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { BarList } from "@/components/charts/bar-list";
import { MONTHS, OPERATIONS_MONTH, operationsByChannel, platformColor } from "@/lib/data";
import { formatVnd, formatPercent } from "@/lib/utils";

function NoOperationsData() {
  const opsLabel = MONTHS.find((m) => m.key === OPERATIONS_MONTH)?.label;
  return (
    <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
      Dữ liệu Payout/ROAS theo ngày hiện chỉ mới trích xuất cho {opsLabel}. Chọn tháng đó ở bộ lọc
      để xem.
    </p>
  );
}

export function PayoutSection() {
  const { month, platform } = useFilters();
  const rows = useMemo(
    () =>
      operationsByChannel
        .slice()
        .sort((a, b) => b.payout - a.payout)
        .map((r) => ({
          name: r.channel,
          value: r.payout,
          color: platformColor[r.platform],
          faded: platform !== "Tất cả" && platform !== r.platform,
        })),
    [platform]
  );
  if (month !== OPERATIONS_MONTH) return <NoOperationsData />;
  return <BarList data={rows} />;
}

export function RoasSection() {
  const { month, platform } = useFilters();
  const rows = useMemo(
    () =>
      operationsByChannel
        .slice()
        .sort((a, b) => b.roas - a.roas)
        .map((r) => ({
          name: `${r.channel} · Comm ${formatPercent(r.avgCommPct, 2)}`,
          value: r.roas,
          color: platformColor[r.platform],
          faded: platform !== "Tất cả" && platform !== r.platform,
        })),
    [platform]
  );
  if (month !== OPERATIONS_MONTH) return <NoOperationsData />;
  return <BarList data={rows} valueFormatter={(v) => `${v.toFixed(1)}x`} />;
}

export function OperationsSummary() {
  const { month, platform } = useFilters();
  const rows = operationsByChannel.filter(
    (r) => platform === "Tất cả" || r.platform === platform
  );
  const totalPayout = rows.reduce((s, r) => s + r.payout, 0);
  const totalGmv = rows.reduce((s, r) => s + r.payout * r.roas, 0);
  const blendRoas = totalPayout > 0 ? totalGmv / totalPayout : 0;
  const hasData = month === OPERATIONS_MONTH;

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          Tổng Payout
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {hasData ? formatVnd(totalPayout) : "—"}
        </div>
      </div>
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          ROAS bình quân (blend)
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {hasData ? `${blendRoas.toFixed(1)}x` : "—"}
        </div>
      </div>
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          Số kênh đang chạy
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {hasData ? rows.length : "—"}
        </div>
      </div>
    </div>
  );
}
