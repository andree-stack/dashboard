// Seeded from the real workbook "Philips_VN MP Performance Report.xlsx".
// Source sheets in scope: VN RunRate'26, VN Shopee PC'26, VN Shopee MCC'26,
// VN Lazada MCC'26, (Updated) VN TTS PC'26, (Updated) VN TTS MCC'26.
// Numbers are raw VND unless noted otherwise.

export type Platform = "Shopee" | "Lazada" | "TikTok Shop";
export type BU = "PC" | "MCC";
export type PlatformFilter = Platform | "Tất cả";
export type BuFilter = BU | "Tất cả";
export type MonthKey = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9" | "T10" | "T11" | "T12";

export const PLATFORMS: Platform[] = ["Shopee", "Lazada", "TikTok Shop"];

export const MONTHS: { key: MonthKey; label: string; shortLabel: string }[] = [
  { key: "T1", label: "Tháng 1/2026", shortLabel: "T1" },
  { key: "T2", label: "Tháng 2/2026", shortLabel: "T2" },
  { key: "T3", label: "Tháng 3/2026", shortLabel: "T3" },
  { key: "T4", label: "Tháng 4/2026", shortLabel: "T4" },
  { key: "T5", label: "Tháng 5/2026", shortLabel: "T5" },
  { key: "T6", label: "Tháng 6/2026", shortLabel: "T6" },
  { key: "T7", label: "Tháng 7/2026", shortLabel: "T7" },
  { key: "T8", label: "Tháng 8/2026 (MTD)", shortLabel: "T8" },
  { key: "T9", label: "Tháng 9/2026", shortLabel: "T9" },
  { key: "T10", label: "Tháng 10/2026", shortLabel: "T10" },
  { key: "T11", label: "Tháng 11/2026", shortLabel: "T11" },
  { key: "T12", label: "Tháng 12/2026", shortLabel: "T12" },
];

/** Tháng gần nhất có đủ dữ liệu (T8 mới chỉ là MTD tính đến 16/08). */
export const DEFAULT_MONTH: MonthKey = "T7";

// ---- Tab 1 · Tổng quan -----------------------------------------------

/** GMV Target vs Actual by month, FY2026. Source: VN RunRate'26 (GMV TARGET / GMV ACTUALISATION). */
export const monthlyTrend: {
  month: MonthKey;
  target: number;
  actual: number | null;
  isMtd: boolean;
}[] = [
  { month: "T1", target: 329_706_606, actual: 329_706_606, isMtd: false },
  { month: "T2", target: 202_810_631, actual: 202_810_631, isMtd: false },
  { month: "T3", target: 287_861_268, actual: 287_861_268, isMtd: false },
  { month: "T4", target: 500_000_000, actual: 468_825_436, isMtd: false },
  { month: "T5", target: 1_150_000_000, actual: 722_102_284, isMtd: false },
  { month: "T6", target: 1_024_997_154, actual: 1_668_762_561, isMtd: false },
  { month: "T7", target: 2_535_103_627, actual: 2_476_345_473, isMtd: false },
  { month: "T8", target: 2_862_142_701, actual: 1_494_099_823, isMtd: true },
  { month: "T9", target: 3_899_250_253, actual: null, isMtd: false },
  { month: "T10", target: 4_102_973_284, actual: null, isMtd: false },
  { month: "T11", target: 5_152_398_492, actual: null, isMtd: false },
  { month: "T12", target: 4_798_264_070, actual: null, isMtd: false },
];

/**
 * GMV Actual/Target theo Platform × BU, từng tháng T1–T12/2026.
 * Source: VN RunRate'26 — "GMV TARGET 2026" (target theo kênh, dòng 4-9) &
 * "GMV ACTUALISATION 2026" (actual theo kênh, dòng 14-21 — TikTok Affiliate+Seller đã gộp).
 * Đối chiếu: tổng mỗi tháng khớp chính xác với monthlyTrend ở trên.
 * actual = null nghĩa là tháng chưa diễn ra / chưa có số liệu thực tế.
 * target = 0 nghĩa là kênh chưa được set target trong sheet nguồn (chủ yếu Lazada).
 */
export const monthlyPlatformBu: Record<
  MonthKey,
  { platform: Platform; bu: BU; actual: number | null; target: number }[]
