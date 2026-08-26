// Weekly Content Type / Kênh traffic breakdown — nguồn: cùng 5 sheet chi tiết dùng cho
// weekly-data.ts, đọc thêm cột "Channel" (Shopee) / "Content Type" (TikTok Shop) trên mỗi dòng
// đơn hàng, group theo tuần ISO + BU — giữ nguyên giá trị gốc (không gộp trước), việc gộp thành
// "Khác" chỉ làm ở tầng đọc (bucketize) để vẫn giữ được chi tiết cho tooltip. Lazada không có cột
// tương đương nên không có dữ liệu — không hiển thị trong section này.
import type { BU, BuFilter, PlatformFilter } from "./data";
import type { WeekKey } from "./weekly-data";

type ContentPlatform = "Shopee" | "TikTok Shop";

export const weeklyContentRaw: Record<
  ContentPlatform,
  Partial<Record<BU, Partial<Record<WeekKey, Record<string, number>>>>>
> = {
  "Shopee": {
    PC: {
      W6: { "Facebook": 7240174, "Google Search": 1633296, "Others": 6846188, "Shopee Video": 5026091, "Threads": 2044000, "Websites": 7912640, "Zalo": 684000 },
      W7: { "Code Sharing": 442890, "Facebook": 10653534, "Google Search": 474810, "Instagram": 343998, "Others": 6745674, "Shopee Video": 7156848, "Websites": 6219477 },
      W8: { "Code Sharing": 529535, "Facebook": 7197786, "Google Search": 427890, "Instagram": 634410, "Others": 8467354, "Shopee Live": 660335, "Shopee Video": 3704509, "Websites": 8553706, "YouTube": 2555000, "Zalo": 2172434 },
      W9: { "Code Sharing": 1137182, "Facebook": 11110094, "Google Search": 956544, "Instagram": 578721, "KAKAOTALK": 786180, "Others": 11728817, "Shopee Live": 1109654, "Shopee Video": 5495776, "Telegram": 581271, "Websites": 8072347, "Zalo": 593560 },
      W10: { "Facebook": 24979782, "Instagram": 7049047, "Others": 10638041, "Shopee Live": 2556329, "Shopee Video": 22147496, "TikTok": 624019, "Websites": 10926437, "Zalo": 1563506 },
      W11: { "Facebook": 18627218, "Google Search": 784540, "Instagram": 1894820, "Others": 9534577, "ShopbackApp": 0, "Shopee Live": 2125460, "Shopee Video": 20218348, "Websites": 20939442 },
      W12: { "EdgeBrowser": 1165600, "Facebook": 22623706, "Google Search": 4948320, "Instagram": 3099697, "Others": 19388024, "ShopbackApp": 905418, "Shopee Live": 9251835, "Shopee Video": 14440253, "Threads": 604000, "Websites": 19168080, "YouTube": 1043409, "Zalo": 1228992 },
      W13: { "Facebook": 23729660, "Google Search": 2112180, "Instagram": 4668000, "Others": 66158179, "Pinterest": 1165600, "ShopbackApp": 1625608, "Shopee Live": 7549336, "Shopee Video": 29846492, "Twitter": 463300, "Websites": 19550669, "YouTube": 637000, "Zalo": 2030315 },
      W14: { "Facebook": 25967010, "Google Search": 945772, "Instagram": 2289230, "Others": 22239610, "ShopbackApp": 1972243, "Shopee Live": 4012053, "Shopee Video": 24954765, "Twitter": 373248, "Websites": 35448654, "Zalo": 883753 },
      W15: { "Capcut": 677061, "Code Sharing": 1164634, "Facebook": 89624355, "Google Search": 2766974, "Instagram": 7670014, "Others": 44117643, "ShopbackApp": 4606304, "Shopee Live": 35696315, "Shopee Video": 64890839, "TikTok": 3222390, "Twitter": 534204, "Websites": 68390454, "YouTube": 2875827, "Zalo": 10753378 },
      W16: { "Code Sharing": 3156643, "EdgeBrowser": 377522, "Facebook": 65944398, "FreeTube": 291060, "Google Search": 2359239, "Instagram": 6713604, "Messenger": 738720, "Others": 47243735, "Pinterest": 350484, "ShopbackApp": 1324776, "Shopee Live": 64485634, "Shopee Video": 45825707, "TikTok": 555291, "Twitter": 703440, "Websites": 52858045, "YouTube": 1141349, "Zalo": 7345110 },
      W17: { "Capcut": 1224427, "Code Sharing": 655695, "Facebook": 79117659, "Google Search": 981530, "Instagram": 4381405, "Others": 36785509, "ShopbackApp": 2592300, "Shopee Live": 61361591, "Shopee Video": 51780769, "TikTok": 4225832, "Websites": 50804304, "YouTube": 1453191, "Zalo": 7342053 },
      W18: { "Facebook": 52683574, "Google Search": 1267195, "Instagram": 7086355, "Others": 23287097, "Shopee Live": 82848340, "Shopee Video": 46746721, "TikTok": 1954370, "Twitter": 692550, "Websites": 46859026, "YouTube": 1254544, "Zalo": 6655345 },
      W19: { "Capcut": 779760, "Code Sharing": 1187502, "Facebook": 108476819, "Google Search": 13017496, "Instagram": 7571466, "Others": 83108040, "ShopbackApp": 11619690, "Shopee Live": 24592555, "Shopee Video": 90408273, "TikTok": 6431537, "Websites": 103505294, "YouTube": 3478862, "Zalo": 11010597 },
      W20: { "Code Sharing": 1942041, "Facebook": 75788093, "Google Search": 5948559, "Instagram": 4198002, "Others": 38066182, "Pinterest": 2418124, "ShopbackApp": 1781171, "Shopee Live": 30946631, "Shopee Video": 45745342, "TikTok": 2442302, "Trassion": 347448, "Websites": 82400080, "YouTube": 4084535, "Zalo": 10007506 },
      W21: { "Capcut": 593715, "Code Sharing": 675717, "Facebook": 56540235, "Google Search": 8713288, "Instagram": 5556609, "Line": 1168811, "Messenger": 2183745, "Others": 55221885, "ShopbackApp": 1764487, "Shopee Live": 25325762, "Shopee Video": 48528475, "Threads": 889098, "TikTok": 10420451, "Websites": 51861814, "YouTube": 1641207, "Zalo": 9949563 },
    },
    MCC: {
      W1: { "Facebook": 27240619, "Google Search": 0, "Instagram": 4565849, "Others": 11564673, "ShopbackApp": 4812353, "Shopee Live": 13124194, "Shopee Video": 9167119, "Twitter": 0, "Websites": 5298014, "Zalo": 1556442 },
      W2: { "Facebook": 6383765, "Google Search": 210033, "Instagram": 1566432, "Others": 1845410, "Shopee Live": 4432936, "Shopee Video": 5976459, "Twitter": 0, "Websites": 4209227, "Zalo": 254150 },
      W3: { "Code Sharing": 0, "Facebook": 6648201, "Others": 5712014, "Pinterest": 0, "ShopbackApp": 209625, "Shopee Live": 6897194, "Shopee Video": 7498833, "Threads": 0, "Twitter": 0, "Websites": 6258943, "Zalo": 241470 },
      W4: { "Facebook": 4101481, "Instagram": 0, "Others": 3630387, "Shopee Live": 6611234, "Shopee Video": 538200, "Twitter": 1830906, "Websites": 11963370, "Zalo": 290600 },
      W5: { "Code Sharing": 0, "Facebook": 2498476, "Others": 3333461, "ShopbackApp": 0, "Shopee Live": 3554402, "Shopee Video": 0, "Websites": 3352187 },
      W6: { "Facebook": 36002973, "Instagram": 2527688, "Others": 7750216, "ShopbackApp": 9791640, "Shopee Live": 3893582, "Shopee Video": 9914361, "Websites": 6927617, "Zalo": 213200 },
      W7: { "Facebook": 8713522, "Google Search": 231376, "Instagram": 260000, "Others": 7858851, "ShopbackApp": 741198, "Shopee Live": 7072748, "Shopee Video": 4851883, "Websites": 5139744 },
      W8: { "Code Sharing": 213200, "Facebook": 11302323, "Instagram": 2549664, "Others": 1932478, "Shopee Live": 5945038, "Shopee Video": 9700007, "Telegram": 0, "Twitter": 2399200, "Websites": 6758074, "Zalo": 446266 },
      W9: { "Capcut": 0, "Facebook": 19386846, "Instagram": 1855674, "Others": 8655157, "Shopee Live": 6998663, "Shopee Video": 2992204, "Websites": 3297880, "Zalo": 0 },
      W10: { "Facebook": 35175977, "Google Search": 1846205, "Instagram": 1281412, "Others": 15998849, "ShopbackApp": 2160051, "Shopee Live": 16780549, "Shopee Video": 7000508, "Websites": 15471053, "YouTube": 866193, "Zalo": 8434349 },
      W11: { "Facebook": 14994210, "Instagram": 1621680, "Others": 13001339, "ShopbackApp": 0, "Shopee Live": 4846569, "Shopee Video": 6941776, "Websites": 7678201, "WhatsApp": 219300, "Zalo": 0 },
      W12: { "Code Sharing": 1015540, "Facebook": 17638064, "Google Search": 1392606, "Others": 11333154, "ShopbackApp": 6553808, "Shopee Live": 10561883, "Shopee Video": 11536546, "Threads": 248170, "TikTok": 3507134, "Websites": 13090185, "Zalo": 1613640 },
      W13: { "Facebook": 19589462, "Google Search": 0, "Others": 13616979, "Shopee Live": 4601060, "Shopee Video": 7066857, "Websites": 15485652, "Zalo": 223600 },
      W14: { "Facebook": 9492662, "Instagram": 194999, "Others": 4394619, "Shopee Live": 10204205, "Shopee Video": 8627172, "Websites": 4832070 },
      W15: { "Facebook": 29538355, "Instagram": 0, "Messenger": 1369544, "Others": 3350970, "ShopbackApp": 1260093, "Shopee Live": 28248723, "Shopee Video": 13362901, "Websites": 29613119, "Zalo": 1978061 },
      W16: { "Code Sharing": 229665, "Facebook": 25068460, "Google Search": 0, "Instagram": 3648288, "Others": 9179659, "Shopee Live": 10484690, "Shopee Video": 12078339, "Websites": 3311498, "YouTube": 1979312 },
      W17: { "Code Sharing": 2016553, "Facebook": 9807086, "Instagram": 2829043, "Others": 7564051, "Shopee Live": 23242455, "Shopee Video": 8028949, "Trassion": 0, "Websites": 13630631, "Zalo": 1584544 },
      W18: { "Facebook": 7287904, "Others": 5995008, "Shopee Live": 15733230, "Shopee Video": 2144898, "Twitter": 0, "Websites": 8185720, "YouTube": 3149947, "Zalo": 4761002 },
      W19: { "Code Sharing": 0, "Facebook": 54028310, "Google Search": 476271, "Instagram": 725563, "Others": 5718094, "ShopbackApp": 3428815, "Shopee Live": 11247437, "Shopee Video": 15226687, "Threads": 918521, "TikTok": 389584, "Websites": 32517044, "YouTube": 221000, "Zalo": 3826046 },
      W20: { "Code Sharing": 1270676, "Facebook": 8919440, "Google Search": 5940358, "Instagram": 2278425, "Others": 11222005, "Shopee Live": 6087638, "Shopee Video": 3661339, "TikTok": 1450483, "Websites": 9618202, "YouTube": 212380, "Zalo": 0 },
      W21: { "Facebook": 16016102, "Google Search": 0, "Instagram": 2512991, "Others": 5918831, "Shopee Live": 19063247, "Shopee Video": 3872734, "Websites": 5761124, "Zalo": 215800 },
    },
  },
  "TikTok Shop": {
    PC: {
      W8: { "(Không có Content Type)": 31917000, "External Traffic": 1461700 },
      W9: { "(Không có Content Type)": 7016000 },
      W10: { "(Không có Content Type)": 33553000, "External Traffic": 7208760, "Video": 954700 },
      W11: { "Video": 13249100, "(Không có Content Type)": 5331000, "External Traffic": 3709000, "Showcase": 2129600 },
      W12: { "Video": 7848000, "External Traffic": 2363000, "(Không có Content Type)": 2249000 },
      W13: { "Video": 39152850, "(Không có Content Type)": 38668000, "Showcase": 2855010, "External Traffic": 2299500 },
      W14: { "External Traffic": 20630155, "(Không có Content Type)": 17758000, "Video": 12765884, "Showcase": 2008730 },
      W15: { "(Không có Content Type)": 53417000, "External Traffic": 24829267, "Video": 14490896 },
      W16: { "(Không có Content Type)": 35500000, "External Traffic": 15975713, "Video": 9704189, "Showcase": 4059616 },
      W17: { "(Không có Content Type)": 58372000, "Video": 28963809, "External Traffic": 22403541, "Showcase": 1359480 },
      W18: { "Showcase": 58816357, "(Không có Content Type)": 56125140, "External Traffic": 32539988, "Video": 14297036 },
      W19: { "(Không có Content Type)": 151187624, "Video": 39019789, "External Traffic": 36650155, "Showcase": 1262088 },
    },
    MCC: {
      W1: { "External Traffic": 16804101, "Video": 16437319, "(Không có Content Type)": 6482599, "Showcase": 4330428, "Livestream": 190060 },
      W2: { "Video": 22547331, "External Traffic": 21059678, "(Không có Content Type)": 13549162, "Showcase": 5930502 },
      W3: { "Video": 33693286, "(Không có Content Type)": 11222217, "External Traffic": 11152538, "Showcase": 6221616, "Livestream": 2998000 },
      W4: { "Video": 32465592, "(Không có Content Type)": 10101357, "Showcase": 7482587, "External Traffic": 6597127, "Livestream": 357999 },
      W5: { "Video": 18717859, "External Traffic": 11818854, "Showcase": 9949818, "(Không có Content Type)": 7485985, "Livestream": 926670 },
      W6: { "Video": 28062411, "Showcase": 16241472, "(Không có Content Type)": 11908499, "External Traffic": 9073642, "Livestream": 176299 },
      W7: { "Video": 26713224, "External Traffic": 18939530, "Showcase": 7354957, "(Không có Content Type)": 4748019 },
      W8: { "Video": 29331442, "(Không có Content Type)": 13780968, "Showcase": 12273605, "Livestream": 10335865, "External Traffic": 10081634 },
      W9: { "Video": 28271803, "(Không có Content Type)": 21747786, "External Traffic": 18952951, "Showcase": 8970502 },
      W10: { "Video": 41549007, "External Traffic": 29712572, "(Không có Content Type)": 20236160, "Showcase": 8491009 },
      W11: { "External Traffic": 35740271, "Video": 29765399, "Showcase": 18014541, "(Không có Content Type)": 7672856 },
      W12: { "(Không có Content Type)": 92692541, "Video": 29521842, "Showcase": 22757107, "External Traffic": 19518036, "Livestream": 11928319 },
      W13: { "(Không có Content Type)": 222577650, "Video": 58286906, "External Traffic": 13523082, "Showcase": 7564137, "Livestream": 335999 },
      W14: { "Video": 38654943, "Showcase": 20743358, "External Traffic": 16832852, "(Không có Content Type)": 10715339 },
      W15: { "Video": 43396350, "(Không có Content Type)": 29545023, "External Traffic": 15844470, "Showcase": 14254753, "Livestream": 1518524 },
      W16: { "Video": 43239508, "(Không có Content Type)": 29504944, "External Traffic": 20397616, "Showcase": 8994760 },
      W17: { "Video": 27130721, "External Traffic": 26072692, "(Không có Content Type)": 23474540, "Showcase": 18510966 },
      W18: { "Video": 40302254, "External Traffic": 18235983, "(Không có Content Type)": 9094507, "Showcase": 6062786 },
      W19: { "Video": 48158500, "External Traffic": 46047048, "(Không có Content Type)": 19998165, "Showcase": 12732579, "Livestream": 12500810 },
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

function sumRaw(platform: ContentPlatform, busToSum: BU[], week: WeekKey): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const b of busToSum) {
    const weekData = weeklyContentRaw[platform]?.[b]?.[week];
    if (!weekData) continue;
    for (const [label, gmv] of Object.entries(weekData)) {
      totals[label] = (totals[label] ?? 0) + gmv;
    }
  }
  return totals;
}

/** Gom các label ngoài top-4 của platform vào 1 dòng "Khác", giữ chi tiết gốc để hiện tooltip. */
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
 * Breakdown GMV theo Content Type (TikTok Shop) / Kênh traffic (Shopee) cho tuần + bộ lọc
 * Platform/BU đang chọn. Lazada không có cột tương đương nên không xuất hiện trong danh sách trả
 * về (kể cả khi Platform=Tất cả) — nếu người dùng lọc đích danh Lazada, trả về mảng rỗng.
 */
export function getWeeklyContentBreakdown(
  week: WeekKey,
  platform: PlatformFilter,
  bu: BuFilter
): PlatformContentBreakdown[] {
  const platforms: ContentPlatform[] =
    platform === "Tất cả" ? ["Shopee", "TikTok Shop"] : platform === "Lazada" ? [] : [platform];
  const busToSum: BU[] = bu === "Tất cả" ? ["PC", "MCC"] : [bu];

  return platforms.map((p) => {
    const dimensionLabel = p === "Shopee" ? "Kênh traffic" : "Content Type";
    const mainLabels = p === "Shopee" ? SHOPEE_MAIN_LABELS : TTS_MAIN_LABELS;
    const items = bucketize(sumRaw(p, busToSum, week), mainLabels);
    return { platform: p, dimensionLabel, items, hasData: items.length > 0 };
  });
}
