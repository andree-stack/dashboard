"use client";

import { ArrowUp, ArrowDown, Minus, AlertTriangle } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import {
  getWeeklyKpis,
  getWeeklyChannelRows,
  getWeeklyHighlights,
  type WeekKey,
  type Delta,
} from "@/lib/weekly-data";
import { getWeeklyContentBreakdown, type ContentDetailItem } from "@/lib/weekly-content-data";
import { platformColor } from "@/lib/data";
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

function ContentBreakdownRow({
  item,
  maxGmv,
  color,
  deltaPct,
  compareDetail,
}: {
  item: ReturnType<typeof getWeeklyContentBreakdown>[number]["items"][number];
  maxGmv: number;
  color: string;
  deltaPct: number | null;
  compareDetail?: ContentDetailItem[];
}) {
  const widthPct = maxGmv > 0 ? Math.max(3, (item.gmv / maxGmv) * 100) : 0;

  return (
    <div className={cn("relative flex items-center gap-2 text-[11.5px]", item.detail && "group")}>
      <span className="w-[78px] shrink-0 truncate text-ink-2" title={item.label}>
        {item.label}
      </span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
        <div className="h-full rounded-full" style={{ width: `${widthPct}%`, background: color }} />
      </div>
      <span className="w-[58px] shrink-0 text-right tabular font-semibold text-ink-1">{formatVnd(item.gmv)}</span>
      <span className="w-[54px] shrink-0 text-right">
        <DeltaTag d={toDelta(deltaPct)} />
      </span>

      {item.detail && (
        <div className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-72 rounded-lg border border-border bg-surface p-2.5 text-[11px] shadow-lg group-hover:block">
          <div className="mb-1.5 font-bold text-ink-1">Chi tiết &quot;Khác&quot;</div>
          <ul className="max-h-40 space-y-0.5 overflow-y-auto">
            {item.detail.map((d) => {
              const cmpD = compareDetail?.find((c) => c.label === d.label);
              const dPct = cmpD && cmpD.gmv > 0 ? ((d.gmv - cmpD.gmv) / cmpD.gmv) * 100 : null;
              return (
                <li key={d.label} className="flex items-center justify-between gap-2">
                  <span className="truncate text-ink-2">{d.label}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="tabular text-ink-1">{formatVnd(d.gmv)}</span>
                    <DeltaTag d={toDelta(dPct)} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function WeeklyContentBreakdownSection({ week, compareWeek }: { week: WeekKey; compareWeek: WeekKey | null }) {
  const { platform, bu } = useFilters();
  const breakdowns = getWeeklyContentBreakdown(week, platform, bu);
  const compareBreakdowns = compareWeek ? getWeeklyContentBreakdown(compareWeek, platform, bu) : [];

  if (breakdowns.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        Lazada không có cột Content Type/Channel trong sheet nguồn.
      </p>
    );
  }

  return (
    <div className={cn("grid gap-4", breakdowns.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1")}>
      {breakdowns.map((b) => {
        const cmpItems = compareBreakdowns.find((c) => c.platform === b.platform)?.items ?? [];
        const maxGmv = Math.max(...b.items.map((it) => it.gmv), 1);
        return (
          <div key={b.platform} className="rounded-lg border border-border p-3">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink-1">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: platformColor[b.platform] }}
                />
                {b.platform}
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">
                {b.dimensionLabel}
              </span>
            </div>
            {b.hasData ? (
              <div className="space-y-2">
                {b.items.map((it) => {
                  const cmp = cmpItems.find((c) => c.label === it.label);
                  const deltaPct = cmp && cmp.gmv > 0 ? ((it.gmv - cmp.gmv) / cmp.gmv) * 100 : null;
                  return (
                    <ContentBreakdownRow
                      key={it.label}
                      item={it}
                      maxGmv={maxGmv}
                      color={platformColor[b.platform]}
                      deltaPct={deltaPct}
                      compareDetail={cmp?.detail}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12px] text-ink-3">
                Không có dữ liệu cho tuần này.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WeeklyDashboard() {
  const { week, compareWeek } = useFilters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">Weekly</h1>
        <p className="text-[13px] text-ink-2">
          Theo dõi hiệu quả theo tuần (Thứ 2 → Chủ nhật) — nguồn: 5 sheet chi tiết giao dịch, group
          theo tuần. Đổi <b>Platform/BU</b>, <b>Tuần xem</b> và <b>So sánh với</b> ở thanh lọc phía
          trên.
        </p>
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
          title="GMV theo Content Type / Kênh traffic"
          kind="Bar list"
          desc="Tuần đang xem, so với tuần ở ô So sánh với. Shopee: Kênh traffic (Facebook/Websites/Shopee Video/Shopee Live/Khác). TikTok Shop: Content Type (Video/External Traffic/Showcase/Livestream/Khác)."
        />
        <WeeklyContentBreakdownSection week={week} compareWeek={compareWeek} />
        <CardFootnote>
          Lazada không có cột tương đương trong sheet nguồn nên không hiện ở đây. Shopee gộp ~20
          giá trị Channel gốc về 4 nhóm chính + &quot;Khác&quot; để nhất quán qua các tuần — di
          chuột vào &quot;Khác&quot; để xem chi tiết từng kênh gốc bên trong.
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