> = {
  T1: [
    { platform: "Shopee", bu: "PC", actual: 0, target: 0 },
    { platform: "Shopee", bu: "MCC", actual: 162_700_000, target: 162_700_000 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "MCC", actual: 167_006_606, target: 167_006_606 },
  ],
  T2: [
    { platform: "Shopee", bu: "PC", actual: 0, target: 0 },
    { platform: "Shopee", bu: "MCC", actual: 141_400_000, target: 141_400_000 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "MCC", actual: 61_410_631, target: 61_410_631 },
  ],
  T3: [
    { platform: "Shopee", bu: "PC", actual: 0, target: 0 },
    { platform: "Shopee", bu: "MCC", actual: 184_400_000, target: 184_400_000 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "MCC", actual: 103_461_268, target: 103_461_268 },
  ],
  T4: [
    { platform: "Shopee", bu: "PC", actual: 0, target: 0 },
    { platform: "Shopee", bu: "MCC", actual: 202_468_585, target: 300_000_000 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 5_673_749, target: 25_000_000 },
    { platform: "TikTok Shop", bu: "PC", actual: 0, target: 0 },
    { platform: "TikTok Shop", bu: "MCC", actual: 260_683_102, target: 175_000_000 },
  ],
  T5: [
    { platform: "Shopee", bu: "PC", actual: 152_868_059, target: 150_000_000 },
    { platform: "Shopee", bu: "MCC", actual: 235_255_804, target: 350_000_000 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 7_710_500, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 38_492_820, target: 200_000_000 },
    { platform: "TikTok Shop", bu: "MCC", actual: 287_775_101, target: 450_000_000 },
  ],
  T6: [
    { platform: "Shopee", bu: "PC", actual: 470_710_953, target: 214_701_172 },
    { platform: "Shopee", bu: "MCC", actual: 359_538_321, target: 298_650_194 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 8_088_200, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 165_365_431, target: 110_827_370 },
    { platform: "TikTok Shop", bu: "MCC", actual: 665_059_656, target: 400_818_418 },
  ],
  T7: [
    { platform: "Shopee", bu: "PC", actual: 1_313_383_041, target: 786_240_000 },
    { platform: "Shopee", bu: "MCC", actual: 379_140_810, target: 774_605_185 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 7_305_800, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 376_039_312, target: 517_440_000 },
    { platform: "TikTok Shop", bu: "MCC", actual: 400_476_510, target: 456_818_442 },
  ],
  T8: [
    { platform: "Shopee", bu: "PC", actual: 811_714_819, target: 1_616_942_701 },
    { platform: "Shopee", bu: "MCC", actual: 202_121_800, target: 538_200_000 },
    { platform: "Lazada", bu: "PC", actual: 0, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: 546_700, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: 268_190_208, target: 286_000_000 },
    { platform: "TikTok Shop", bu: "MCC", actual: 211_526_296, target: 421_000_000 },
  ],
  T9: [
    { platform: "Shopee", bu: "PC", actual: null, target: 1_331_406_720 },
    { platform: "Shopee", bu: "MCC", actual: null, target: 906_346_924 },
    { platform: "Lazada", bu: "PC", actual: null, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: null, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: null, target: 1_126_984_320 },
    { platform: "TikTok Shop", bu: "MCC", actual: null, target: 534_512_289 },
  ],
  T10: [
    { platform: "Shopee", bu: "PC", actual: null, target: 1_344_207_744 },
    { platform: "Shopee", bu: "MCC", actual: null, target: 918_418_722 },
    { platform: "Lazada", bu: "PC", actual: null, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: null, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: null, target: 1_298_715_264 },
    { platform: "TikTok Shop", bu: "MCC", actual: null, target: 541_631_554 },
  ],
  T11: [
    { platform: "Shopee", bu: "PC", actual: null, target: 1_632_161_457 },
    { platform: "Shopee", bu: "MCC", actual: null, target: 1_076_081_563 },
    { platform: "Lazada", bu: "PC", actual: null, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: null, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: null, target: 1_809_543_268 },
    { platform: "TikTok Shop", bu: "MCC", actual: null, target: 634_612_204 },
  ],
  T12: [
    { platform: "Shopee", bu: "PC", actual: null, target: 1_309_144_928 },
    { platform: "Shopee", bu: "MCC", actual: null, target: 1_140_379_274 },
    { platform: "Lazada", bu: "PC", actual: null, target: 0 },
    { platform: "Lazada", bu: "MCC", actual: null, target: 0 },
    { platform: "TikTok Shop", bu: "PC", actual: null, target: 1_676_208_501 },
    { platform: "TikTok Shop", bu: "MCC", actual: null, target: 672_531_367 },
  ],
};

function filteredActualTotal(rows: { actual: number | null }[]): number | null {
  return rows.every((r) => r.actual != null) ? rows.reduce((s, r) => s + (r.actual ?? 0), 0) : null;
}

/**
 * GMV/Target/%/MoM cho đúng bộ lọc Platform × BU đang chọn, không chỉ tổng công ty.
 * Dùng monthlyPlatformBu (đã đối chiếu khớp monthlyTrend khi platform=bu="Tất cả").
 */
