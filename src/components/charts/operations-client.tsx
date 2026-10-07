"use client";

import { useMemo } from "react";
import { TrendingUp, TrendingDown, Lightbulb } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import { usePreferences } from "@/components/preferences-context";
import { BarList } from "@/components/charts/bar-list";
import { MONTHS, monthlyChannelOps, getChannelOps, platformColor, type Platform, type BU } from "@/lib/data";
import { getOrderStatusBreakdown } from "@/lib/affiliate-data";
import { getOperationsHighlights } from "@/lib/operations-highlights";
import { translateMonthLabel } from "@/lib/i18n";
import { formatPercent, cn } from "@/lib/utils";

function channelRows(month: ReturnType<typeof useFilters>["month"]) {
  const monthData = monthlyChannelOps[month];
  if (!monthData) return [];
  return Object.entries(monthData).map(([key, v]) => {
    const [platform, bu] = key.split("-") as [Platform, BU];
    return { platform, bu, channel: `${platform} ${bu}`, ...v };
  });
}

function NoOperationsData({ month }: { month: string }) {
  const { t } = usePreferences();
  return (
    <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
      {month} {t("chưa có dữ liệu Payout/ROAS chi tiết (tháng chưa diễn ra hoặc chưa trích xuất).")}
    </p>
  );
}

export function PayoutSection() {
  const { month, platform } = useFilters();
  const { lang, formatMoney } = usePreferences();
  const monthLabel = translateMonthLabel(MONTHS.find((m) => m.key === month)?.label ?? month, lang);
  const rows = useMemo(
    () =>
      channelRows(month)
        .slice()
        .sort((a, b) => b.payout - a.payout)
        .map((r) => ({
          name: r.channel,
          value: r.payout,
          color: platformColor[r.platform],
          faded: platform !== "Tất cả" && platform !== r.platform,
        })),
    [month, platform]
  );
  if (rows.length === 0) return <NoOperationsData month={monthLabel} />;
  return <BarList data={rows} valueFormatter={formatMoney} />;
}

export function RoasSection() {
  const { month, platform } = useFilters();
  const { lang } = usePreferences();
  const monthLabel = translateMonthLabel(MONTHS.find((m) => m.key === month)?.label ?? month, lang);
  const rows = useMemo(
    () =>
      channelRows(month)
        .slice()
        .sort((a, b) => b.roas - a.roas)
        .map((r) => ({
          name: `${r.channel} · Comm ${formatPercent(r.avgCommissionPct, 2)}`,
          value: r.roas,
          color: platformColor[r.platform],
          faded: platform !== "Tất cả" && platform !== r.platform,
        })),
    [month, platform]
  );
  if (rows.length === 0) return <NoOperationsData month={monthLabel} />;
  return <BarList data={rows} valueFormatter={(v) => `${v.toFixed(1)}x`} />;
}

export function OperationsSummary() {
  const { month, platform, bu } = useFilters();
  const { t, formatMoney } = usePreferences();
  const ops = getChannelOps(month, platform, bu);
  const rows = channelRows(month).filter(
    (r) => (platform === "Tất cả" || r.platform === platform) && (bu === "Tất cả" || r.bu === bu)
  );

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          {t("Tổng Payout")}
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {ops.hasData ? formatMoney(rows.reduce((s, r) => s + r.payout, 0)) : "—"}
        </div>
      </div>
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          {t("ROAS bình quân (blend)")}
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {ops.hasData ? `${ops.roas.toFixed(1)}x` : "—"}
        </div>
      </div>
      <div className="bg-surface p-4">
        <div className="text-[11px] font-bold uppercase tracking-wide text-ink-3">
          {t("Số kênh đang chạy")}
        </div>
        <div className="tabular mt-1 text-[20px] font-bold text-ink-1">
          {ops.hasData ? rows.length : "—"}
        </div>
      </div>
    </div>
  );
}

/** Chuyển từ tab Affiliate & Creator sang đây — cùng nguồn 5 sheet chi tiết dùng cho Payout/ROAS ở trên. */
export function OrderStatusSection() {
  const { month, platform, bu } = useFilters();
  const { t, formatMoney } = usePreferences();
  const breakdowns = getOrderStatusBreakdown("month", month, platform, bu);

  if (breakdowns.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        {t("Lazada không có cột Order Status trong sheet nguồn.")}
      </p>
    );
  }

  return (
    <div className={breakdowns.length > 1 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>
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
                  valueFormatter={formatMoney}
                />
                <p className="mt-2 inline-block rounded-md bg-accent-soft px-2 py-1 text-[11px] text-accent-ink">
                  {t("GMV thật: ")}{formatPercent((realTotal / total) * 100, 0)}
                </p>
              </>
            ) : (
              <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12px] text-ink-3">{t("Không có dữ liệu cho tháng này.")}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Nhận xét dạng văn xuôi cho 4 kênh affiliate chính, tính theo tuần gần nhất đã trọn 7 ngày
 * (dùng chung `week`/`compareWeek` từ FilterContext — đổi ở tab Theo tuần sẽ phản ánh luôn ở đây).
 * Cố tình không nói về ROAS/Payout — chỉ tập trung GMV (loại Seller Creator), số creator, GMV
 * Live/Video, kênh traffic/content tốt-xấu và creator đóng góp chính, kết ở gợi ý cải thiện.
 */
export function OperationsNarrative() {
  const { week } = useFilters();
  const { t } = usePreferences();
  const rows = useMemo(() => getOperationsHighlights(week), [week]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((r) => (
        <div key={r.channel.key} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h4 className="text-[14px] font-bold text-ink-1">{r.channel.label}</h4>
            <span className="text-[11px] text-ink-3">
              {t("Tuần")} {r.weekLabel}
            </span>
          </div>

          {r.highlights.length > 0 && (
            <ul className="mb-2 space-y-1.5">
              {r.highlights.map((text, i) => (
                <li key={`h-${i}`} className="flex items-start gap-2 text-[12.5px] text-ink-1">
                  <TrendingUp size={14} className="mt-0.5 shrink-0 text-good-ink" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}

          {r.lowlights.length > 0 && (
            <ul className="mb-3 space-y-1.5">
              {r.lowlights.map((text, i) => (
                <li key={`l-${i}`} className="flex items-start gap-2 text-[12.5px] text-ink-1">
                  <TrendingDown size={14} className="mt-0.5 shrink-0 text-crit-ink" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          )}

          <p
            className={cn(
              "flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-[12px] text-accent-ink"
            )}
          >
            <Lightbulb size={14} className="mt-0.5 shrink-0" />
            <span>{r.guidance}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
