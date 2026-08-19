"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import {
  WEEKS,
  DEFAULT_WEEK,
  getWeeklyKpis,
  getWeeklyChannelRows,
  getWeeklyHighlights,
  type WeekKey,
  type Delta,
} from "@/lib/weekly-data";
import { formatVnd, formatPercent, cn } from "@/lib/utils";
import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { WeeklyTrendChart } from "@/components/charts/weekly-trend-chart";

const HIGHLIGHT_THRESHOLD = 15;

function DeltaTag({ d, label }: { d: Delta; label?: string }) {
  const prefix = label ? `${label}: ` : "";
  if (d.pct == null) {
    return <span className="inline-flex items-center gap-1 text-[11px] text-ink-3">{prefix}—</span>;
  }
  const Icon = d.direction === "up" ? ArrowUp : d.direction === "down" ? ArrowDown : Minus;
  const tone =
    d.direction === "up" ? "text-good-ink" : d.direction === "down" ? "text-crit-ink" : "text-ink-3";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold", tone)}>
      <Icon size={11} />
      {prefix}
      {d.pct >= 0 ? "+" : ""}
      {formatPercent(d.pct, 1)}
    </span>
  );
}

function formatCardValue(key: string, value: number | null): string {
  if (value == null) return "—";
  if (key === "orders") return value.toLocaleString("vi-VN");
  return formatVnd(value);
}

export function WeekSelector({ week, onChange }: { week: WeekKey; onChange: (w: WeekKey) => void }) {
  const meta = WEEKS.find((w) => w.key === week)!;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface pl-3 pr-1 py-1 text-[12.5px] text-ink-2">
      🗓️
      <select
        value={week}
        onChange={(e) => onChange(e.target.value as WeekKey)}
        className="rounded-full bg-transparent py-0.5 pr-2 font-bold text-ink-1 outline-none"
      >
        {WEEKS.map((w) => (
          <option key={w.key} value={w.key}>
            {w.label}
            {w.isPartial ? " (MTD)" : ""}
          </option>
        ))}
      </select>
      {meta.isPartial && (
        <span className="mr-1 rounded-full bg-warn-bg px-2 py-0.5 text-[10.5px] font-bold text-warn-ink">
          Chưa trọn tuần
        </span>
      )}
    </span>
  );
}