export function getFilteredKpi(month: MonthKey, platform: PlatformFilter, bu: BuFilter) {
  const idx = MONTHS.findIndex((m) => m.key === month);
  const matches = (r: { platform: Platform; bu: BU }) =>
    (platform === "Tất cả" || r.platform === platform) && (bu === "Tất cả" || r.bu === bu);

  const rows = monthlyPlatformBu[month].filter(matches);
  const gmvTarget = rows.reduce((s, r) => s + r.target, 0);
  const gmvActual = filteredActualTotal(rows);

  const achievementPct = gmvActual != null && gmvTarget > 0 ? (gmvActual / gmvTarget) * 100 : null;

  let momGrowthPct: number | null = null;
  if (idx > 0) {
    const prevRows = monthlyPlatformBu[MONTHS[idx - 1].key].filter(matches);
    const prevActual = filteredActualTotal(prevRows);
    if (prevActual != null && prevActual !== 0 && gmvActual != null) {
      momGrowthPct = ((gmvActual - prevActual) / prevActual) * 100;
    }
  }

  return {
    month,
    label: MONTHS[idx].label,
    gmvActual,
    gmvTarget,
    achievementPct,
    momGrowthPct,
    isMtd: monthlyTrend[idx].isMtd,
    hasActual: gmvActual != null,
    hasChannels: rows.length > 0,
  };
}

/**
 * Payout/Avg Comm/ROAS cho đúng bộ lọc Platform, trong phạm vi operationsByChannel.
 * Dữ liệu này CHỈ trích xuất cho OPERATIONS_MONTH (Tháng 4/2026) — nếu tháng đang chọn
 * khác tháng đó, trả về hasData:false thay vì lẫn số liệu giữa 2 tháng khác nhau.
 */
export function getFilteredOperations(month: MonthKey, platform: PlatformFilter, bu: BuFilter) {
  if (month !== OPERATIONS_MONTH || bu === "PC") {
    return { hasData: false, avgCommissionPct: 0, roasBlend: 0 };
  }
  const rows = operationsByChannel.filter((r) => platform === "Tất cả" || r.platform === platform);
  if (rows.length === 0) return { hasData: false, avgCommissionPct: 0, roasBlend: 0 };
  const totalPayout = rows.reduce((s, r) => s + r.payout, 0);
  const totalGmv = rows.reduce((s, r) => s + r.payout * r.roas, 0);
  return {
    hasData: true,
    avgCommissionPct: totalGmv > 0 ? (totalPayout / totalGmv) * 100 : 0,
    roasBlend: totalPayout > 0 ? totalGmv / totalPayout : 0,
  };
}

/** Ví dụ tỷ lệ Hoàn thành / Refund theo Platform × BU — chỉ có dữ liệu thật cho Shopee (từ cột Order Status), Tháng 4/2026. */
export const ORDER_METRICS_MONTH: MonthKey = "T4";

export const exampleOrderMetrics: Record<string, { completionRatePct: number; refundPct: number }> = {
  "Shopee-PC": { completionRatePct: 83.3, refundPct: 9.2 }, // 2,431/2,919 đơn Hoàn thành; Refund ÷ Purchase Value
  "Shopee-MCC": { completionRatePct: 84.4, refundPct: 18.5 }, // 1,409/1,669 đơn Hoàn thành; Refund ÷ Purchase Value
};

export type ExampleOrderMetrics =
  | { hasData: true; platformLabel: string; completionRatePct: number; refundPct: number }
  | { hasData: false };

export function getExampleOrderMetrics(month: MonthKey, platform: PlatformFilter, bu: BuFilter): ExampleOrderMetrics {
  if (month !== ORDER_METRICS_MONTH) return { hasData: false };
  const p = platform === "Tất cả" ? "Shopee" : platform;
  const b = bu === "Tất cả" ? "PC" : bu;
  const entry = exampleOrderMetrics[`${p}-${b}`];
  if (!entry) return { hasData: false };
  return { hasData: true, platformLabel: `${p} ${b}`, ...entry };
}

/** Fixed-period ops metrics that only exist for Tháng 4/2026 in the current dataset. */
export const kpiSnapshot = {
  period: "Tháng 4/2026",
};

// ---- Tab 2 · Affiliate & Creator ---------------------------------------

