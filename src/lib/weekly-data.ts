// Weekly rollups derived from the same 5 detail sheets as monthlyChannelOps in data.ts
// (VN Shopee PC'26/MCC'26, VN Lazada MCC'26, (Updated) VN TTS PC'26/MCC'26), grouped by
// ISO week (Thứ 2 → Chủ nhật) instead of by calendar month. Same formulas as data.ts:
// - Shopee: gmv = Σ Purchase Value; payout = Σ Order Brand Commission to Affiliate(VND);
//   completion = GMV đơn "Hoàn thành" ÷ gmv; refund = Σ Refund Value ÷ gmv.
// - TikTok Shop: gmv = Σ Payment Amount; payout = Σ (Actual Commission Payment + Actual Shop
//   Ads commission payment + Actual co-funded creator bonus); completion = GMV đơn
//   Completed/Settled ÷ gmv; refund = GMV có cờ "Fully returned or refunded"=Yes ÷ gmv.
// - Lazada: gmv = Σ Revenue; payout = Σ Est. Spend; không có completion/refund (sheet không có
//   cột Order Status/Refund).
// Dữ liệu giao dịch mới nhất trong file nguồn dừng ở 13/08/2026, nên tuần cuối (W20, 10–16/08)
// là tuần chưa trọn (isPartial) — chỉ nên đọc là số MTD của tuần đó, không phải tuần đủ 7 ngày.
import { BU_COLOR, PLATFORMS, platformColor, type BU, type BuFilter, type Platform, type PlatformFilter } from "./data";

export type WeeklyChannelMetrics = {
  gmv: number;
  payout: number;
  orders: number;
  avgCommissionPct: number;
  roas: number;
  completionRatePct: number | null;
  refundRatePct: number | null;
};

export type WeekKey =
  | "W1" | "W2" | "W3" | "W4" | "W5" | "W6" | "W7" | "W8" | "W9" | "W10"
  | "W11" | "W12" | "W13" | "W14" | "W15" | "W16" | "W17" | "W18" | "W19" | "W20";

export const WEEKS: { key: WeekKey; start: string; end: string; label: string; isPartial: boolean }[] = [
  { key: "W1", start: "2026-03-30", end: "2026-04-05", label: "30/03–05/04", isPartial: false },
  { key: "W2", start: "2026-04-06", end: "2026-04-12", label: "06/04–12/04", isPartial: false },
  { key: "W3", start: "2026-04-13", end: "2026-04-19", label: "13/04–19/04", isPartial: false },
  { key: "W4", start: "2026-04-20", end: "2026-04-26", label: "20/04–26/04", isPartial: false },
  { key: "W5", start: "2026-04-27", end: "2026-05-03", label: "27/04–03/05", isPartial: false },
  { key: "W6", start: "2026-05-04", end: "2026-05-10", label: "04/05–10/05", isPartial: false },
  { key: "W7", start: "2026-05-11", end: "2026-05-17", label: "11/05–17/05", isPartial: false },
  { key: "W8", start: "2026-05-18", end: "2026-05-24", label: "18/05–24/05", isPartial: false },
  { key: "W9", start: "2026-05-25", end: "2026-05-31", label: "25/05–31/05", isPartial: false },
  { key: "W10", start: "2026-06-01", end: "2026-06-07", label: "01/06–07/06", isPartial: false },
  { key: "W11", start: "2026-06-08", end: "2026-06-14", label: "08/06–14/06", isPartial: false },
  { key: "W12", start: "2026-06-15", end: "2026-06-21", label: "15/06–21/06", isPartial: false },
  { key: "W13", start: "2026-06-22", end: "2026-06-28", label: "22/06–28/06", isPartial: false },
  { key: "W14", start: "2026-06-29", end: "2026-07-05", label: "29/06–05/07", isPartial: false },
  { key: "W15", start: "2026-07-06", end: "2026-07-12", label: "06/07–12/07", isPartial: false },
  { key: "W16", start: "2026-07-13", end: "2026-07-19", label: "13/07–19/07", isPartial: false },
  { key: "W17", start: "2026-07-20", end: "2026-07-26", label: "20/07–26/07", isPartial: false },
  { key: "W18", start: "2026-07-27", end: "2026-08-02", label: "27/07–02/08", isPartial: false },
  { key: "W19", start: "2026-08-03", end: "2026-08-09", label: "03/08–09/08", isPartial: false },
  { key: "W20", start: "2026-08-10", end: "2026-08-16", label: "10/08–16/08", isPartial: true },
];

