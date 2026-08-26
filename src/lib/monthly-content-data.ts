// Content Type / Kênh traffic theo THÁNG — bản clone của weekly-content-data.ts cho tab Tổng quan,
// cùng nguồn (5 sheet chi tiết) và cùng cách bucketize (top-4 + "Khác" giữ chi tiết gốc cho
// tooltip), chỉ khác group theo Tháng (T4–T8) thay vì theo Tuần. Lazada không có cột tương đương.
import type { BU, BuFilter, MonthKey, PlatformFilter } from "./data";

type ContentPlatform = "Shopee" | "TikTok Shop";

export const monthlyContentRaw: Record<
  "Shopee" | "TikTok Shop",
  Partial<Record<BU, Partial<Record<MonthKey, Record<string, number>>>>>
> = {
  "Shopee": {
    PC: {
      T5: { "Code Sharing": 2109607, "Facebook": 36201588, "Google Search": 3492540, "Instagram": 1557129, "KAKAOTALK": 786180, "Others": 33788033, "Shopee Live": 1769989, "Shopee Video": 21383224, "Telegram": 581271, "Threads": 2044000, "Websites": 30758170, "YouTube": 2555000, "Zalo": 3449994 },
      T6: { "EdgeBrowser": 1165600, "Facebook": 93771464, "Google Search": 7845040, "Instagram": 19000794, "Others": 113833107, "Pinterest": 1165600, "ShopbackApp": 4164026, "Shopee Live": 22645530, "Shopee Video": 91364809, "Threads": 604000, "TikTok": 624019, "Twitter": 463300, "Websites": 81544502, "YouTube": 1680409, "Zalo": 4822813 },
      T7: { "Capcut": 1901488, "Code Sharing": 4976972, "EdgeBrowser": 377522, "Facebook": 286672253, "FreeTube": 291060, "Google Search": 7053515, "Instagram": 19363755, "Messenger": 738720, "Others": 157483480, "Pinterest": 350484, "ShopbackApp": 8862623, "Shopee Live": 228704169, "Shopee Video": 209275816, "TikTok": 9461603, "Twitter": 1610892, "Websites": 218306947, "YouTube": 5470367, "Zalo": 27883514 },
      T8: { "Capcut": 1373475, "Code Sharing": 3805260, "Facebook": 263658792, "Google Search": 28946538, "Instagram": 23813700, "Line": 1168811, "Messenger": 2183745, "Others": 184471935, "Pinterest": 2418124, "ShopbackApp": 15165348, "Shopee Live": 99402142, "Shopee Video": 204892855, "Threads": 889098, "TikTok": 19790570, "Trassion": 347448, "Twitter": 692550, "Websites": 262860850, "YouTube": 10459148, "Zalo": 36063791 },
    },
    MCC: {
      T4: { "Code Sharing": 0, "Facebook": 45104519, "Google Search": 210033, "Instagram": 6132281, "Others": 24879133, "Pinterest": 0, "ShopbackApp": 5021978, "Shopee Live": 34619960, "Shopee Video": 23180611, "Threads": 0, "Twitter": 1830906, "Websites": 31081741, "Zalo": 2342662 },
      T5: { "Capcut": 0, "Code Sharing": 213200, "Facebook": 77173687, "Google Search": 231376, "Instagram": 7193026, "Others": 27403514, "ShopbackApp": 10532838, "Shopee Live": 23910031, "Shopee Video": 27458455, "Telegram": 0, "Twitter": 2399200, "Websites": 22123315, "Zalo": 659466 },
      T6: { "Code Sharing": 1015540, "Facebook": 87616113, "Google Search": 3238811, "Instagram": 2903092, "Others": 54409321, "ShopbackApp": 8713859, "Shopee Live": 40787237, "Shopee Video": 33912319, "Threads": 248170, "TikTok": 3507134, "Websites": 53823898, "WhatsApp": 219300, "YouTube": 866193, "Zalo": 10271589 },
      T7: { "Code Sharing": 2246218, "Facebook": 77975252, "Google Search": 0, "Instagram": 6672330, "Messenger": 1369544, "Others": 28317524, "ShopbackApp": 1260093, "Shopee Live": 80506992, "Shopee Video": 40933688, "Trassion": 0, "Websites": 51493341, "YouTube": 5129259, "Zalo": 6834741 },
      T8: { "Code Sharing": 1270676, "Facebook": 81964667, "Google Search": 6416629, "Instagram": 5516979, "Others": 24566713, "ShopbackApp": 3428815, "Shopee Live": 39807457, "Shopee Video": 24702699, "Threads": 918521, "TikTok": 1840067, "Twitter": 0, "Websites": 53877260, "YouTube": 433380, "Zalo": 5530712 },
    },
  },
  "TikTok Shop": {
    PC: {
      T5: { "(Không có Content Type)": 38933000, "External Traffic": 1461700 },
      T6: { "(Không có Content Type)": 89458000, "Video": 62975303, "External Traffic": 19330165, "Showcase": 4984610 },
      T7: { "(Không có Content Type)": 197266140, "External Traffic": 93319750, "Video": 75430758, "Showcase": 65587337 },
      T8: { "(Không có Content Type)": 166119524, "External Traffic": 103276967, "Showcase": 5011644, "Video": 110442683 },
    },
    MCC: {
      T4: { "Video": 116046743, "External Traffic": 64651238, "(Không có Content Type)": 47250731, "Showcase": 30941426, "Livestream": 3546059 },
      T5: { "Video": 120193524, "External Traffic": 59828817, "(Không có Content Type)": 53775861, "Showcase": 47814061, "Livestream": 11438834 },
      T6: { "(Không có Content Type)": 347333442, "Video": 171432533, "External Traffic": 104092208, "Showcase": 62808210, "Livestream": 12264318 },
      T7: { "Video": 168850671, "(Không có Content Type)": 95065450, "External Traffic": 89090656, "Showcase": 61298461, "Livestream": 1518524 },
      T8: { "(Không có Content Type)": 33936831, "External Traffic": 117914876, "Livestream": 20066103, "Showcase": 25728931, "Video": 140228092 },
    },
  },
};