/** Top creator/affiliate theo GMV, luỹ kế toàn bộ dữ liệu trong sheet. */
export const topCreators: Record<Platform, { name: string; gmv: number }[]> = {
  Shopee: [
    { name: "CreatorX Media Network", gmv: 212_243_141 },
    { name: "ShopBack Việt Nam", gmv: 147_147_929 },
    { name: "SteveGate", gmv: 109_497_516 },
    { name: "ADPIA VN Official", gmv: 101_652_599 },
    { name: "GA", gmv: 72_973_031 },
    { name: "ACCESSTRADEVN", gmv: 69_853_558 },
  ],
  "TikTok Shop": [
    { name: "HEPMIL VIETNAM", gmv: 121_063_765 },
    { name: "menamtao", gmv: 55_029_001 },
    { name: "iflytek02", gmv: 48_915_234 },
    { name: "megaote24", gmv: 42_837_419 },
    { name: "bitcoin.hauann", gmv: 34_450_586 },
    { name: "julyshop_sn.sale", gmv: 32_784_531 },
  ],
  Lazada: [],
};

/** GMV theo Category sản phẩm, Shopee (PC+MCC gộp). Source: cột L1 Global Category. */
export const categoryGmv = [
  { category: "Sắc Đẹp", gmv: 1_912_602_050 },
  { category: "Mẹ & Bé", gmv: 1_163_047_445 },
  { category: "Sức Khỏe", gmv: 603_821_468 },
];

/** GMV theo kênh Traffic, Shopee (PC+MCC gộp). Source: cột Channel. */
export const trafficChannelGmv = [
  { channel: "Facebook", gmv: 947_795_804 },
  { channel: "Websites", gmv: 716_000_606 },
  { channel: "Shopee Video", gmv: 599_450_102 },
  { channel: "Others", gmv: 565_116_810 },
  { channel: "Shopee Live", gmv: 511_209_088 },
];

/** GMV theo GMV Source, TikTok Shop. Source: cột GMV Source. */
export const gmvSourceByBu: Record<BU, { source: string; gmv: number }[]> = {
  PC: [
    { source: "Seller Creator", gmv: 489_190_000 },
    { source: "Affiliate Creator", gmv: 423_007_913 },
    { source: "MCN", gmv: 1_903_764 },
  ],
  MCC: [
    { source: "Affiliate Creator", gmv: 1_260_800_402 },
    { source: "Seller Creator", gmv: 408_710_000 },
    { source: "MCN", gmv: 157_828_317 },
  ],
};

/** GMV theo Content Type, TikTok Shop MCC (chỉ populate với Affiliate Creator). */
export const contentTypeGmv = [
  { type: "Video", gmv: 636_245_697 },
  { type: "External Traffic", gmv: 366_404_677 },
  { type: "Showcase", gmv: 216_881_483 },
  { type: "Livestream", gmv: 41_268_545 },
];

/** GMV theo Loại chiến dịch, Shopee. Source: cột Campaign Type. */
export const campaignTypeByBu: Record<BU, { type: "Mở rộng" | "Mục tiêu"; gmv: number }[]> = {
  PC: [
    { type: "Mở rộng", gmv: 1_278_551_983 },
    { type: "Mục tiêu", gmv: 1_237_871_535 },
  ],
  MCC: [
    { type: "Mở rộng", gmv: 621_358_320 },
    { type: "Mục tiêu", gmv: 541_689_125 },
  ],
};

/** GMV theo Order Status, TikTok Shop MCC. Chỉ Settled+Completed là GMV thật. */
export const orderStatusFunnel = [
  { status: "Settled", gmv: 860_804_524, real: true },
  { status: "Ineligible", gmv: 466_627_910, real: false },
  { status: "Canceled", gmv: 334_907_000, real: false },
  { status: "Pending", gmv: 56_648_979, real: false },
  { status: "Completed", gmv: 54_851_000, real: true },
  { status: "Unpaid by customer", gmv: 34_547_306, real: false },
  { status: "Shipped", gmv: 18_952_000, real: false },
];

// ---- Tab 3 · Vận hành: Payout & ROAS -----------------------------------

/**
 * Payout / Avg Comm / ROAS theo kênh MCC — chỉ có ở Tháng 4/2026 trong dữ liệu hiện tại
 * (nguồn: khối daily riêng theo tháng trong VN RunRate'26 — mới trích xuất cho T4).
 */
export const OPERATIONS_MONTH: MonthKey = "T4";

export const operationsByChannel: {
  platform: Platform;
  channel: string;
  payout: number;
  avgCommPct: number;
  roas: number;
}[] = [
  { platform: "Shopee", channel: "Shopee MCC", payout: 7_774_018, avgCommPct: 3.84, roas: 26.04 },
  { platform: "Lazada", channel: "Lazada MCC", payout: 387_119, avgCommPct: 6.82, roas: 14.66 },
  { platform: "TikTok Shop", channel: "TikTok MCC", payout: 15_428_070, avgCommPct: 5.92, roas: 16.9 },
];

export const platformColor: Record<Platform, string> = {
  Shopee: "var(--color-s-shopee)",
  Lazada: "var(--color-s-lazada)",
  "TikTok Shop": "var(--color-s-tts)",
};