/** Tuần gần nhất đã trọn 7 ngày (W20 mới chỉ là MTD của tuần, giống cách T8 = MTD ở tab Tổng quan). */
export const DEFAULT_WEEK: WeekKey = "W19";

/** Số tuần lùi lại để tính "cùng tuần tháng trước" — xấp xỉ 1 tháng ≈ 4 tuần. */
const SAME_WEEK_LAST_MONTH_OFFSET = 4;

export const weeklyChannelData: Partial<Record<WeekKey, Record<string, WeeklyChannelMetrics>>> = {
  W1: {
    "Lazada-MCC": { gmv: 1222100, payout: 51100, orders: 4, avgCommissionPct: 4.18, roas: 23.92, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 77329263, payout: 2846231, orders: 100, avgCommissionPct: 3.68, roas: 27.17, completionRatePct: 100.0, refundRatePct: 5.7 },
    "TikTok Shop-MCC": { gmv: 44244507, payout: 1625229, orders: 119, avgCommissionPct: 3.67, roas: 27.22, completionRatePct: 80.05, refundRatePct: 1.72 },
  },
  W2: {
    "Lazada-MCC": { gmv: 902700, payout: 39500, orders: 3, avgCommissionPct: 4.38, roas: 22.85, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 24878412, payout: 979477, orders: 76, avgCommissionPct: 3.94, roas: 25.4, completionRatePct: 100.0, refundRatePct: 43.13 },
    "TikTok Shop-MCC": { gmv: 63086673, payout: 1852461, orders: 150, avgCommissionPct: 2.94, roas: 34.06, completionRatePct: 54.56, refundRatePct: 0.4 },
  },
  W3: {
    "Lazada-MCC": { gmv: 2846649, payout: 239639, orders: 6, avgCommissionPct: 8.42, roas: 11.88, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 33466280, payout: 1752631, orders: 77, avgCommissionPct: 5.24, roas: 19.09, completionRatePct: 100.0, refundRatePct: 6.16 },
    "TikTok Shop-MCC": { gmv: 65287657, payout: 2494275, orders: 174, avgCommissionPct: 3.82, roas: 26.18, completionRatePct: 65.22, refundRatePct: 8.07 },
  },
  W4: {
    "Lazada-MCC": { gmv: 702300, payout: 56880, orders: 3, avgCommissionPct: 8.1, roas: 12.35, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 28966178, payout: 1741999, orders: 68, avgCommissionPct: 6.01, roas: 16.63, completionRatePct: 99.23, refundRatePct: 27.88 },
    "TikTok Shop-MCC": { gmv: 57004662, payout: 2316854, orders: 142, avgCommissionPct: 4.06, roas: 24.6, completionRatePct: 65.24, refundRatePct: 5.45 },
  },
  W5: {
    "Shopee-MCC": { gmv: 12738526, payout: 552597, orders: 26, avgCommissionPct: 4.34, roas: 23.05, completionRatePct: 75.87, refundRatePct: 42.74 },
    "TikTok Shop-MCC": { gmv: 48899186, payout: 2274306, orders: 123, avgCommissionPct: 4.65, roas: 21.5, completionRatePct: 76.46, refundRatePct: 0.98 },
  },
  W6: {
    "Lazada-MCC": { gmv: 2663500, payout: 217100, orders: 9, avgCommissionPct: 8.15, roas: 12.27, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 77021277, payout: 3676266, orders: 83, avgCommissionPct: 4.77, roas: 20.95, completionRatePct: 100.0, refundRatePct: 14.8 },
    "Shopee-PC": { gmv: 31386389, payout: 2637361, orders: 38, avgCommissionPct: 8.4, roas: 11.9, completionRatePct: 100.0, refundRatePct: 3.12 },
    "TikTok Shop-MCC": { gmv: 65462323, payout: 2495381, orders: 170, avgCommissionPct: 3.81, roas: 26.23, completionRatePct: 63.03, refundRatePct: 0.73 },
  },
  W7: {
    "Lazada-MCC": { gmv: 2129900, payout: 173666, orders: 7, avgCommissionPct: 8.15, roas: 12.26, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 34869322, payout: 1857137, orders: 45, avgCommissionPct: 5.33, roas: 18.78, completionRatePct: 100.0, refundRatePct: 12.11 },
    "Shopee-PC": { gmv: 32037231, payout: 2279997, orders: 37, avgCommissionPct: 7.12, roas: 14.05, completionRatePct: 100.0, refundRatePct: 1.76 },
    "TikTok Shop-MCC": { gmv: 57755730, payout: 2681725, orders: 136, avgCommissionPct: 4.64, roas: 21.54, completionRatePct: 71.83, refundRatePct: 0.38 },
  },
  W8: {
    "Lazada-MCC": { gmv: 1412800, payout: 115290, orders: 5, avgCommissionPct: 8.16, roas: 12.25, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 41246250, payout: 2253035, orders: 79, avgCommissionPct: 5.46, roas: 18.31, completionRatePct: 100.0, refundRatePct: 16.39 },
    "Shopee-PC": { gmv: 34902959, payout: 2241487, orders: 50, avgCommissionPct: 6.42, roas: 15.57, completionRatePct: 100.0, refundRatePct: 4.48 },
    "TikTok Shop-MCC": { gmv: 75803514, payout: 3340480, orders: 179, avgCommissionPct: 4.41, roas: 22.69, completionRatePct: 64.64, refundRatePct: 2.88 },
    "TikTok Shop-PC": { gmv: 33378700, payout: 98665, orders: 36, avgCommissionPct: 0.3, roas: 338.3, completionRatePct: 60.08, refundRatePct: 0.0 },
  },
  W9: {
    "Lazada-MCC": { gmv: 1504300, payout: 125000, orders: 5, avgCommissionPct: 8.31, roas: 12.03, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 43186424, payout: 2120527, orders: 63, avgCommissionPct: 4.91, roas: 20.37, completionRatePct: 100.0, refundRatePct: 25.29 },
    "Shopee-PC": { gmv: 42150146, payout: 3312958, orders: 52, avgCommissionPct: 7.86, roas: 12.72, completionRatePct: 100.0, refundRatePct: 22.02 },
    "TikTok Shop-MCC": { gmv: 77943042, payout: 2458189, orders: 170, avgCommissionPct: 3.15, roas: 31.71, completionRatePct: 60.5, refundRatePct: 1.79 },
    "TikTok Shop-PC": { gmv: 7016000, payout: 0, orders: 3, avgCommissionPct: 0.0, roas: 0, completionRatePct: 18.13, refundRatePct: 0.0 },
  },
  W10: {
    "Lazada-MCC": { gmv: 5154200, payout: 435580, orders: 16, avgCommissionPct: 8.45, roas: 11.83, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 105015146, payout: 5954557, orders: 87, avgCommissionPct: 5.67, roas: 17.64, completionRatePct: 100.0, refundRatePct: 16.3 },
    "Shopee-PC": { gmv: 80484657, payout: 6527664, orders: 92, avgCommissionPct: 8.11, roas: 12.33, completionRatePct: 100.0, refundRatePct: 9.54 },
    "TikTok Shop-MCC": { gmv: 99988748, payout: 4203543, orders: 237, avgCommissionPct: 4.2, roas: 23.79, completionRatePct: 66.0, refundRatePct: 0.36 },
    "TikTok Shop-PC": { gmv: 41716460, payout: 258323, orders: 23, avgCommissionPct: 0.62, roas: 161.49, completionRatePct: 64.5, refundRatePct: 0.0 },
  },
  W11: {
    "Lazada-MCC": { gmv: 1499300, payout: 120600, orders: 5, avgCommissionPct: 8.04, roas: 12.43, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 49303075, payout: 2470921, orders: 58, avgCommissionPct: 5.01, roas: 19.95, completionRatePct: 100.0, refundRatePct: 20.92 },
    "Shopee-PC": { gmv: 74124405, payout: 5460804, orders: 76, avgCommissionPct: 7.37, roas: 13.57, completionRatePct: 100.0, refundRatePct: 4.75 },
    "TikTok Shop-MCC": { gmv: 91193067, payout: 2519678, orders: 173, avgCommissionPct: 2.76, roas: 36.19, completionRatePct: 45.65, refundRatePct: 1.79 },
    "TikTok Shop-PC": { gmv: 24418700, payout: 480770, orders: 17, avgCommissionPct: 1.97, roas: 50.79, completionRatePct: 46.09, refundRatePct: 0.0 },
  },
  W12: {
    "Lazada-MCC": { gmv: 302700, payout: 24300, orders: 1, avgCommissionPct: 8.03, roas: 12.46, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 78490730, payout: 5529486, orders: 83, avgCommissionPct: 7.04, roas: 14.19, completionRatePct: 100.0, refundRatePct: 21.49 },
    "Shopee-PC": { gmv: 97867334, payout: 5648178, orders: 117, avgCommissionPct: 5.77, roas: 17.33, completionRatePct: 100.0, refundRatePct: 5.53 },
    "TikTok Shop-MCC": { gmv: 176417845, payout: 3382488, orders: 224, avgCommissionPct: 1.92, roas: 52.16, completionRatePct: 30.82, refundRatePct: 1.0 },
    "TikTok Shop-PC": { gmv: 12460000, payout: 143385, orders: 9, avgCommissionPct: 1.15, roas: 86.9, completionRatePct: 42.96, refundRatePct: 5.95 },
  },
  W13: {
    "Lazada-MCC": { gmv: 1132000, payout: 95400, orders: 3, avgCommissionPct: 8.43, roas: 11.87, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 60583610, payout: 3046055, orders: 64, avgCommissionPct: 5.03, roas: 19.89, completionRatePct: 100.0, refundRatePct: 22.62 },
    "Shopee-PC": { gmv: 159536339, payout: 8829142, orders: 151, avgCommissionPct: 5.53, roas: 18.07, completionRatePct: 100.0, refundRatePct: 5.9 },
    "TikTok Shop-MCC": { gmv: 302287774, payout: 3411352, orders: 266, avgCommissionPct: 1.13, roas: 88.61, completionRatePct: 16.94, refundRatePct: 1.23 },
    "TikTok Shop-PC": { gmv: 82975360, payout: 441319, orders: 63, avgCommissionPct: 0.53, roas: 188.02, completionRatePct: 53.49, refundRatePct: 0.0 },
  },
  W14: {
    "Lazada-MCC": { gmv: 605100, payout: 49500, orders: 2, avgCommissionPct: 8.18, roas: 12.22, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 37745727, payout: 1924179, orders: 46, avgCommissionPct: 5.1, roas: 19.62, completionRatePct: 100.0, refundRatePct: 7.93 },
    "Shopee-PC": { gmv: 119086338, payout: 6821855, orders: 149, avgCommissionPct: 5.73, roas: 17.46, completionRatePct: 100.0, refundRatePct: 9.15 },
    "TikTok Shop-MCC": { gmv: 86946492, payout: 4929625, orders: 244, avgCommissionPct: 5.67, roas: 17.64, completionRatePct: 76.55, refundRatePct: 2.62 },
    "TikTok Shop-PC": { gmv: 53162769, payout: 969418, orders: 38, avgCommissionPct: 1.82, roas: 54.84, completionRatePct: 50.15, refundRatePct: 0.0 },
  },
  W15: {
    "Lazada-MCC": { gmv: 2428800, payout: 196470, orders: 9, avgCommissionPct: 8.09, roas: 12.36, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 108721766, payout: 7101306, orders: 169, avgCommissionPct: 6.53, roas: 15.31, completionRatePct: 100.0, refundRatePct: 25.45 },
    "Shopee-PC": { gmv: 336990392, payout: 18979833, orders: 425, avgCommissionPct: 5.63, roas: 17.76, completionRatePct: 100.0, refundRatePct: 11.62 },
    "TikTok Shop-MCC": { gmv: 104559120, payout: 5426468, orders: 268, avgCommissionPct: 5.19, roas: 19.27, completionRatePct: 75.76, refundRatePct: 2.58 },
    "TikTok Shop-PC": { gmv: 92737163, payout: 1399195, orders: 68, avgCommissionPct: 1.51, roas: 66.28, completionRatePct: 65.3, refundRatePct: 1.22 },
  },
  W16: {
    "Lazada-MCC": { gmv: 2941000, payout: 250110, orders: 5, avgCommissionPct: 8.5, roas: 11.76, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 65979911, payout: 4160887, orders: 93, avgCommissionPct: 6.31, roas: 15.86, completionRatePct: 100.0, refundRatePct: 41.35 },
    "Shopee-PC": { gmv: 301414757, payout: 18212666, orders: 374, avgCommissionPct: 6.04, roas: 16.55, completionRatePct: 100.0, refundRatePct: 11.81 },
    "TikTok Shop-MCC": { gmv: 102136828, payout: 3814632, orders: 198, avgCommissionPct: 3.73, roas: 26.78, completionRatePct: 61.63, refundRatePct: 1.8 },
    "TikTok Shop-PC": { gmv: 65239518, payout: 1719241, orders: 56, avgCommissionPct: 2.64, roas: 37.95, completionRatePct: 76.63, refundRatePct: 0.0 },
  },
  W17: {
    "Lazada-MCC": { gmv: 292500, payout: 22500, orders: 1, avgCommissionPct: 7.69, roas: 13.0, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 68703312, payout: 4701418, orders: 84, avgCommissionPct: 6.84, roas: 14.61, completionRatePct: 100.0, refundRatePct: 22.61 },
    "Shopee-PC": { gmv: 302706265, payout: 17733230, orders: 330, avgCommissionPct: 5.86, roas: 17.07, completionRatePct: 99.75, refundRatePct: 6.7 },
    "TikTok Shop-MCC": { gmv: 95188919, payout: 4807390, orders: 249, avgCommissionPct: 5.05, roas: 19.8, completionRatePct: 62.16, refundRatePct: 1.55 },
    "TikTok Shop-PC": { gmv: 111098830, payout: 1538445, orders: 80, avgCommissionPct: 1.38, roas: 72.22, completionRatePct: 22.4, refundRatePct: 0.66 },
  },
  W18: {
    "Lazada-MCC": { gmv: 1038400, payout: 84690, orders: 3, avgCommissionPct: 8.16, roas: 12.26, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 47257709, payout: 3473138, orders: 65, avgCommissionPct: 7.35, roas: 13.61, completionRatePct: 81.28, refundRatePct: 12.47 },
    "Shopee-PC": { gmv: 271335117, payout: 16398363, orders: 290, avgCommissionPct: 6.04, roas: 16.55, completionRatePct: 80.69, refundRatePct: 11.36 },
    "TikTok Shop-MCC": { gmv: 73695530, payout: 3076697, orders: 233, avgCommissionPct: 4.17, roas: 23.95, completionRatePct: 53.49, refundRatePct: 0.29 },
    "TikTok Shop-PC": { gmv: 161778521, payout: 38229, orders: 75, avgCommissionPct: 0.02, roas: 4231.83, completionRatePct: 0.41, refundRatePct: 0.0 },
  },
  W19: {
    "Lazada-MCC": { gmv: 268000, payout: 22500, orders: 1, avgCommissionPct: 8.4, roas: 11.91, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 133457912, payout: 8367214, orders: 123, avgCommissionPct: 6.27, roas: 15.95, completionRatePct: 68.83, refundRatePct: 10.55 },
    "Shopee-PC": { gmv: 471329518, payout: 27526998, orders: 506, avgCommissionPct: 5.84, roas: 17.12, completionRatePct: 84.05, refundRatePct: 11.25 },
    "TikTok Shop-MCC": { gmv: 139437102, payout: 2388307, orders: 357, avgCommissionPct: 1.71, roas: 58.38, completionRatePct: 20.99, refundRatePct: 0.57 },
    "TikTok Shop-PC": { gmv: 228119656, payout: 0, orders: 256, avgCommissionPct: 0.0, roas: 0, completionRatePct: 0.0, refundRatePct: 0.0 },
  },
  W20: {
    "Lazada-MCC": { gmv: 278700, payout: 22500, orders: 1, avgCommissionPct: 8.07, roas: 12.39, completionRatePct: null, refundRatePct: null },
    "Shopee-MCC": { gmv: 34086615, payout: 2249656, orders: 38, avgCommissionPct: 6.6, roas: 15.15, completionRatePct: 8.75, refundRatePct: 0.0 },
    "Shopee-PC": { gmv: 161071671, payout: 9488151, orders: 182, avgCommissionPct: 5.89, roas: 16.98, completionRatePct: 29.25, refundRatePct: 2.52 },
  },
};

