// Seeded from the real workbook "Philips_VN MP Performance Report.xlsx".
// Source sheets in scope: VN RunRate'26, VN Shopee PC'26, VN Shopee MCC'26,
// VN Lazada MCC'26, (Updated) VN TTS PC'26, (Updated) VN TTS MCC'26.
// Numbers are raw VND unless noted otherwise.

export type Platform = "Shopee" | "Lazada" | "TikTok Shop";
export type BU = "PC" | "MCC";
export type PlatformFilter = Platform | "Tất cả";
export type BuFilter = BU | "Tất cả";

export const PLATFORMS: Platform[] = ["Shopee", "Lazada", "TikTok Shop"];

// ---- Tab 1 · Tổng quan -----------------------------------------------

/** GMV Target vs Actual by month, FY2026. Source: VN RunRate'26 (GMV TARGET / GMV ACTUALISATION). */
export const monthlyTrend = [
  { month: "T1", target: 329_706_606, actual: 329_706_606 },
  { month: "T2", target: 202_810_631, actual: 202_810_631 },
  { month: "T3", target: 287_861_268, actual: 287_861_268 },
  { month: "T4", target: 500_000_000, actual: 468_825_436 },
  { month: "T5", target: 1_150_000_000, actual: 722_102_284 },
  { month: "T6", target: 1_024_997_154, actual: 1_668_762_561 },
  { month: "T7", target: 2_535_103_627, actual: 2_476_345_473 },
  { month: "T8", target: 2_862_142_701, actual: 1_494_099_823, isMtd: true },
  { month: "T9", target: 3_899_250_253, actual: null },
  { month: "T10", target: 4_102_973_284, actual: null },
  { month: "T11", target: 5_152_398_492, actual: null },
  { month: "T12", target: 4_798_264_070, actual: null },
] as const;

/** KPI snapshot, Tháng 4/2026 (VN RunRate'26 — company-wide, single sheet). */
export const kpiSnapshot = {
  period: "Tháng 4/2026",
  gmvActual: 468_825_436,
  gmvTarget: 500_000_000,
  achievementPct: 93.8,
  momGrowthPct: 62.9,
  avgCommissionPct: 5.03,
  roasBlend: 19.9,
  completionRatePct: 83.3, // Shopee PC — 2,431 / 2,919 orders
  refundPct: 9.2, // Shopee PC — Refund Value ÷ Purchase Value
};

/** GMV by Platform × BU, Tháng 5/2026. Source: VN RunRate'26 (GMV ACTUALISATION). */
export const platformBuBreakdown: { platform: Platform; bu: BU; gmv: number }[] = [
  { platform: "Shopee", bu: "PC", gmv: 152_868_059 },
  { platform: "Shopee", bu: "MCC", gmv: 235_255_804 },
  { platform: "Lazada", bu: "PC", gmv: 0 },
  { platform: "Lazada", bu: "MCC", gmv: 7_710_500 },
  { platform: "TikTok Shop", bu: "PC", gmv: 38_492_820 },
  { platform: "TikTok Shop", bu: "MCC", gmv: 287_775_101 },
];

/** % đạt target theo kênh, Tháng 4/2026. Source: VN RunRate'26 (khối "Vietnam %"). */
export const targetAchievementByChannel = [
  { channel: "Lazada MCC", platform: "Lazada" as Platform, pct: 22.7 },
  { channel: "Shopee MCC", platform: "Shopee" as Platform, pct: 67.5 },
  { channel: "TikTok MCC", platform: "TikTok Shop" as Platform, pct: 87.2 },
];

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

/** Payout / Avg Comm / ROAS theo kênh MCC, Tháng 4/2026. Source: VN RunRate'26 (khối daily, cột Total). */
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
