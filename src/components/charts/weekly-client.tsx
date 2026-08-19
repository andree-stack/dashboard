"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Minus, AlertTriangle, ChevronDown } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import {
  WEEKS,
  DEFAULT_WEEK,
  getWeeklyKpis,
  getWeeklyChannelRows,
  getWeeklyHighlights,
  shiftWeek,
  type WeekKey,
  type Delta,
} from "@/lib/weekly-data";
import { formatVnd, formatPercent, cn } from "@/lib/utils";
import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import { WeeklyTrendChart } from "@/components/charts/weekly-trend-chart";

const HIGHLIGHT_THRESHOLD = 15;
/** Số dòng hiện sẵn không cần scroll trong picker tuần (~36px/dòng). */
const PICKER_VISIBLE_ROWS = 5;
const PICKER_ROW_HEIGHT = 36;

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

/** Bọc 1 con số % đã tính sẵn (vd wowGmvPct) thành Delta để tái dùng DeltaTag. */
function toDelta(pct: number | null): Delta {
  if (pct == null) return { pct: null, direction: null };
  return { pct, direction: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat" };
}

function formatCardValue(key: string, value: number | null): string {
  if (value == null) return "—";
  if (key === "orders") return value.toLocaleString("vi-VN");
  return formatVnd(value);
}

/** Dropdown chọn tuần dạng tuỳ biến — chỉ hiện ~5 tuần gần nhất, scroll để thấy các tuần xa hơn. */
function WeekPicker({
  label,
  value,
  onChange,
  excludeWeek,
}: {
  label: string;
  value: WeekKey | null;
  onChange: (w: WeekKey) => void;
  excludeWeek?: WeekKey | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const options = [...WEEKS].reverse().filter((w) => w.key !== excludeWeek);
  const selected = WEEKS.find((w) => w.key === value) ?? null;

  return (
    <div className="relative" ref={ref}>
      <span className="mb-1 block text-[10.5px] font-bold uppercase tracking-wide text-ink-3">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] font-bold text-ink-1"
      >
        🗓️ {selected ? selected.label : "—"}
        {selected?.isPartial && (
          <span className="rounded-full bg-warn-bg px-1.5 py-0.5 text-[10px] font-bold text-warn-ink">MTD</span>
        )}
        <ChevronDown size={14} className="text-ink-3" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          <div className="overflow-y-auto py-1" style={{ maxHeight: PICKER_VISIBLE_ROWS * PICKER_ROW_HEIGHT }}>
            {options.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => {
                  onChange(w.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] hover:bg-surface-alt",
                  w.key === value ? "bg-accent-soft font-bold text-accent-ink" : "text-ink-1"
                )}
                style={{ height: PICKER_ROW_HEIGHT }}
              >
                {w.label}
                {w.isPartial && <span className="text-[10px] text-warn-ink">MTD</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function WeeklyKpiRow({ week, compareWeek }: { week: WeekKey; compareWeek: WeekKey | null }) {
  const { platform, bu } = useFilters();
  const k = getWeeklyKpis(week, platform, bu, compareWeek);

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
              <DeltaTag d={c.wow} label="So sánh" />
              <DeltaTag d={c.sameLastMonth} label="So cùng tuần tháng trước" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] text-ink-3">
        Tuần {k.weekLabel}
        {scopeLabel ? ` · ${scopeLabel}` : ""}. &quot;So sánh&quot; đối chiếu với tuần bạn chọn ở ô{" "}
        <b>So sánh với</b> ({k.compareWeekLabel ?? "chưa chọn"}); &quot;so cùng tuần tháng trước&quot; luôn tự
        động lùi lại đúng 4 tuần ({k.sameLastMonthLabel ?? "—"}) — là xấp xỉ vì tháng không chia hết cho
        tuần, không phải cùng ngày lịch chính xác.
      </p>
    </>
  );
}

export function WeeklyHighlightPanel({ week, compareWeek }: { week: WeekKey; compareWeek: WeekKey | null }) {
  const { platform, bu } = useFilters();
  const rows = getWeeklyHighlights(week, platform, bu, compareWeek, HIGHLIGHT_THRESHOLD);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        Không có kênh nào lệch quá ±{HIGHLIGHT_THRESHOLD}% GMV so với tuần đang so sánh.
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
              {formatPercent(r.wowGmvPct!, 1)} GMV
            </span>
            <span className="text-ink-3">{r.gmv != null ? formatVnd(r.gmv) : "—"}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function WeeklyChannelTable({ week, compareWeek }: { week: WeekKey; compareWeek: WeekKey | null }) {
  const { platform, bu } = useFilters();
  const rows = getWeeklyChannelRows(week, platform, bu, compareWeek);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        Không có kênh nào khớp bộ lọc.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-3">
            <th className="py-2 pr-3 font-bold">Kênh</th>
            <th className="py-2 pr-3 font-bold">GMV</th>
            <th className="py-2 pr-3 font-bold">So sánh</th>
            <th className="py-2 pr-3 font-bold">So cùng tuần th. trước</th>
            <th className="py-2 pr-3 font-bold">Đơn</th>
            <th className="py-2 pr-3 font-bold">So sánh</th>
            <th className="py-2 pr-3 font-bold">So cùng tuần th. trước</th>
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
              <td className="py-2 pr-3 tabular">{r.gmv != null ? formatVnd(r.gmv) : "—"}</td>
              <td className="py-2 pr-3">
                <DeltaTag d={toDelta(r.wowGmvPct)} />
              </td>
              <td className="py-2 pr-3">
                <DeltaTag d={toDelta(r.sameLastMonthGmvPct)} />
              </td>
              <td className="py-2 pr-3 tabular">{r.orders != null ? r.orders.toLocaleString("vi-VN") : "—"}</td>
              <td className="py-2 pr-3">
                <DeltaTag d={toDelta(r.wowOrdersPct)} />
              </td>
              <td className="py-2 pr-3">
                <DeltaTag d={toDelta(r.sameLastMonthOrdersPct)} />
              </td>
              <td className="py-2 pr-3 tabular">{r.roas != null ? `${r.roas.toFixed(1)}x` : "—"}</td>
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
  const [week, setWeekState] = useState<WeekKey>(DEFAULT_WEEK);
  const [compareWeek, setCompareWeek] = useState<WeekKey | null>(shiftWeek(DEFAULT_WEEK, 1));

  function setWeek(w: WeekKey) {
    setWeekState(w);
    // Mặc định đổi luôn tuần so sánh sang tuần liền trước của tuần mới chọn; người dùng vẫn có
    // thể tự đổi lại ô "So sánh với" sau đó.
    setCompareWeek(shiftWeek(w, 1));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-ink-1">Weekly</h1>
          <p className="text-[13px] text-ink-2">
            Theo dõi hiệu quả theo tuần (Thứ 2 → Chủ nhật) — nguồn: 5 sheet chi tiết giao dịch, group
            theo tuần. Đổi <b>Platform/BU</b> ở thanh lọc phía trên; chọn tuần xem &amp; tuần so sánh ở
            đây.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <WeekPicker label="Tuần xem" value={week} onChange={setWeek} />
          <WeekPicker label="So sánh với" value={compareWeek} onChange={setCompareWeek} excludeWeek={week} />
        </div>
      </div>

      <WeeklyKpiRow week={week} compareWeek={compareWeek} />

      <Card>
        <CardHeader
          title="Kênh cần chú ý (GMV lệch ≥ 15% so với tuần so sánh)"
          kind="Alert list"
          desc="Tự động rà toàn bộ kênh khớp bộ lọc, sort theo mức lệch lớn nhất."
        />
        <WeeklyHighlightPanel week={week} compareWeek={compareWeek} />
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
          desc="Luôn hiện đủ 6 tổ hợp Platform × BU khớp bộ lọc — kênh chưa có dữ liệu tuần này hiện “—”."
        />
        <WeeklyChannelTable week={week} compareWeek={compareWeek} />
        <CardFootnote>
          Lazada không có cột Order Status/Refund nên Hoàn thành/Refund luôn để trống cho kênh đó,
          giống tab Vận hành; Lazada PC hiện chưa vận hành nên luôn “—”. ROAS = GMV ÷ Payout của
          đúng tuần đang xem, không phải trung bình. TikTok Shop PC và Lazada MCC có volume thấp
          theo tuần nên ROAS/% so sánh có thể biến động mạnh do độ trễ ghi nhận hoa hồng hoặc chỉ
          vài đơn — đọc cùng với cột Đơn để tránh hiểu nhầm là xu hướng thật.
        </CardFootnote>
      </Card>
    </div>
  );
}