function weekIndex(week: WeekKey): number {
  return WEEKS.findIndex((w) => w.key === week);
}

function shiftWeek(week: WeekKey, offset: number): WeekKey | null {
  const idx = weekIndex(week) - offset;
  return idx >= 0 ? WEEKS[idx].key : null;
}

type MatchedRow = { key: string; platform: Platform; bu: BU } & WeeklyChannelMetrics;

function matchingRows(week: WeekKey, platform: PlatformFilter, bu: BuFilter): MatchedRow[] {
  const wd = weeklyChannelData[week];
  if (!wd) return [];
  return Object.entries(wd)
    .filter(([key]) => {
      const [p, b] = key.split("-") as [Platform, BU];
      return (platform === "Tất cả" || p === platform) && (bu === "Tất cả" || b === bu);
    })
    .map(([key, v]) => {
      const [p, b] = key.split("-") as [Platform, BU];
      return { key, platform: p, bu: b, ...v };
    });
}

function sumTotals(rows: MatchedRow[]) {
  return {
    gmv: rows.reduce((s, r) => s + r.gmv, 0),
    orders: rows.reduce((s, r) => s + r.orders, 0),
    payout: rows.reduce((s, r) => s + r.payout, 0),
  };
}

export type Delta = { pct: number | null; direction: "up" | "down" | "flat" | null };