const SHOPEE_MAIN_LABELS = ["Facebook", "Websites", "Shopee Video", "Shopee Live"];
const TTS_MAIN_LABELS = ["Video", "External Traffic", "Showcase", "Livestream"];

export type ContentDetailItem = { label: string; gmv: number };
export type ContentBreakdownItem = { label: string; gmv: number; detail?: ContentDetailItem[] };
export type PlatformContentBreakdown = {
  platform: ContentPlatform;
  dimensionLabel: string;
  items: ContentBreakdownItem[];
  hasData: boolean;
};

function sumRaw(platform: ContentPlatform, busToSum: BU[], month: MonthKey): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const b of busToSum) {
    const monthData = monthlyContentRaw[platform]?.[b]?.[month];
    if (!monthData) continue;
    for (const [label, gmv] of Object.entries(monthData)) {
      totals[label] = (totals[label] ?? 0) + gmv;
    }
  }
  return totals;
}

function bucketize(raw: Record<string, number>, mainLabels: string[]): ContentBreakdownItem[] {
  const items: ContentBreakdownItem[] = [];
  let khacGmv = 0;
  const khacDetail: ContentDetailItem[] = [];

  for (const label of mainLabels) {
    if (raw[label] != null) items.push({ label, gmv: raw[label] });
  }
  for (const [label, gmv] of Object.entries(raw)) {
    if (!mainLabels.includes(label)) {
      khacGmv += gmv;
      khacDetail.push({ label, gmv });
    }
  }
  if (khacDetail.length > 0) {
    khacDetail.sort((a, b) => b.gmv - a.gmv);
    items.push({ label: "Khác", gmv: khacGmv, detail: khacDetail });
  }
  return items.sort((a, b) => b.gmv - a.gmv);
}

/**
 * Breakdown GMV theo Content Type (TikTok Shop) / Kênh traffic (Shopee) cho tháng + bộ lọc
 * Platform/BU đang chọn. Lazada không có cột tương đương nên không xuất hiện trong danh sách.
 */
export function getMonthlyContentBreakdown(
  month: MonthKey,
  platform: PlatformFilter,
  bu: BuFilter
): PlatformContentBreakdown[] {
  const platforms: ContentPlatform[] =
    platform === "Tất cả" ? ["Shopee", "TikTok Shop"] : platform === "Lazada" ? [] : [platform];
  const busToSum: BU[] = bu === "Tất cả" ? ["PC", "MCC"] : [bu];

  return platforms.map((p) => {
    const dimensionLabel = p === "Shopee" ? "Kênh traffic" : "Content Type";
    const mainLabels = p === "Shopee" ? SHOPEE_MAIN_LABELS : TTS_MAIN_LABELS;
    const items = bucketize(sumRaw(p, busToSum, month), mainLabels);
    return { platform: p, dimensionLabel, items, hasData: items.length > 0 };
  });
}
