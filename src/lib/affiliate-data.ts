// Affiliate & Creator tab — logic layer over affiliate-raw-data.ts (extracted from the same 5
// detail sheets as data.ts/weekly-data.ts, grouped by creator + Tháng and creator + Tuần).
// Creator-level tables are capped to the top 50 (by all-time cumulative GMV) per Platform × BU —
// long-tail creators outside that set aren't tracked individually here (they still count correctly
// in every other tab's totals, which aren't creator-level). Lazada has no creator/category/order
// status columns in its sheet, so it never appears in this file's output.
import { MONTHS, PLATFORMS, type BU, type BuFilter, type MonthKey, type Platform, type PlatformFilter } from "./data";
import { WEEKS, type WeekKey } from "./weekly-data";
import {
  creatorMonthRaw,
  creatorWeekRaw,
  categoryMonthRaw,
  categoryWeekRaw,
  campaignMonthRaw,
  campaignWeekRaw,
  statusMonthRaw,
  statusWeekRaw,
  gsourceMonthRaw,
  gsourceWeekRaw,
  type CreatorEntry,
} from "./affiliate-raw-data";

export type PeriodMode = "month" | "week";

/** Tháng có dữ liệu creator/category/order-status (chỉ T4–T8, khớp phạm vi 5 sheet chi tiết). */
export const AFFILIATE_MONTHS: MonthKey[] = ["T4", "T5", "T6", "T7", "T8"];
export const DEFAULT_AFFILIATE_MONTH: MonthKey = "T7";

function weekOrder(): WeekKey[] {
  return WEEKS.map((w) => w.key);
}

function periodOrder(mode: PeriodMode): string[] {
  return mode === "month" ? AFFILIATE_MONTHS : weekOrder();
}

export function getPreviousPeriod(mode: PeriodMode, period: string): string | null {
  const order = periodOrder(mode);
  const idx = order.indexOf(period);
  return idx > 0 ? order[idx - 1] : null;
}

export function getPeriodLabel(mode: PeriodMode, period: string): string {
  if (mode === "month") return MONTHS.find((m) => m.key === period)?.label ?? period;
  return WEEKS.find((w) => w.key === period)?.label ?? period;
}

// ---------------------------------------------------------------------------
// Creators
// ---------------------------------------------------------------------------

export type CreatorRow = {
  name: string;
  platform: Platform;
  gmv: number;
  orders: number;
  payout: number;
  roas: number;
  wowPct: number | null;
  isNew: boolean;
};

function creatorTable(mode: PeriodMode) {
  return mode === "month" ? creatorMonthRaw : creatorWeekRaw;
}

function mergeEntry(a: CreatorEntry | undefined, b: CreatorEntry | undefined): CreatorEntry | undefined {
  if (!a) return b;
  if (!b) return a;
  return { gmv: a.gmv + b.gmv, payout: a.payout + b.payout, orders: a.orders + b.orders };
}

function creatorPeriodMap(mode: PeriodMode, platform: Platform, bu: BuFilter, period: string): Record<string, CreatorEntry> {
  const table = creatorTable(mode);
  const platData = table[platform];
  if (!platData) return {};
  const bus: BU[] = bu === "Tất cả" ? ["PC", "MCC"] : [bu];
  const merged: Record<string, CreatorEntry> = {};
  for (const b of bus) {
    const periodData = platData[b]?.[period];
    if (!periodData) continue;
    for (const [name, entry] of Object.entries(periodData)) {
      merged[name] = mergeEntry(merged[name], entry)!;
    }
  }
  return merged;
}

function hasEarlierActivity(mode: PeriodMode, platform: Platform, bu: BuFilter, period: string, name: string): boolean {
  const order = periodOrder(mode);
  const idx = order.indexOf(period);
  if (idx <= 0) return false;
  for (let i = 0; i < idx; i++) {
    if (creatorPeriodMap(mode, platform, bu, order[i])[name]) return true;
  }
  return false;
}

/**
 * Danh sách creator (Shopee + TikTok Shop, không có Lazada) khớp bộ lọc, sort GMV giảm dần.
 * `comparePeriod` dùng cho delta WoW/MoM; `isNew` = true nếu creator hoàn toàn không có hoạt động
 * ở bất kỳ kỳ nào trước đó (trong phạm vi top-50 đang track).
 */
export function getCreatorRows(
  mode: PeriodMode,
  period: string,
  comparePeriod: string | null,
  platform: PlatformFilter,
  bu: BuFilter
): CreatorRow[] {
  const platforms: Platform[] = platform === "Tất cả" ? ["Shopee", "TikTok Shop"] : platform === "Lazada" ? [] : [platform];
  const rows: CreatorRow[] = [];

  for (const p of platforms) {
    const curMap = creatorPeriodMap(mode, p, bu, period);
    const cmpMap = comparePeriod ? creatorPeriodMap(mode, p, bu, comparePeriod) : {};
    for (const [name, entry] of Object.entries(curMap)) {
      const cmp = cmpMap[name];
      const wowPct = cmp && cmp.gmv > 0 ? ((entry.gmv - cmp.gmv) / cmp.gmv) * 100 : null;
      rows.push({
        name,
        platform: p,
        gmv: entry.gmv,
        orders: entry.orders,
        payout: entry.payout,
        roas: entry.payout > 0 ? entry.gmv / entry.payout : 0,
        wowPct,
        isNew: !hasEarlierActivity(mode, p, bu, period, name),
      });
    }
  }

  return rows.sort((a, b) => b.gmv - a.gmv);
}