function delta(cur: number | null, base: number | null): Delta {
  if (cur == null || base == null || base === 0) return { pct: null, direction: null };
  const pct = ((cur - base) / base) * 100;
  return { pct, direction: pct > 0.5 ? "up" : pct < -0.5 ? "down" : "flat" };
}

export type WeeklyKpiCardData = {
  key: "gmv" | "orders" | "aov" | "payout";
  label: string;
  value: number | null;
  wow: Delta;
  sameLastMonth: Delta;
};

export type WeeklyKpiSummary = {
  weekLabel: string;
  isPartial: boolean;
  hasData: boolean;
  prevWeekLabel: string | null;
  sameLastMonthLabel: string | null;
  cards: WeeklyKpiCardData[];
};

/**
 * 4 thẻ KPI tuần (GMV, Số đơn, AOV, Payout) cho đúng bộ lọc Platform × BU đang chọn, mỗi thẻ có
 * 2 delta: WoW (so tuần trước liền kề) và so cùng tuần tháng trước (lùi 4 tuần — xấp xỉ, vì
 * tháng không chia hết cho tuần).
 */
export function getWeeklyKpis(week: WeekKey, platform: PlatformFilter, bu: BuFilter): WeeklyKpiSummary {
  const meta = WEEKS[weekIndex(week)];
  const rows = matchingRows(week, platform, bu);
  const hasData = rows.length > 0;
  const cur = hasData ? sumTotals(rows) : null;
  const curAov = cur && cur.orders > 0 ? Math.round(cur.gmv / cur.orders) : null;

  const prevWeek = shiftWeek(week, 1);
  const prevRows = prevWeek ? matchingRows(prevWeek, platform, bu) : [];
  const prev = prevRows.length > 0 ? sumTotals(prevRows) : null;
  const prevAov = prev && prev.orders > 0 ? Math.round(prev.gmv / prev.orders) : null;

  const lmWeek = shiftWeek(week, SAME_WEEK_LAST_MONTH_OFFSET);
  const lmRows = lmWeek ? matchingRows(lmWeek, platform, bu) : [];
  const lm = lmRows.length > 0 ? sumTotals(lmRows) : null;
  const lmAov = lm && lm.orders > 0 ? Math.round(lm.gmv / lm.orders) : null;

  const cards: WeeklyKpiCardData[] = [
    {
      key: "gmv",
      label: "GMV",
      value: cur?.gmv ?? null,
      wow: delta(cur?.gmv ?? null, prev?.gmv ?? null),
      sameLastMonth: delta(cur?.gmv ?? null, lm?.gmv ?? null),
    },
    {
      key: "orders",
      label: "Số đơn",
      value: cur?.orders ?? null,
      wow: delta(cur?.orders ?? null, prev?.orders ?? null),
      sameLastMonth: delta(cur?.orders ?? null, lm?.orders ?? null),
    },
    {
      key: "aov",
      label: "AOV (GMV/đơn)",
      value: curAov,
      wow: delta(curAov, prevAov),
      sameLastMonth: delta(curAov, lmAov),
    },
    {
      key: "payout",
      label: "Payout",
      value: cur?.payout ?? null,
      wow: delta(cur?.payout ?? null, prev?.payout ?? null),
      sameLastMonth: delta(cur?.payout ?? null, lm?.payout ?? null),
    },
  ];

  return {
    weekLabel: meta.label,
    isPartial: meta.isPartial,
    hasData,
    prevWeekLabel: prevWeek ? WEEKS[weekIndex(prevWeek)].label : null,
    sameLastMonthLabel: lmWeek ? WEEKS[weekIndex(lmWeek)].label : null,
    cards,
  };
}