export function WeeklyKpiRow({ week }: { week: WeekKey }) {
  const { platform, bu } = useFilters();
  const k = getWeeklyKpis(week, platform, bu);

  const scopeLabel = [platform !== "Tất cả" ? platform : null, bu !== "Tất cả" ? bu : null]
    .filter(Boolean)
    .join(" ");

  if (!k.hasData) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        Tuần {k.weekLabel}: không có dữ liệu cho {scopeLabel || "bộ lọc này"}.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {k.cards.map((c) => (
          <div key={c.key} className="flex min-h-[128px] flex-col justify-between bg-surface p-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">{c.label}</div>
            <div className="tabular text-[20px] font-bold text-ink-1">{formatCardValue(c.key, c.value)}</div>
            <div className="flex flex-col gap-0.5">
              <DeltaTag d={c.wow} label="WoW" />
              <DeltaTag d={c.sameLastMonth} label="So cùng tuần tháng trước" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-ink-3">
        Tuần {k.weekLabel}{scopeLabel ? ` · ${scopeLabel}` : ""}. WoW so với tuần {k.prevWeekLabel ?? "—"};
        &quot;so cùng tuần tháng trước&quot; lùi lại đúng 4 tuần ({k.sameLastMonthLabel ?? "—"}) — là xấp xỉ vì
        tháng không chia hết cho tuần, không phải cùng ngày lịch chính xác.
      </p>
    </>
  );
}

export function WeeklyHighlightPanel({ week }: { week: WeekKey }) {
  const { platform, bu } = useFilters();
  const rows = getWeeklyHighlights(week, platform, bu, HIGHLIGHT_THRESHOLD);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        Không có kênh nào lệch WoW GMV quá ±{HIGHLIGHT_THRESHOLD}% trong tuần này.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const up = (r.wowGmvPct ?? 0) > 0;
        return (
          <li
            key={r.key}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[13px]",
              up ? "bg-good-bg" : "bg-crit-bg"
            )}
          >
            <span className="flex items-center gap-2 font-semibold text-ink-1">
              <AlertTriangle size={14} className={up ? "text-good-ink" : "text-crit-ink"} />
              {r.platform} {r.bu}
            </span>
            <span className={cn("font-bold tabular", up ? "text-good-ink" : "text-crit-ink")}>
              {up ? "+" : ""}
              {formatPercent(r.wowGmvPct!, 1)} WoW GMV
            </span>
            <span className="text-ink-3">{formatVnd(r.gmv)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function WeeklyChannelTable({ week }: { week: WeekKey }) {
  const { platform, bu } = useFilters();
  const rows = getWeeklyChannelRows(week, platform, bu);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        Không có kênh nào khớp bộ lọc trong tuần này.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-3">
            <th className="py-2 pr-3 font-bold">Kênh</th>
            <th className="py-2 pr-3 font-bold">GMV</th>
            <th className="py-2 pr-3 font-bold">WoW</th>
            <th className="py-2 pr-3 font-bold">So cùng tuần tháng trước</th>
            <th className="py-2 pr-3 font-bold">Đơn</th>
            <th className="py-2 pr-3 font-bold">ROAS</th>
            <th className="py-2 pr-3 font-bold">Hoàn thành</th>
            <th className="py-2 font-bold">Refund</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border/60 last:border-0">
              <td className="py-2 pr-3 font-semibold text-ink-1">
                {r.platform} {r.bu}
              </td>
              <td className="py-2 pr-3 tabular">{formatVnd(r.gmv)}</td>
              <td className="py-2 pr-3">
                <DeltaTag d={{ pct: r.wowGmvPct, direction: r.wowGmvPct == null ? null : r.wowGmvPct > 0.5 ? "up" : r.wowGmvPct < -0.5 ? "down" : "flat" }} label="" />
              </td>
              <td className="py-2 pr-3">
                <DeltaTag
                  d={{
                    pct: r.sameLastMonthGmvPct,
                    direction:
                      r.sameLastMonthGmvPct == null ? null : r.sameLastMonthGmvPct > 0.5 ? "up" : r.sameLastMonthGmvPct < -0.5 ? "down" : "flat",
                  }}
                  label=""
                />
              </td>
              <td className="py-2 pr-3 tabular">{r.orders.toLocaleString("vi-VN")}</td>
              <td className="py-2 pr-3 tabular">{r.roas.toFixed(1)}x</td>
              <td className="py-2 pr-3 tabular">
                {r.completionRatePct != null ? formatPercent(r.completionRatePct) : "—"}
              </td>
              <td className="py-2 tabular">{r.refundRatePct != null ? formatPercent(r.refundRatePct) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WeeklyDashboard() {
  const [week, setWeek] = useState<WeekKey>(DEFAULT_WEEK);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-ink-1">Weekly</h1>
          <p className="text-[13px] text-ink-2">
            Theo dõi hiệu quả theo tuần (Thứ 2 → Chủ nhật) — nguồn: 5 sheet chi tiết giao dịch, group
            theo tuần. Đổi <b>Platform/BU</b> ở thanh lọc phía trên; chọn tuần ở đây.
          </p>
        </div>
        <WeekSelector week={week} onChange={setWeek} />
      </div>

      <WeeklyKpiRow week={week} />

      <Card>
        <CardHeader
          title="Kênh cần chú ý (WoW GMV lệch ≥ 15%)"
          kind="Alert list"
          desc="Tự động rà toàn bộ kênh khớp bộ lọc, sort theo mức lệch lớn nhất."
        />
        <WeeklyHighlightPanel week={week} />
      </Card>

      <Card>
        <CardHeader
          title="GMV theo tuần"
          kind="Line chart"
          desc="20 tuần gần nhất (30/03–16/08/2026). Vòng tròn rỗng = tuần chưa trọn 7 ngày."
        />
        <WeeklyTrendChart week={week} />
        <CardFootnote>
          Nguồn: 5 sheet chi tiết giao dịch, group theo Order Time / Time Created / Date của từng
          đơn hàng.
        </CardFootnote>
      </Card>

      <Card>
        <CardHeader
          title="So sánh chi tiết theo kênh"
          kind="Table"
          desc="Tuần đang chọn — WoW & so cùng tuần tháng trước tính trên GMV."
        />
        <WeeklyChannelTable week={week} />
        <CardFootnote>
          Lazada không có cột Order Status/Refund nên Hoàn thành/Refund luôn để trống cho kênh đó,
          giống tab Vận hành. ROAS = GMV ÷ Payout của đúng tuần đang xem, không phải trung bình.
          TikTok Shop PC và Lazada MCC có volume thấp theo tuần nên ROAS/WoW% có thể biến động mạnh
          do độ trễ ghi nhận hoa hồng hoặc chỉ vài đơn — đọc cùng với cột Đơn để tránh hiểu nhầm là
          xu hướng thật.
        </CardFootnote>
      </Card>
    </div>
  );
}
