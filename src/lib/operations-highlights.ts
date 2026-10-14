// Nhận xét dạng văn xuôi (highlights/lowlights + gợi ý cải thiện) cho 4 kênh affiliate chính —
// Shopee PC, Shopee MCC, TikTok Shop PC, TikTok Shop MCC — ở tab Vận hành. Tái dùng toàn bộ hạ
// tầng tính WoW/"so cùng tuần tháng trước" đã có ở weekly-data.ts/affiliate-data.ts, không đọc lại
// raw data. Cố tình KHÔNG đề cập ROAS/Payout theo yêu cầu — chỉ tập trung GMV (loại Seller Creator),
// số lượng creator, GMV theo Live/Video, kênh traffic/content tốt-xấu, và creator đóng góp chính.
import type { BU } from "./data";
import { SAME_WEEK_LAST_MONTH_OFFSET, WEEKS, shiftWeek, weeklyChannelData, type WeekKey } from "./weekly-data";
import { getCreatorRows, getGmvSourceBreakdown } from "./affiliate-data";
import { weeklyContentRaw } from "./weekly-content-data";
import { formatVnd } from "./utils";

/** 2 platform có đủ cột Content Type/Channel để viết nhận xét — Lazada không có cột tương đương. */
type ContentPlatform = "Shopee" | "TikTok Shop";

export type OpsChannel = { platform: ContentPlatform; bu: BU; key: string; label: string };

export const OPS_CHANNELS: OpsChannel[] = [
  { platform: "Shopee", bu: "PC", key: "Shopee-PC", label: "Shopee PC" },
  { platform: "Shopee", bu: "MCC", key: "Shopee-MCC", label: "Shopee MCC" },
  { platform: "TikTok Shop", bu: "PC", key: "TikTok Shop-PC", label: "TikTok Shop PC" },
  { platform: "TikTok Shop", bu: "MCC", key: "TikTok Shop-MCC", label: "TikTok Shop MCC" },
];

function weekLabel(week: WeekKey | null): string {
  if (!week) return "—";
  return WEEKS.find((w) => w.key === week)?.label ?? week;
}

function pct(cur: number | null, base: number | null): number | null {
  if (cur == null || base == null || base === 0) return null;
  return ((cur - base) / base) * 100;
}

/** GMV loại Seller Creator — Shopee: toàn bộ GMV kênh đã là Affiliate-only (sheet nguồn lọc theo
 * Affiliate Username notna() từ đầu); TikTok Shop: Affiliate Creator + MCN, bỏ Seller Creator. */
function exSellerGmv(platform: ContentPlatform, bu: BU, week: WeekKey): number | null {
  const key = `${platform}-${bu}`;
  const full = weeklyChannelData[week]?.[key];
  if (!full) return null;
  if (platform === "Shopee") return full.gmv;
  const rows = getGmvSourceBreakdown("week", week, platform, bu) ?? [];
  return rows.filter((r) => r.label !== "Seller Creator").reduce((s, r) => s + (bu === "PC" ? r.PC : r.MCC), 0);
}

function creatorCount(platform: ContentPlatform, bu: BU, week: WeekKey): number {
  return getCreatorRows("week", week, null, platform, bu).length;
}

type ContentSplit = { label: string; gmv: number };

function liveVideoSplit(platform: ContentPlatform, bu: BU, week: WeekKey): ContentSplit[] {
  const labels = platform === "Shopee" ? ["Shopee Live", "Shopee Video"] : ["Livestream", "Video"];
  const raw = weeklyContentRaw[platform]?.[bu]?.[week] ?? {};
  return labels.map((label) => ({ label, gmv: raw[label] ?? 0 }));
}

type ChannelSwing = { label: string; cur: number; prev: number; pct: number };

/** Kênh traffic (Shopee) / Content Type (TikTok Shop) lệch WoW mạnh nhất theo 2 chiều — dùng để
 * trả lời "kênh nào đang tốt/xấu". Bỏ qua các label chưa có baseline tuần trước (pct vô nghĩa). */
function channelSwings(platform: ContentPlatform, bu: BU, week: WeekKey, compareWeek: WeekKey | null): { best: ChannelSwing | null; worst: ChannelSwing | null } {
  const cur = weeklyContentRaw[platform]?.[bu]?.[week] ?? {};
  const prev = compareWeek ? weeklyContentRaw[platform]?.[bu]?.[compareWeek] ?? {} : {};
  const labels = new Set([...Object.keys(cur), ...Object.keys(prev)]);
  const rows: ChannelSwing[] = [];
  for (const label of labels) {
    const c = cur[label] ?? 0;
    const p = prev[label] ?? 0;
    if (p <= 0) continue;
    rows.push({ label, cur: c, prev: p, pct: ((c - p) / p) * 100 });
  }
  if (rows.length === 0) return { best: null, worst: null };
  rows.sort((a, b) => b.pct - a.pct);
  return { best: rows[0], worst: rows[rows.length - 1] };
}