export type WeeklyChannelRow = {
  key: string;
  platform: Platform;
  bu: BU;
  gmv: number;
  orders: number;
  payout: number;
  roas: number;
  completionRatePct: number | null;
  refundRatePct: number | null;
  wowGmvPct: number | null;
  sameLastMonthGmvPct: number | null;
};

/** Bảng so sánh theo từng kênh (Platform × BU) khớp bộ lọc, sort GMV giảm dần. */
export function getWeeklyChannelRows(week: WeekKey, platform: PlatformFilter, bu: BuFilter): WeeklyChannelRow[] {
  const rows = matchingRows(week, platform, bu);
  const prevWeek = shiftWeek(week, 1);
  const lmWeek = shiftWeek(week, SAME_WEEK_LAST_MONTH_OFFSET);

  return rows
    .map((r) => {
      const prevRow = prevWeek ? weeklyChannelData[prevWeek]?.[r.key] : undefined;
      const lmRow = lmWeek ? weeklyChannelData[lmWeek]?.[r.key] : undefined;
      return {
        key: r.key,
        platform: r.platform,
        bu: r.bu,
        gmv: r.gmv,
        orders: r.orders,
        payout: r.payout,
        roas: r.roas,
        completionRatePct: r.completionRatePct,
        refundRatePct: r.refundRatePct,
        wowGmvPct: delta(r.gmv, prevRow?.gmv ?? null).pct,
        sameLastMonthGmvPct: delta(r.gmv, lmRow?.gmv ?? null).pct,
      };
    })
    .sort((a, b) => b.gmv - a.gmv);
}