// ---------------------------------------------------------------------------
// Category / Campaign Type (Shopee only) — grouped by BU
// ---------------------------------------------------------------------------

export type BuBreakdownRow = { label: string; PC: number; MCC: number };

function buBreakdown(
  table: Partial<Record<BU, Record<string, Record<string, number>>>>,
  period: string,
  bu: BuFilter
): BuBreakdownRow[] {
  const bus: BU[] = bu === "Tất cả" ? ["PC", "MCC"] : [bu];
  const labels = new Set<string>();
  for (const b of bus) {
    const periodData = table[b]?.[period];
    if (periodData) Object.keys(periodData).forEach((k) => labels.add(k));
  }
  return [...labels]
    .map((label) => ({
      label,
      PC: bus.includes("PC") ? table.PC?.[period]?.[label] ?? 0 : 0,
      MCC: bus.includes("MCC") ? table.MCC?.[period]?.[label] ?? 0 : 0,
    }))
    .sort((a, b) => b.PC + b.MCC - (a.PC + a.MCC));
}

/** GMV theo Category sản phẩm (L1 Global Category) — chỉ Shopee, tách PC/MCC. null = platform lọc không phải Shopee/Tất cả. */
export function getCategoryBreakdown(mode: PeriodMode, period: string, platform: PlatformFilter, bu: BuFilter): BuBreakdownRow[] | null {
  if (platform !== "Tất cả" && platform !== "Shopee") return null;
  return buBreakdown(mode === "month" ? categoryMonthRaw : categoryWeekRaw, period, bu);
}

/** Nhãn gốc trong sheet là "Chiến dịch mở rộng/mục tiêu" — rút gọn cho vừa trục Y của chart. */
const CAMPAIGN_LABEL_SHORT: Record<string, string> = {
  "Chiến dịch mở rộng": "Mở rộng",
  "Chiến dịch mục tiêu": "Mục tiêu",
};

/** GMV theo Loại chiến dịch (Mở rộng/Mục tiêu) — chỉ Shopee, tách PC/MCC. */
export function getCampaignBreakdown(mode: PeriodMode, period: string, platform: PlatformFilter, bu: BuFilter): BuBreakdownRow[] | null {
  if (platform !== "Tất cả" && platform !== "Shopee") return null;
  return buBreakdown(mode === "month" ? campaignMonthRaw : campaignWeekRaw, period, bu).map((r) => ({
    ...r,
    label: CAMPAIGN_LABEL_SHORT[r.label] ?? r.label,
  }));
}

/** GMV theo nguồn Creator (Seller/Affiliate/MCN) — chỉ TikTok Shop, tách PC/MCC. */
export function getGmvSourceBreakdown(mode: PeriodMode, period: string, platform: PlatformFilter, bu: BuFilter): BuBreakdownRow[] | null {
  if (platform !== "Tất cả" && platform !== "TikTok Shop") return null;
  return buBreakdown(mode === "month" ? gsourceMonthRaw : gsourceWeekRaw, period, bu);
}

// ---------------------------------------------------------------------------
// Order status funnel (Shopee + TikTok Shop, mỗi platform tự vocab riêng)
// ---------------------------------------------------------------------------

export type StatusRow = { status: string; gmv: number; real: boolean };
export type PlatformStatusBreakdown = { platform: Platform; rows: StatusRow[]; hasData: boolean };

const SHOPEE_REAL_STATUSES = new Set(["Hoàn thành"]);
const TTS_REAL_STATUSES = new Set(["Settled", "Completed"]);

/**
 * Phễu trạng thái đơn hàng — Shopee (nhãn tiếng Việt) và TikTok Shop (nhãn tiếng Anh) tách riêng vì
 * 2 platform dùng bộ trạng thái khác nhau, không gộp chung được thành 1 phễu duy nhất mà không làm
 * sai lệch ý nghĩa. Lazada không có cột Order Status nên không xuất hiện.
 */
export function getOrderStatusBreakdown(
  mode: PeriodMode,
  period: string,
  platform: PlatformFilter,
  bu: BuFilter
): PlatformStatusBreakdown[] {
  const platforms: Platform[] = platform === "Tất cả" ? ["Shopee", "TikTok Shop"] : platform === "Lazada" ? [] : [platform];
  const table = mode === "month" ? statusMonthRaw : statusWeekRaw;
  const bus: BU[] = bu === "Tất cả" ? ["PC", "MCC"] : [bu];

  return platforms.map((p) => {
    const merged: Record<string, number> = {};
    for (const b of bus) {
      const periodData = table[p]?.[b]?.[period];
      if (!periodData) continue;
      for (const [status, gmv] of Object.entries(periodData)) {
        merged[status] = (merged[status] ?? 0) + gmv;
      }
    }
    const realSet = p === "Shopee" ? SHOPEE_REAL_STATUSES : TTS_REAL_STATUSES;
    const rows = Object.entries(merged)
      .map(([status, gmv]) => ({ status, gmv, real: realSet.has(status) }))
      .sort((a, b) => b.gmv - a.gmv);
    return { platform: p, rows, hasData: rows.length > 0 };
  });
}

export { PLATFORMS };