export type OpsHighlight = {
  channel: OpsChannel;
  week: WeekKey;
  weekLabel: string;
  compareWeekLabel: string;
  sameLastMonthLabel: string;
  gmv: number | null;
  gmvWowPct: number | null;
  gmvSameLastMonthPct: number | null;
  creatorCount: number;
  creatorCountPrev: number | null;
  creatorCountDeltaPct: number | null;
  liveVideo: { label: string; gmv: number; wowPct: number | null }[];
  bestChannel: ChannelSwing | null;
  worstChannel: ChannelSwing | null;
  topCreators: { name: string; gmv: number }[];
  highlights: string[];
  lowlights: string[];
  guidance: string;
};

function money(n: number): string {
  return formatVnd(n);
}

function buildNarrative(h: Omit<OpsHighlight, "highlights" | "lowlights" | "guidance">): { highlights: string[]; lowlights: string[]; guidance: string } {
  const highlights: string[] = [];
  const lowlights: string[] = [];
  const { channel } = h;

  // GMV ex-Seller
  if (h.gmv != null) {
    const wow = h.gmvWowPct;
    const lm = h.gmvSameLastMonthPct;
    const parts: string[] = [];
    if (wow != null) parts.push(`${wow >= 0 ? "tăng" : "giảm"} ${Math.abs(wow).toFixed(1)}% so với tuần trước`);
    if (lm != null) parts.push(`${lm >= 0 ? "tăng" : "giảm"} ${Math.abs(lm).toFixed(1)}% so với cùng tuần tháng trước`);
    const sentence = `GMV (chưa tính Seller Creator) tuần ${h.weekLabel} đạt ${money(h.gmv)}${parts.length ? ", " + parts.join(" và ") : ""}.`;
    const positive = (wow ?? 0) >= 0 && (lm ?? 0) >= 0;
    (positive ? highlights : lowlights).push(sentence);
  } else {
    lowlights.push(`Chưa có dữ liệu GMV cho tuần ${h.weekLabel}.`);
  }

  // Creator count
  if (h.creatorCountDeltaPct != null) {
    const sentence = `Số creator tạo đơn ${h.creatorCountDeltaPct >= 0 ? "tăng" : "giảm"} từ ${h.creatorCountPrev} lên ${h.creatorCount} creator (${h.creatorCountDeltaPct >= 0 ? "+" : ""}${h.creatorCountDeltaPct.toFixed(1)}%).`;
    (h.creatorCountDeltaPct >= 0 ? highlights : lowlights).push(sentence);
  } else if (h.creatorCount > 0) {
    highlights.push(`${h.creatorCount} creator tạo đơn trong tuần ${h.weekLabel}.`);
  }

  // Live/Video
  const liveLabel = channel.platform === "Shopee" ? "Shopee Live" : "Livestream";
  const videoLabel = channel.platform === "Shopee" ? "Shopee Video" : "Video";
  for (const item of h.liveVideo) {
    if (item.wowPct == null) continue;
    const tag = item.label === liveLabel ? "Live" : item.label === videoLabel ? "Video" : item.label;
    const sentence = `GMV từ ${tag} ${item.wowPct >= 0 ? "tăng" : "giảm"} ${Math.abs(item.wowPct).toFixed(1)}% so với tuần trước, đạt ${money(item.gmv)}.`;
    (item.wowPct >= 0 ? highlights : lowlights).push(sentence);
  }

  // Best/worst channel
  if (h.bestChannel && h.bestChannel.pct > 0) {
    highlights.push(`Kênh "${h.bestChannel.label}" đang là điểm sáng, tăng +${h.bestChannel.pct.toFixed(1)}% so với tuần trước (${money(h.bestChannel.cur)}).`);
  }
  if (h.worstChannel && h.worstChannel.pct < 0 && h.worstChannel.label !== h.bestChannel?.label) {
    lowlights.push(`Kênh "${h.worstChannel.label}" đang giảm ${Math.abs(h.worstChannel.pct).toFixed(1)}% so với tuần trước (${money(h.worstChannel.cur)}).`);
  }

  // Top creators
  if (h.topCreators.length > 0) {
    const names = h.topCreators.map((c) => `${c.name} (${money(c.gmv)})`).join(", ");
    highlights.push(`GMV tuần này tập trung chủ yếu ở: ${names}.`);
  }

  // Guidance — rule-based theo tín hiệu xấu nhất đang có.
  const guidanceParts: string[] = [];
  if ((h.gmvWowPct ?? 0) < 0) {
    guidanceParts.push("GMV đang chững lại so với tuần trước");
  }
  if (h.worstChannel && h.worstChannel.pct < -10) {
    guidanceParts.push(`kênh "${h.worstChannel.label}" sụt giảm rõ`);
  }
  if ((h.creatorCountDeltaPct ?? 0) < 0) {
    guidanceParts.push("số creator hoạt động giảm");
  }
  const liveDown = h.liveVideo.find((i) => i.label === liveLabel && (i.wowPct ?? 0) < -5);
  const videoDown = h.liveVideo.find((i) => i.label === videoLabel && (i.wowPct ?? 0) < -5);

  let guidance: string;
  if (guidanceParts.length === 0) {
    guidance = h.bestChannel
      ? `Đang đi đúng hướng — nên nhân rộng cách làm đang hiệu quả ở kênh "${h.bestChannel.label}" và tiếp tục hỗ trợ ${h.topCreators[0]?.name ?? "các creator top"} duy trì nhịp nội dung.`
      : "Đang đi đúng hướng — duy trì nhịp nội dung hiện tại và tiếp tục theo dõi tuần tới.";
  } else {
    const actions: string[] = [];
    if (liveDown) actions.push("tăng tần suất livestream");
    if (videoDown) actions.push("đẩy thêm video ngắn mới");
    if ((h.creatorCountDeltaPct ?? 0) < 0) actions.push("chủ động re-engage lại nhóm creator đã ngừng hoạt động");
    if (h.worstChannel && h.worstChannel.pct < -10) actions.push(`rà soát lại nội dung/ngân sách ở kênh "${h.worstChannel.label}"`);
    if (actions.length === 0) actions.push("rà soát lại nội dung và ngân sách phân bổ giữa các kênh");
    guidance = `${guidanceParts.join(", ")} — nên ${actions.join(", ")} trong tuần tới.`;
  }

  return { highlights, lowlights, guidance };
}