/** Các kênh có |WoW GMV%| vượt ngưỡng — để đưa vào bảng "Cần chú ý", sort theo mức lệch giảm dần. */
export function getWeeklyHighlights(
  week: WeekKey,
  platform: PlatformFilter,
  bu: BuFilter,
  thresholdPct = 15
): WeeklyChannelRow[] {
  return getWeeklyChannelRows(week, platform, bu)
    .filter((r) => r.wowGmvPct != null && Math.abs(r.wowGmvPct) >= thresholdPct)
    .sort((a, b) => Math.abs(b.wowGmvPct!) - Math.abs(a.wowGmvPct!));
}

export type WeeklyTrendSeriesDef = { key: string; label: string; color: string };
export type WeeklyTrendRow = { week: WeekKey; label: string; isPartial: boolean } & Record<
  string,
  number | null | string | boolean
>;

/**
 * Series GMV theo tuần cho line chart, tách theo đúng bộ lọc Platform/BU đang chọn — cùng cơ chế
 * với getTrendSeries ở tab Tổng quan (Platform=Tất cả → tách theo Platform; 1 platform cụ thể →
 * tách theo PC/MCC; cả 2 cụ thể → 1 line). Không có target tuần (chỉ có target theo tháng trong
 * dữ liệu nguồn), nên chart này chỉ có GMV thực tế.
 */
