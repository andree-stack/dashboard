// Weekly Content Type / Kênh traffic breakdown — nguồn: cùng 5 sheet chi tiết dùng cho
// weekly-data.ts, nhưng đọc thêm cột "Channel" (Shopee) / "Content Type" (TikTok Shop) trên mỗi
// dòng đơn hàng, group theo tuần ISO + BU. Lazada không có cột tương đương nên không có dữ liệu.
// Shopee có ~20 giá trị Channel khác nhau (Facebook, Websites, Instagram, Zalo, ...) — đã gom về 4
// nhóm chính (khớp trafficChannelGmv ở tab Affiliate) + "Khác" để biểu đồ theo tuần không bị vỡ
// layout hoặc đổi màu liên tục. TikTok Shop giữ nguyên 4 giá trị Content Type gốc + "Khác" cho phần
// còn lại (chủ yếu "External Traffic Program" -> đổi tên hiển thị "External Traffic").
import { PLATFORMS, type BU, type BuFilter, type Platform, type PlatformFilter } from "./data";
import type { WeekKey } from "./weekly-data";

export const weeklyContentBreakdown: Record<
  "Shopee" | "TikTok Shop",
  Partial<Record<BU, Partial<Record<WeekKey, Record<string, number>>>>>
> = {
  "Shopee": {
    PC: {
      W6: { "Khác": 11207484, "Websites": 7912640, "Facebook": 7240174, "Shopee Video": 5026091 },
      W7: { "Facebook": 10653534, "Khác": 8007372, "Shopee Video": 7156848, "Websites": 6219477 },
      W8: { "Khác": 14786623, "Websites": 8553706, "Facebook": 7197786, "Shopee Video": 3704509, "Shopee Live": 660335 },
      W9: { "Khác": 16362275, "Facebook": 11110094, "Websites": 8072347, "Shopee Video": 5495776, "Shopee Live": 1109654 },
      W10: { "Facebook": 24979782, "Shopee Video": 22147496, "Khác": 19874613, "Websites": 10926437, "Shopee Live": 2556329 },
      W11: { "Websites": 20939442, "Shopee Video": 20218348, "Facebook": 18627218, "Khác": 12213937, "Shopee Live": 2125460 },
      W12: { "Khác": 32383460, "Facebook": 22623706, "Websites": 19168080, "Shopee Video": 14440253, "Shopee Live": 9251835 },
      W13: { "Khác": 78860182, "Shopee Video": 29846492, "Facebook": 23729660, "Websites": 19550669, "Shopee Live": 7549336 },
      W14: { "Websites": 35448654, "Khác": 28703856, "Facebook": 25967010, "Shopee Video": 24954765, "Shopee Live": 4012053 },
      W15: { "Facebook": 89624355, "Khác": 78388429, "Websites": 68390454, "Shopee Video": 64890839, "Shopee Live": 35696315 },
      W16: { "Khác": 72300973, "Facebook": 65944398, "Shopee Live": 64485634, "Websites": 52858045, "Shopee Video": 45825707 },
      W17: { "Facebook": 79117659, "Shopee Live": 61361591, "Khác": 59641942, "Shopee Video": 51780769, "Websites": 50804304 },
      W18: { "Shopee Live": 82848340, "Facebook": 52683574, "Websites": 46859026, "Shopee Video": 46746721, "Khác": 42197456 },
      W19: { "Khác": 138204950, "Facebook": 111373975, "Websites": 106184466, "Shopee Video": 90973572, "Shopee Live": 24592555 },
      W20: { "Websites": 47951464, "Facebook": 41451361, "Khác": 34087196, "Shopee Video": 19921797, "Shopee Live": 17659853 },
    },
    MCC: {
      W1: { "Facebook": 27240619, "Khác": 22499317, "Shopee Live": 13124194, "Shopee Video": 9167119, "Websites": 5298014 },
      W2: { "Facebook": 6383765, "Shopee Video": 5976459, "Shopee Live": 4432936, "Websites": 4209227, "Khác": 3876025 },
      W3: { "Shopee Video": 7498833, "Shopee Live": 6897194, "Facebook": 6648201, "Websites": 6258943, "Khác": 6163109 },
      W4: { "Websites": 11963370, "Shopee Live": 6611234, "Khác": 5751893, "Facebook": 4101481, "Shopee Video": 538200 },
      W5: { "Shopee Live": 3554402, "Websites": 3352187, "Khác": 3333461, "Facebook": 2498476 },
      W6: { "Facebook": 36002973, "Khác": 20282744, "Shopee Video": 9914361, "Websites": 6927617, "Shopee Live": 3893582 },
      W7: { "Khác": 9091425, "Facebook": 8713522, "Shopee Live": 7072748, "Websites": 5139744, "Shopee Video": 4851883 },
      W8: { "Facebook": 11302323, "Shopee Video": 9700007, "Khác": 7540808, "Websites": 6758074, "Shopee Live": 5945038 },
      W9: { "Facebook": 19386846, "Khác": 10510831, "Shopee Live": 6998663, "Websites": 3297880, "Shopee Video": 2992204 },
      W10: { "Facebook": 35175977, "Khác": 30587059, "Shopee Live": 16780549, "Websites": 15471053, "Shopee Video": 7000508 },
      W11: { "Facebook": 14994210, "Khác": 14842319, "Websites": 7678201, "Shopee Video": 6941776, "Shopee Live": 4846569 },
      W12: { "Khác": 25664052, "Facebook": 17638064, "Websites": 13090185, "Shopee Video": 11536546, "Shopee Live": 10561883 },
      W13: { "Facebook": 19589462, "Websites": 15485652, "Khác": 13840579, "Shopee Video": 7066857, "Shopee Live": 4601060 },
      W14: { "Shopee Live": 10204205, "Facebook": 9492662, "Shopee Video": 8627172, "Websites": 4832070, "Khác": 4589618 },
      W15: { "Websites": 29613119, "Facebook": 29538355, "Shopee Live": 28248723, "Shopee Video": 13362901, "Khác": 7958668 },
      W16: { "Facebook": 25068460, "Khác": 15036924, "Shopee Video": 12078339, "Shopee Live": 10484690, "Websites": 3311498 },
      W17: { "Shopee Live": 23242455, "Khác": 13994191, "Websites": 13630631, "Facebook": 9807086, "Shopee Video": 8028949 },
      W18: { "Shopee Live": 15733230, "Khác": 13905957, "Websites": 8185720, "Facebook": 7287904, "Shopee Video": 2144898 },
      W19: { "Facebook": 57375776, "Websites": 32517044, "Khác": 17090968, "Shopee Video": 15226687, "Shopee Live": 11247437 },
      W20: { "Khác": 11234667, "Websites": 9141166, "Facebook": 7225356, "Shopee Video": 3666420, "Shopee Live": 2819006 },
    },
  },
  "TikTok Shop": {
    PC: {
      W8: { "Khác": 31917000, "External Traffic": 1461700 },
      W9: { "Khác": 7016000 },
      W10: { "Khác": 33553000, "External Traffic": 7208760, "Video": 954700 },
      W11: { "Video": 13249100, "Khác": 5331000, "External Traffic": 3709000, "Showcase": 2129600 },
      W12: { "Video": 7848000, "External Traffic": 2363000, "Khác": 2249000 },
      W13: { "Video": 39152850, "Khác": 38668000, "Showcase": 2855010, "External Traffic": 2299500 },
      W14: { "External Traffic": 20630155, "Khác": 17758000, "Video": 12765884, "Showcase": 2008730 },
      W15: { "Khác": 53417000, "External Traffic": 24829267, "Video": 14490896 },
      W16: { "Khác": 35500000, "External Traffic": 15975713, "Video": 9704189, "Showcase": 4059616 },
      W17: { "Khác": 58372000, "Video": 28963809, "External Traffic": 22403541, "Showcase": 1359480 },
      W18: { "Showcase": 58816357, "Khác": 56125140, "External Traffic": 32539988, "Video": 14297036 },
      W19: { "Khác": 151187624, "Video": 39019789, "External Traffic": 36650155, "Showcase": 1262088 },
    },
    MCC: {
      W1: { "External Traffic": 16804101, "Video": 16437319, "Khác": 6482599, "Showcase": 4330428, "Livestream": 190060 },
      W2: { "Video": 22547331, "External Traffic": 21059678, "Khác": 13549162, "Showcase": 5930502 },
      W3: { "Video": 33693286, "Khác": 11222217, "External Traffic": 11152538, "Showcase": 6221616, "Livestream": 2998000 },
      W4: { "Video": 32465592, "Khác": 10101357, "Showcase": 7482587, "External Traffic": 6597127, "Livestream": 357999 },
      W5: { "Video": 18717859, "External Traffic": 11818854, "Showcase": 9949818, "Khác": 7485985, "Livestream": 926670 },
      W6: { "Video": 28062411, "Showcase": 16241472, "Khác": 11908499, "External Traffic": 9073642, "Livestream": 176299 },
      W7: { "Video": 26713224, "External Traffic": 18939530, "Showcase": 7354957, "Khác": 4748019 },
      W8: { "Video": 29331442, "Khác": 13780968, "Showcase": 12273605, "Livestream": 10335865, "External Traffic": 10081634 },
      W9: { "Video": 28271803, "Khác": 21747786, "External Traffic": 18952951, "Showcase": 8970502 },
      W10: { "Video": 41549007, "External Traffic": 29712572, "Khác": 20236160, "Showcase": 8491009 },
      W11: { "External Traffic": 35740271, "Video": 29765399, "Showcase": 18014541, "Khác": 7672856 },
      W12: { "Khác": 92692541, "Video": 29521842, "Showcase": 22757107, "External Traffic": 19518036, "Livestream": 11928319 },
      W13: { "Khác": 222577650, "Video": 58286906, "External Traffic": 13523082, "Showcase": 7564137, "Livestream": 335999 },
      W14: { "Video": 38654943, "Showcase": 20743358, "External Traffic": 16832852, "Khác": 10715339 },
      W15: { "Video": 43396350, "Khác": 29545023, "External Traffic": 15844470, "Showcase": 14254753, "Livestream": 1518524 },
      W16: { "Video": 43239508, "Khác": 29504944, "External Traffic": 20397616, "Showcase": 8994760 },
      W17: { "Video": 27130721, "External Traffic": 26072692, "Khác": 23474540, "Showcase": 18510966 },
      W18: { "Video": 40302254, "External Traffic": 18235983, "Khác": 9094507, "Showcase": 6062786 },
      W19: { "Video": 48158500, "External Traffic": 46047048, "Khác": 19998165, "Showcase": 12732579, "Livestream": 12500810 },
    },
  },
};

