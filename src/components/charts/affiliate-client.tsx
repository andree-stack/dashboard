"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Minus, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import { usePreferences } from "@/components/preferences-context";
import { WeekPicker } from "@/components/week-picker";
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
  type PeriodMode,
} from "@/lib/affiliate-data";
import { translateMonthLabel } from "@/lib/i18n";
import { platformColor } from "@/lib/data";
import { formatPercent, cn } from "@/lib/utils";

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
  const { t } = usePreferences();
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
        {t("Trang")} {page + 1}/{totalPages}
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
  const { t } = usePreferences();
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-3">{t("Chế độ xem")}</span>
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
              {m === "month" ? t("Theo tháng") : t("Theo tuần")}
            </button>
          ))}
        </div>
      </div>
      {/* Luôn giữ 2 WeekPicker trong layout (chỉ ẩn bằng visibility) để đổi Theo tháng/Theo tuần
          không làm cả hàng filter đổi bề rộng rồi nhảy xuống dòng khác. */}
      <div className={cn("flex gap-2", mode !== "week" && "invisible")} aria-hidden={mode !== "week"}>
        <WeekPicker label={t("Tuần xem")} value={week} onChange={setWeek} />
        <WeekPicker label={t("So sánh với")} value={compareWeek} onChange={setCompareWeek} excludeWeek={week} />
      </div>
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
  const { mode, period, comparePeriod } = useAffiliateCtx();
  const { t, formatMoney } = usePreferences();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const allRows = useMemo(
    () => getCreatorRows(mode, period, comparePeriod, platform, bu),
    [mode, period, comparePeriod, platform, bu]
  );

  const q = search.trim().toLowerCase();
  const rows = q ? allRows.filter((r) => r.name.toLowerCase().includes(q)) : allRows;

  const platformsPresent = useMemo(() => [...new Set(allRows.map((r) => r.platform))], [allRows]);
  const totalPages = Math.ceil(rows.length / CREATOR_PAGE_SIZE) || 1;
  const effectivePage = Math.min(page, totalPages - 1);
  const pageRows = rows.slice(effectivePage * CREATOR_PAGE_SIZE, effectivePage * CREATOR_PAGE_SIZE + CREATOR_PAGE_SIZE);
  const maxGmv = Math.max(...rows.map((r) => r.gmv), 1);

  return (
    <>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        placeholder={t("Tìm creator ID...")}
        className="mb-3 w-full max-w-[240px] rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-ink-1 outline-none focus:border-accent"
      />
      {rows.length === 0 ? (
        <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
          {allRows.length === 0 ? t("Không có creator nào khớp bộ lọc ở kỳ này.") : `${t("Không tìm thấy creator khớp")} "${search}".`}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {pageRows.map((r, i) => {
              const widthPct = Math.max(3, (r.gmv / maxGmv) * 100);
              return (
                <div key={`${r.platform}-${r.name}`} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-4 shrink-0 text-right tabular text-ink-3">{effectivePage * CREATOR_PAGE_SIZE + i + 1}</span>
                  <span className="w-[120px] shrink-0 truncate text-ink-1" title={r.name}>
                    {r.name}
                  </span>
                  <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${widthPct}%`, background: platformColor[r.platform] }}
                    />
                  </div>
                  <span className="w-[62px] shrink-0 text-right tabular font-semibold text-ink-1">{formatMoney(r.gmv)}</span>
                  <span className="w-[58px] shrink-0 text-right">
                    <DeltaTag d={toDelta(r.wowPct)} />
                  </span>
                </div>
              );
            })}
          </div>
          <Pager page={effectivePage} totalPages={totalPages} onChange={setPage} />
        </>
      )}
      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[12px] text-ink-2">
        {platformsPresent.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: platformColor[p] }} />
            {p}
          </span>
        ))}
        <span className="text-ink-3">
          {allRows.length} {t("creator (top 50/kênh đang track)")}
          {q ? ` · ${rows.length} ${t("khớp tìm kiếm")}` : ""}
        </span>
      </div>
    </>
  );
}

function CategoryCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const { t, formatMoney } = usePreferences();
  const rows = getCategoryBreakdown(mode, period, platform, bu);

  if (rows === null) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Category chuẩn hoá (L1/L2/L3) chỉ có ở dữ liệu Shopee.")}</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Không có dữ liệu cho kỳ này.")}</p>;
  }
  return <BuGroupedBar data={rows} height={Math.max(140, rows.length * 44)} valueFormatter={formatMoney} />;
}

function CampaignCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const { t, formatMoney } = usePreferences();
  const rows = getCampaignBreakdown(mode, period, platform, bu);

  if (rows === null) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Campaign Type (Mở rộng/Mục tiêu) chỉ có ở dữ liệu Shopee.")}</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Không có dữ liệu cho kỳ này.")}</p>;
  }
  return <BuGroupedBar data={rows} height={Math.max(100, rows.length * 44)} valueFormatter={formatMoney} />;
}

function GmvSourceCard() {
  const { platform, bu } = useFilters();
  const { mode, period } = useAffiliateCtx();
  const { t, formatMoney } = usePreferences();
  const rows = getGmvSourceBreakdown(mode, period, platform, bu);

  if (rows === null) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Cột GMV Source (Seller/Affiliate/MCN) chỉ có ở dữ liệu TikTok Shop.")}</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Không có dữ liệu cho kỳ này.")}</p>;
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
    return <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">{t("Không có dữ liệu cho kỳ này.")}</p>;
  }

  return (
    <>
      <StackedPercentBar data={stackedData} keys={rows.map((r) => r.label)} />
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-3">
        {busShown.map((b) => (
          <span key={b}>
            {b}: {formatMoney(buTotals[b])}
          </span>
        ))}
      </div>
    </>
  );
}

type SortKey = "orders" | "gmv" | "payout" | "isNew";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (k: SortKey) => void;
}) {
  const active = sort?.key === sortKey;
  return (
    <th className="py-2 pr-3 font-bold">
      <button
        onClick={() => onSort(sortKey)}
        className={cn("inline-flex items-center gap-0.5", active ? "text-accent-ink" : "text-ink-3")}
      >
        {label}
        {active ? (
          sort!.dir === "asc" ? (
            <ArrowUp size={11} />
          ) : (
            <ArrowDown size={11} />
          )
        ) : (
          <Minus size={11} className="opacity-30" />
        )}
      </button>
    </th>
  );
}

function CreatorDetailTable() {
  const { platform, bu } = useFilters();
  const { mode, period, comparePeriod } = useAffiliateCtx();
  const { t, formatMoney } = usePreferences();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const allRows = useMemo(
    () => getCreatorRows(mode, period, comparePeriod, platform, bu),
    [mode, period, comparePeriod, platform, bu]
  );

  const q = search.trim().toLowerCase();
  const filtered = q ? allRows.filter((r) => r.name.toLowerCase().includes(q)) : allRows;

  const rows = useMemo(() => {
    if (!sort) return filtered;
    const dirMul = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sort.key === "isNew" ? (a.isNew ? 1 : 0) : a[sort.key];
      const bv = sort.key === "isNew" ? (b.isNew ? 1 : 0) : b[sort.key];
      return (av - bv) * dirMul;
    });
  }, [filtered, sort]);

  function handleSort(key: SortKey) {
    setPage(0);
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  const newCount = allRows.filter((r) => r.isNew).length;

  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(rows.length / PAGE_SIZE) || 1;
  const effectivePage = Math.min(page, totalPages - 1);
  const pageRows = rows.slice(effectivePage * PAGE_SIZE, effectivePage * PAGE_SIZE + PAGE_SIZE);

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder={t("Tìm creator ID...")}
          className="w-full max-w-[240px] rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] text-ink-1 outline-none focus:border-accent"
        />
        <span className="text-[12px] text-ink-2">
          {allRows.length} {t("creator")}{q ? ` · ${rows.length} ${t("khớp tìm kiếm")}` : ""} ·{" "}
          <span className="font-semibold text-good-ink">{newCount} {t("Mới")}</span>
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
          {allRows.length === 0 ? t("Không có creator nào khớp bộ lọc ở kỳ này.") : `${t("Không tìm thấy creator khớp")} "${search}".`}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-3">
                  <th className="py-2 pr-3 font-bold">{t("Creator")}</th>
                  <th className="py-2 pr-3 font-bold">{t("Kênh")}</th>
                  <SortableHeader label={t("Đơn")} sortKey="orders" sort={sort} onSort={handleSort} />
                  <SortableHeader label={t("GMV")} sortKey="gmv" sort={sort} onSort={handleSort} />
                  <SortableHeader label={t("Payout")} sortKey="payout" sort={sort} onSort={handleSort} />
                  <th className="py-2 pr-3 font-bold">{t("ROAS")}</th>
                  <th className="py-2 pr-3 font-bold">{t("So sánh GMV")}</th>
                  <SortableHeader label={t("Mới?")} sortKey="isNew" sort={sort} onSort={handleSort} />
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
                    <td className="py-2 pr-3 tabular font-semibold">{formatMoney(r.gmv)}</td>
                    <td className="py-2 pr-3 tabular">{formatMoney(r.payout)}</td>
                    <td className="py-2 pr-3 tabular">{r.roas.toFixed(1)}x</td>
                    <td className="py-2 pr-3">
                      <DeltaTag d={toDelta(r.wowPct)} />
                    </td>
                    <td className="py-2">
                      {r.isNew ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-good-bg px-2 py-0.5 text-[11px] font-bold text-good-ink">
                          <BadgeCheck size={12} /> {t("Mới")}
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
      )}
    </>
  );
}

export function AffiliateDashboard() {
  const ctxValue = usePeriodMode();
  const { t, lang } = usePreferences();
  const period = ctxValue.period;
  const comparePeriod = ctxValue.comparePeriod;
  const periodLabel = translateMonthLabel(getPeriodLabel(ctxValue.mode, period), lang);
  const compareLabel = comparePeriod ? translateMonthLabel(getPeriodLabel(ctxValue.mode, comparePeriod), lang) : null;

  return (
    <AffiliateCtx.Provider value={ctxValue}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-ink-1">{t("Affiliate & Creator")}</h1>
            <p className="text-[13px] text-ink-2">
              {t("Hiệu suất creator/affiliate")} — {t("nguồn: 5 sheet chi tiết (Shopee, Lazada, TikTok Shop × PC/MCC).")}{" "}
              {t("Đổi")} <b>Platform/BU</b> {t("ở thanh lọc phía trên; chọn kỳ báo cáo ở đây.")}
            </p>
          </div>
          <PeriodModeBar />
        </div>

        <Card>
          <CardHeader
            title={t("Top Creator / Affiliate theo GMV")}
            kind={t("Bar ngang")}
            desc={`${t("Top 10 mỗi trang —")} ${periodLabel}${t(", tô màu theo platform.")}`}
          />
          <TopCreatorsCard />
          <CardFootnote>
            {t("Nguồn: group theo Affiliate Username (Shopee) / Creator Username (TikTok Shop). Lazada không có dữ liệu creator ở cấp giao dịch.")}
          </CardFootnote>
        </Card>

        <div className="grid items-start gap-4 md:grid-cols-2">
          <Card>
            <CardHeader title={t("GMV theo Category sản phẩm")} kind={t("Grouped bar")} desc={`${t("Shopee — cột L1 Global Category,")} ${periodLabel}.`} />
            <CategoryCard />
            <CardFootnote>{t("Nguồn: VN Shopee PC'26 + MCC'26.")}</CardFootnote>
          </Card>
          <Card>
            <CardHeader title={t("GMV theo Loại chiến dịch")} kind={t("Grouped bar")} desc={`${t("Shopee — Mở rộng vs. Mục tiêu,")} ${periodLabel}.`} />
            <CampaignCard />
            <CardFootnote>{t("Nguồn: VN Shopee PC'26 + MCC'26 — cột Campaign Type.")}</CardFootnote>
          </Card>
        </div>

        <Card>
          <CardHeader
            title={t("GMV theo nguồn Creator (GMV Source)")}
            kind={t("Stacked bar 100%")}
            desc={`${t("TikTok Shop — Seller Creator / Affiliate Creator / MCN,")} ${periodLabel}.`}
          />
          <GmvSourceCard />
          <CardFootnote>{t("Nguồn: (Updated) VN TTS PC'26 + MCC'26 — cột GMV Source.")}</CardFootnote>
        </Card>

        <Card>
          <CardHeader
            title={t("Chi tiết Creator")}
            kind={t("Bảng")}
            desc={`${periodLabel}${compareLabel ? `${t(" · So sánh với ")}${compareLabel}` : ""}${t(" — Shopee + TikTok Shop.")}`}
          />
          <CreatorDetailTable />
          <CardFootnote>
            {t("ROAS = GMV ÷ Payout của đúng kỳ đang xem. \"Mới\" = creator chưa từng có doanh thu ở bất kỳ kỳ nào trước đó (trong phạm vi top-50/kênh đang track).")}
          </CardFootnote>
        </Card>
      </div>
    </AffiliateCtx.Provider>
  );
}