export function getWeeklyTrendSeries(
  platform: PlatformFilter,
  bu: BuFilter
): { series: WeeklyTrendSeriesDef[]; rows: WeeklyTrendRow[] } {
  const singleChannel = platform !== "Tất cả" && bu !== "Tất cả";
  const splitByPlatform = platform === "Tất cả";

  const series: WeeklyTrendSeriesDef[] = singleChannel
    ? [{ key: "value", label: `${platform} ${bu}`, color: platformColor[platform as Platform] }]
    : splitByPlatform
    ? PLATFORMS.map((p) => ({ key: p, label: p, color: platformColor[p] }))
    : (["PC", "MCC"] as BU[]).map((b) => ({ key: b, label: b, color: BU_COLOR[b] }));

  const rows: WeeklyTrendRow[] = WEEKS.map((w) => {
    const wrows = matchingRows(w.key, platform, bu);
    const row: WeeklyTrendRow = { week: w.key, label: w.label, isPartial: w.isPartial };

    if (singleChannel) {
      row.value = wrows.length > 0 ? wrows.reduce((s, r) => s + r.gmv, 0) : null;
    } else {
      const groupKeys = splitByPlatform ? PLATFORMS : (["PC", "MCC"] as BU[]);
      for (const key of groupKeys) {
        const rs = wrows.filter((r) => (splitByPlatform ? r.platform === key : r.bu === key));
        row[key] = rs.length > 0 ? rs.reduce((s, r) => s + r.gmv, 0) : null;
      }
    }
    return row;
  });

  return { series, rows };
}