/**
 * Nhận xét highlights/lowlights + gợi ý cải thiện cho 4 kênh affiliate chính, tính cho `week`
 * (mặc định tuần mới nhất đã trọn 7 ngày) so với tuần liền trước (WoW) và cùng tuần tháng trước.
 */
export function getOperationsHighlights(week: WeekKey): OpsHighlight[] {
  const compareWeek = shiftWeek(week, 1);
  const lmWeek = shiftWeek(week, SAME_WEEK_LAST_MONTH_OFFSET);

  return OPS_CHANNELS.map((channel) => {
    const gmv = exSellerGmv(channel.platform, channel.bu, week);
    const gmvCmp = compareWeek ? exSellerGmv(channel.platform, channel.bu, compareWeek) : null;
    const gmvLm = lmWeek ? exSellerGmv(channel.platform, channel.bu, lmWeek) : null;

    const curCreators = creatorCount(channel.platform, channel.bu, week);
    const cmpCreators = compareWeek ? creatorCount(channel.platform, channel.bu, compareWeek) : null;

    const curLiveVideo = liveVideoSplit(channel.platform, channel.bu, week);
    const cmpLiveVideo = compareWeek ? liveVideoSplit(channel.platform, channel.bu, compareWeek) : [];
    const liveVideo = curLiveVideo.map((item) => {
      const prevItem = cmpLiveVideo.find((p) => p.label === item.label);
      return { label: item.label, gmv: item.gmv, wowPct: prevItem ? pct(item.gmv, prevItem.gmv) : null };
    });

    const { best, worst } = channelSwings(channel.platform, channel.bu, week, compareWeek);

    const topCreators = getCreatorRows("week", week, null, channel.platform, channel.bu)
      .slice(0, 3)
      .map((c) => ({ name: c.name, gmv: c.gmv }));

    const base: Omit<OpsHighlight, "highlights" | "lowlights" | "guidance"> = {
      channel,
      week,
      weekLabel: weekLabel(week),
      compareWeekLabel: weekLabel(compareWeek),
      sameLastMonthLabel: weekLabel(lmWeek),
      gmv,
      gmvWowPct: pct(gmv, gmvCmp),
      gmvSameLastMonthPct: pct(gmv, gmvLm),
      creatorCount: curCreators,
      creatorCountPrev: cmpCreators,
      creatorCountDeltaPct: cmpCreators && cmpCreators > 0 ? pct(curCreators, cmpCreators) : null,
      liveVideo,
      bestChannel: best,
      worstChannel: worst,
      topCreators,
    };

    return { ...base, ...buildNarrative(base) };
  });
}
