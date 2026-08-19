"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Minus, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import { WeekPicker } from "@/components/week-picker";
import { BarList } from "@/components/charts/bar-list";
import { BuGroupedBar } from "@/components/charts/bu-grouped-bar";
import { StackedPercentBar } from "@/components/charts/stacked-percent-bar";
import { Card, CardHeader, CardFootnote } from "@/components/ui/card";
import {
  getPreviousPeriod,
  getPeriodLabel,
  getCreatorRows,
  getCategoryBreakdown,
  getCampaignBreakdown,
  getGmvSourceBreakdown,
  getOrderStatusBreakdown,
  type PeriodMode,
} from "@/lib/affiliate-data";
import { platformColor } from "@/lib/data";
import { formatVnd, formatPercent, cn } from "@/lib/utils";

const CREATOR_PAGE_SIZE = 10;

type Delta = { pct: number | null; direction: "up" | "down" | "flat" | null };
function toDelta(pct: number | null): Delta {
  if (pct == null) return { pct: null, direction: null };
  return { pct, direction: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat" };
}

function DeltaTag({ d }: { d: Delta }) {
  if (d.pct == null) return <span className="text-[11px] text-ink-3">—</span>;
  const Icon = d.direction === "up" ? ArrowUp : d.direction === "down" ? ArrowDown : Minus;
  const tone = d.direction === "up" ? "text-good-ink" : d.direction === "down" ? "text-crit-ink" : "text-ink-3";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-semibold", tone)}>
      <Icon size={11} />
      {d.pct >= 0 ? "+" : ""}
      {formatPercent(d.pct, 1)}
    </span>
  );
}

function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-2.5 flex items-center justify-end gap-2 text-[12px] text-ink-2">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        className="rounded-md border border-border p-1 disabled:opacity-30"
      >
        <ChevronLeft size={14} />
      </button>
      <span>
        Trang {page + 1}/{totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page === totalPages - 1}
        className="rounded-md border border-border p-1 disabled:opacity-30"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/** Toggle Theo tháng / Theo tuần — dùng chung state month/week/compareWeek đã có trong FilterContext. */
function usePeriodMode() {
  const [mode, setMode] = useState<PeriodMode>("month");
  const { month, week, compareWeek, setWeek, setCompareWeek } = useFilters();

  const period = mode === "month" ? month : week;
  const comparePeriod = mode === "month" ? getPreviousPeriod("month", month) : compareWeek;

  return { mode, setMode, period, comparePeriod, week, compareWeek, setWeek, setCompareWeek };
}

function PeriodModeBar() {
  const { mode, setMode, week, compareWeek, setWeek, setCompareWeek } = useAffiliateCtx();
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-3">Chế độ xem</span>
        <div className="flex overflow-hidden rounded-full border border-border">
          {(["month", "week"] as PeriodMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "h-9 px-3.5 text-[12.5px] font-semibold",
                mode === m ? "bg-accent-soft text-accent-ink" : "bg-surface text-ink-2"
              )}
            >
              {m === "month" ? "Theo tháng" : "Theo tuần"}
            </button>
          ))}
        </div>
      </div>
      {mode === "week" && (
        <>
          <WeekPicker label="Tuần xem" value={week} onChange={setWeek} />
          <WeekPicker label="So sánh với" value={compareWeek} onChange={setCompareWeek} excludeWeek={week} />
        </>
      )}
    </div>
  );
}

// Share the period-mode state across all sections on the page via a tiny local context.
type AffiliateCtxType = ReturnType<typeof usePeriodMode>;
const AffiliateCtx = createContext<AffiliateCtxType | null>(null);
function useAffiliateCtx() {
  const ctx = useContext(AffiliateCtx);
  if (!ctx) throw new Error("useAffiliateCtx must be used within AffiliateDashboard");
  return ctx;
}

function TopCreatorsCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const [page, setPage] = useState(0);
  const rows = useMemo(() => getCreatorRows(mode, period, null, platform, bu), [mode, period, platform, bu]);

  const platformsPresent = useMemo(() => [...new Set(rows.map((r) => r.platform))], [rows]);
  const totalPages = Math.ceil(rows.length / CREATOR_PAGE_SIZE) || 1;
  const effectivePage = Math.min(page, totalPages - 1);
  const pageRows = rows.slice(effectivePage * CREATOR_PAGE_SIZE, effectivePage * CREATOR_PAGE_SIZE + CREATOR_PAGE_SIZE);
  const maxGmv = Math.max(...rows.map((r) => r.gmv), 1);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        Không có creator nào khớp bộ lọc ở kỳ này.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {pageRows.map((r, i) => {
          const widthPct = Math.max(3, (r.gmv / maxGmv) * 100);
          return (
            <div key={`${r.platform}-${r.name}`} className="flex items-center gap-2 text-[12.5px]">
              <span className="w-4 shrink-0 text-right tabular text-ink-3">{effectivePage * CREATOR_PAGE_SIZE + i + 1}</span>
              <span className="w-[140px] shrink-0 truncate text-ink-1" title={r.name}>
                {r.name}
              </span>
              <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${widthPct}%`, background: platformColor[r.platform] }}
                />
              </div>
              <span className="w-[64px] shrink-0 text-right tabular font-semibold text-ink-1">{formatVnd(r.gmv)}</span>
            </div>
          );
        })}
      </div>
      <Pager page={effectivePage} totalPages={totalPages} onChange={setPage} />
      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[12px] text-ink-2">
        {platformsPresent.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: platformColor[p] }} />
            {p}
          </span>
        ))}
        <span className="text-ink-3">{rows.length} creator (top 50/kênh đang track)</span>
      </div>
    </>
  );
}

function CategoryCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const rows = getCategoryBreakdown(mode, period, platform, bu);

  if (rows === null) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Category chuẩn hoá (L1/L2/L3) chỉ có ở dữ liệu Shopee.</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Không có dữ liệu cho kỳ này.</p>;
  }
  return <BuGroupedBar data={rows} height={Math.max(140, rows.length * 44)} />;
}

function CampaignCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const rows = getCampaignBreakdown(mode, period, platform, bu);

  if (rows === null) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Campaign Type (Mở rộng/Mục tiêu) chỉ có ở dữ liệu Shopee.</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Không có dữ liệu cho kỳ này.</p>;
  }
  return <BuGroupedBar data={rows} height={Math.max(100, rows.length * 44)} />;
}

function GmvSourceCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const rows = getGmvSourceBreakdown(mode, period, platform, bu);

  if (rows === null) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Cột GMV Source (Seller/Affiliate/MCN) chỉ có ở dữ liệu TikTok Shop.</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Không có dữ liệu cho kỳ này.</p>;
  }

  const buTotals: Record<string, number> = { PC: 0, MCC: 0 };
  rows.forEach((r) => {
    buTotals.PC += r.PC;
    buTotals.MCC += r.MCC;
  });
  const busShown = (["PC", "MCC"] as const).filter((b) => bu === "Tất cả" || bu === b);
  const stackedData = busShown
    .filter((b) => buTotals[b] > 0)
    .map((b) => {
      const entry: Record<string, number | string> = { bu: b };
      rows.forEach((r) => (entry[r.label] = b === "PC" ? r.PC : r.MCC));
      return entry;
    });

  if (stackedData.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Không có dữ liệu cho kỳ này.</p>;
  }

  return (
    <>
      <StackedPercentBar data={stackedData} keys={rows.map((r) => r.label)} />
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-3">
        {busShown.map((b) => (
          <span key={b}>
            {b}: {formatVnd(buTotals[b])}
          </span>
        ))}
      </div>
    </>
  );
}

function OrderStatusCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const breakdowns = getOrderStatusBreakdown(mode, period, platform, bu);

  if (breakdowns.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">Lazada không có cột Order Status trong sheet nguồn.</p>;
  }

  return (
    <div className={cn("grid gap-4", breakdowns.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1")}>
      {breakdowns.map((b) => {
        const total = b.rows.reduce((s, r) => s + r.gmv, 0);
        const realTotal = b.rows.filter((r) => r.real).reduce((s, r) => s + r.gmv, 0);
        return (
          <div key={b.platform} className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[12.5px] font-bold text-ink-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: platformColor[b.platform] }} />
              {b.platform}
            </div>
            {b.hasData ? (
              <>
                <BarList
                  height={Math.max(90, b.rows.length * 30)}
                  data={b.rows.map((r) => ({
                    name: `${r.status} · ${formatPercent((r.gmv / total) * 100, 0)}`,
                    value: r.gmv,
                    color: r.real ? "var(--color-good)" : "var(--color-crit)",
                  }))}
                />
                <p className="mt-2 inline-block rounded-md bg-accent-soft px-2 py-1 text-[11px] text-accent-ink">
                  GMV thật: {formatPercent((realTotal / total) * 100, 0)}
                </p>
              </>
            ) : (
              <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12px] text-ink-3">Không có dữ liệu cho kỳ này.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CreatorDetailTable() {
  const { platform, bu } = useFilters();
  const { mode, period, comparePeriod } = useAffiliateCtx();
  const [page, setPage] = useState(0);
  const rows = useMemo(
    () => getCreatorRows(mode, period, comparePeriod, platform, bu),
    [mode, period, comparePeriod, platform, bu]
  );

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(rows.length / PAGE_SIZE) || 1;
  const effectivePage = Math.min(page, totalPages - 1);
  const pageRows = rows.slice(effectivePage * PAGE_SIZE, effectivePage * PAGE_SIZE + PAGE_SIZE);

  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">Không có creator nào khớp bộ lọc ở kỳ này.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-3">
              <th className="py-2 pr-3 font-bold">Creator</th>
              <th className="py-2 pr-3 font-bold">Kênh</th>
              <th className="py-2 pr-3 font-bold">Đơn</th>
              <th className="py-2 pr-3 font-bold">GMV</th>
              <th className="py-2 pr-3 font-bold">Payout</th>
              <th className="py-2 pr-3 font-bold">ROAS</th>
              <th className="py-2 pr-3 font-bold">So sánh</th>
              <th className="py-2 font-bold">Mới?</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={`${r.platform}-${r.name}`} className="border-b border-border/60 last:border-0">
                <td className="max-w-[220px] truncate py-2 pr-3 font-semibold text-ink-1" title={r.name}>
                  {r.name}
                </td>
                <td className="py-2 pr-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: platformColor[r.platform] }} />
                    {r.platform}
                  </span>
                </td>
                <td className="py-2 pr-3 tabular">{r.orders.toLocaleString("vi-VN")}</td>
                <td className="py-2 pr-3 tabular font-semibold">{formatVnd(r.gmv)}</td>
                <td className="py-2 pr-3 tabular">{formatVnd(r.payout)}</td>
                <td className="py-2 pr-3 tabular">{r.roas.toFixed(1)}x</td>
                <td className="py-2 pr-3">
                  <DeltaTag d={toDelta(r.wowPct)} />
                </td>
                <td className="py-2">
                  {r.isNew ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-good-bg px-2 py-0.5 text-[11px] font-bold text-good-ink">
                      <BadgeCheck size={12} /> Mới
                    </span>
                  ) : (
                    <span className="text-ink-3">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={effectivePage} totalPages={totalPages} onChange={setPage} />
    </>
  );
}

export function AffiliateDashboard() {
  const ctxValue = usePeriodMode();
  const period = ctxValue.period;
  const comparePeriod = ctxValue.comparePeriod;
  const periodLabel = getPeriodLabel(ctxValue.mode, period);
  const compareLabel = comparePeriod ? getPeriodLabel(ctxValue.mode, comparePeriod) : null;

  return (
    <AffiliateCtx.Provider value={ctxValue}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-ink-1">Affiliate &amp; Creator</h1>
            <p className="text-[13px] text-ink-2">
              Hiệu suất creator/affiliate — nguồn: 5 sheet chi tiết (Shopee, Lazada, TikTok Shop ×
              PC/MCC). Đổi <b>Platform/BU</b> ở thanh lọc phía trên; chọn kỳ báo cáo ở đây.
            </p>
          </div>
          <PeriodModeBar />
        </div>

        <Card>
          <CardHeader
            title="Top Creator / Affiliate theo GMV"
            kind="Bar ngang"
            desc={`Top 10 mỗi trang — ${periodLabel}, tô màu theo platform.`}
          />
          <TopCreatorsCard />
          <CardFootnote>
            Nguồn: group theo Affiliate Name (Shopee) / Creator Username (TikTok Shop). Lazada
            không có dữ liệu creator ở cấp giao dịch.
          </CardFootnote>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader title="GMV theo Category sản phẩm" kind="Grouped bar" desc={`Shopee — cột L1 Global Category, ${periodLabel}.`} />
            <CategoryCard />
            <CardFootnote>Nguồn: VN Shopee PC&apos;26 + MCC&apos;26.</CardFootnote>
          </Card>
          <Card>
            <CardHeader title="GMV theo Loại chiến dịch" kind="Grouped bar" desc={`Shopee — Mở rộng vs. Mục tiêu, ${periodLabel}.`} />
            <CampaignCard />
            <CardFootnote>Nguồn: VN Shopee PC&apos;26 + MCC&apos;26 — cột Campaign Type.</CardFootnote>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="GMV theo nguồn Creator (GMV Source)"
            kind="Stacked bar 100%"
            desc={`TikTok Shop — Seller Creator / Affiliate Creator / MCN, ${periodLabel}.`}
          />
          <GmvSourceCard />
          <CardFootnote>Nguồn: (Updated) VN TTS PC&apos;26 + MCC&apos;26 — cột GMV Source.</CardFootnote>
        </Card>

        <Card>
          <CardHeader title="Phễu trạng thái đơn hàng" kind="Bar xếp hạng" desc={`Shopee + TikTok Shop, ${periodLabel} — mỗi platform 1 bộ trạng thái riêng.`} />
          <OrderStatusCard />
          <CardFootnote>
            Lazada không có cột Order Status nên không hiện ở đây. Shopee: GMV thật = đơn &quot;Hoàn
            thành&quot;. TikTok Shop: GMV thật = Settled + Completed.
          </CardFootnote>
        </Card>

        <Card>
          <CardHeader
            title="Chi tiết Creator"
            kind="Table"
            desc={`${periodLabel}${compareLabel ? ` · So sánh với ${compareLabel}` : ""} — Shopee + TikTok Shop.`}
          />
          <CreatorDetailTable />
          <CardFootnote>
            ROAS = GMV ÷ Payout của đúng kỳ đang xem. &quot;Mới&quot; = creator chưa từng có doanh
            thu ở bất kỳ kỳ nào trước đó (trong phạm vi top-50/kênh đang track).
          </CardFootnote>
        </Card>
      </div>
    </AffiliateCtx.Provider>
  );
}