export type PlatformContentBreakdown = {
  platform: Platform;
  dimensionLabel: string;
  items: { label: string; gmv: number }[];
  hasData: boolean;
};

/**
 * Breakdown GMV theo Content Type (TikTok Shop) / Kênh traffic (Shopee) cho tuần + bộ lọc
 * Platform/BU đang chọn. Platform=Tất cả → trả về cả 3 platform (Lazada luôn hasData=false vì
 * sheet nguồn không có cột tương đương). Chọn 1 platform cụ thể → chỉ trả về platform đó.
 */
export function getWeeklyContentBreakdown(
  week: WeekKey,
  platform: PlatformFilter,
  bu: BuFilter
): PlatformContentBreakdown[] {
  const platforms: Platform[] = platform === "Tất cả" ? PLATFORMS : [platform];
  const busToSum: BU[] = bu === "Tất cả" ? ["PC", "MCC"] : [bu];

  return platforms.map((p) => {
    if (p === "Lazada") {
      return { platform: p, dimensionLabel: "—", items: [], hasData: false };
    }
    const dimensionLabel = p === "Shopee" ? "Kênh traffic" : "Content Type";
    const totals = new Map<string, number>();
    for (const b of busToSum) {
      const weekData = weeklyContentBreakdown[p]?.[b]?.[week];
      if (!weekData) continue;
      for (const [label, gmv] of Object.entries(weekData)) {
        totals.set(label, (totals.get(label) ?? 0) + gmv);
      }
    }
    const items = [...totals.entries()]
      .map(([label, gmv]) => ({ label, gmv }))
      .sort((a, b) => b.gmv - a.gmv);
    return { platform: p, dimensionLabel, items, hasData: items.length > 0 };
  });
}
