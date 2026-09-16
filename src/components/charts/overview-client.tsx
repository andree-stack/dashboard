"use client";

import { useMemo } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { useFilters } from "@/components/filter-context";
import { usePreferences } from "@/components/preferences-context";
import { GroupedBuBar } from "@/components/charts/grouped-bar";
import { BarList } from "@/components/charts/bar-list";
import { KpiCard, KpiRow } from "@/components/kpi-card";
import {
  PLATFORMS,
  monthlyPlatformBu,
  MONTHS,
  getFilteredKpi,
  getChannelOps,
  getMonthlyChannelRows,
  platformColor,
} from "@/lib/data";
import { getMonthlyContentBreakdown, type ContentDetailItem } from "@/lib/monthly-content-data";
import { translateMonthLabel } from "@/lib/i18n";
import { formatPercent, statusForAchievement, cn } from "@/lib/utils";

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

export function KpiRowClient() {
  const { month, platform, bu } = useFilters();
  const { lang, t, formatMoney } = usePreferences();
  const k = getFilteredKpi(month, platform, bu);
  const ops = getChannelOps(month, platform, bu);
  const achTone = k.achievementPct != null ? statusForAchievement(k.achievementPct) : null;

  const scopeLabel = [platform !== "Tất cả" ? platform : null, bu !== "Tất cả" ? bu : null]
    .filter(Boolean)
    .join(" ");
  const monthLabel = translateMonthLabel(MONTHS.find((m) => m.key === month)?.label ?? "", lang);
  const kLabel = translateMonthLabel(k.label, lang);
  const noOpsNote = `${monthLabel} · ${t("không có dữ liệu cho")} ${scopeLabel || t("bộ lọc này")}`;

  return (
    <>
      <KpiRow>
        <KpiCard
          label={t("GMV toàn kênh")}
          value={!k.hasChannels ? "—" : k.hasActual ? formatMoney(k.gmvActual!) : "—"}
          foot={
            !k.hasChannels
              ? `${kLabel} · ${t("không có kênh khớp bộ lọc")}`
              : k.isMtd
              ? `${kLabel} · ${t("số MTD")}`
              : k.hasActual
              ? kLabel
              : `${kLabel} · ${t("chưa diễn ra")}`
          }
        />
        <KpiCard
          label={t("Target GMV")}
          value={k.hasChannels && k.gmvTarget > 0 ? formatMoney(k.gmvTarget) : "—"}
          foot={kLabel}
        />
        <KpiCard
          label={t("% Đạt Target")}
          value={k.achievementPct != null ? formatPercent(k.achievementPct) : "—"}
          tone={achTone ?? undefined}
          toneLabel={
            achTone === "good"
              ? t("đạt")
              : achTone === "warn"
              ? t("gần đạt")
              : achTone === "crit"
              ? t("rủi ro")
              : undefined
          }
        />
        <KpiCard
          label={t("Tăng trưởng MoM")}
          value={k.momGrowthPct != null ? `${k.momGrowthPct >= 0 ? "+" : ""}${formatPercent(k.momGrowthPct)}` : "—"}
          tone={k.momGrowthPct != null ? (k.momGrowthPct >= 0 ? "good" : "crit") : undefined}
          toneLabel={k.momGrowthPct != null ? (k.momGrowthPct >= 0 ? `▲ ${t("tốt")}` : `▼ ${t("giảm")}`) : undefined}
        />
        <KpiCard
          label="Avg Commission %"
          value={ops.hasData ? formatPercent(ops.avgCommissionPct, 2) : "—"}
          foot={ops.hasData ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}` : noOpsNote}
        />
        <KpiCard
          label="ROAS"
          value={ops.hasData ? `${ops.roas.toFixed(1)}x` : "—"}
          foot={ops.hasData ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}` : noOpsNote}
        />
        <KpiCard
          label={t("Tỷ lệ đơn Hoàn thành")}
          value={ops.completionRatePct != null ? formatPercent(ops.completionRatePct) : "—"}
          foot={
            ops.completionRatePct != null
              ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}`
              : ops.hasData
              ? `${monthLabel} · ${scopeLabel || t("kênh này")} ${t("không có cột Order Status")}`
              : noOpsNote
          }
        />
        <KpiCard
          label={t("Tỷ lệ hoàn (Refund)")}
          value={ops.refundRatePct != null ? formatPercent(ops.refundRatePct) : "—"}
          tone={ops.refundRatePct != null ? "good" : undefined}
          toneLabel={ops.refundRatePct != null ? (ops.refundRatePct < 12 ? t("thấp") : t("theo dõi")) : undefined}
          foot={
            ops.refundRatePct != null
              ? `${monthLabel}${scopeLabel ? " · " + scopeLabel : ""}`
              : ops.hasData
              ? `${monthLabel} · ${scopeLabel || t("kênh này")} ${t("không có cột Refund")}`
              : noOpsNote
          }
        />
      </KpiRow>
      <p className="mt-2 text-[11.5px] text-ink-3">
        {t("4 thẻ đầu nguồn VN RunRate'26. 4 thẻ sau (Avg Commission/ROAS/Hoàn thành/Refund) tính trực tiếp từ 5 sheet chi tiết giao dịch, theo đúng Tháng + Platform + BU đang chọn — GMV nội bộ của nhóm này có thể lệch nhẹ so với 4 thẻ đầu do khác nguồn tổng hợp. Lazada không có cột Order Status/Refund nên Tỷ lệ Hoàn thành/Refund luôn để trống cho kênh đó.")}
      </p>
    </>
  );
}

export function PlatformBuSection() {
  const { month, platform } = useFilters();
  const { lang, t, formatMoney } = usePreferences();
  const rows = monthlyPlatformBu[month];
  const hasActual = rows.some((r) => r.actual != null);

  const data = useMemo(
    () =>
      PLATFORMS.map((p) => ({
        platform: p,
        PC: rows.find((d) => d.platform === p && d.bu === "PC")?.actual ?? 0,
        MCC: rows.find((d) => d.platform === p && d.bu === "MCC")?.actual ?? 0,
      })),
    [rows]
  );

  const label = translateMonthLabel(MONTHS.find((m) => m.key === month)?.label ?? "", lang);

  if (!hasActual) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        {label} {t("chưa diễn ra — chưa có số liệu thực tế, chỉ có target.")}
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-[12px] text-ink-2">
        {label}, {t("thực tế.")}
      </p>
      <GroupedBuBar data={data} dimPlatform={platform} valueFormatter={formatMoney} />
    </>
  );
}

export function TargetAchievementSection() {
  const { month, platform } = useFilters();
  const { lang, t } = usePreferences();
  const rows = monthlyPlatformBu[month];

  const list = useMemo(
    () =>
      rows
        .filter((r) => (platform === "Tất cả" || r.platform === platform) && r.target > 0 && r.actual != null)
        .map((r) => {
          const pct = (r.actual! / r.target) * 100;
          return {
            name: `${r.platform} ${r.bu}`,
            value: pct,
            color:
              pct >= 95 ? "var(--color-good)" : pct >= 80 ? "var(--color-warn)" : "var(--color-crit)",
          };
        })
        .sort((a, b) => a.value - b.value),
    [rows, platform]
  );

  const label = translateMonthLabel(MONTHS.find((m) => m.key === month)?.label ?? "", lang);

  if (list.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        {label}: {t("không có kênh nào có cả target và số liệu thực tế cho bộ lọc này.")}
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-[12px] text-ink-2">
        {label} — {t("sắp xếp theo % thấp → cao.")}
      </p>
      <BarList data={list} valueFormatter={(v) => formatPercent(v, 0)} />
    </>
  );
}

function ContentBreakdownRow({
  item,
  maxGmv,
  color,
}: {
  item: ReturnType<typeof getMonthlyContentBreakdown>[number]["items"][number];
  maxGmv: number;
  color: string;
}) {
  const { t, formatMoney } = usePreferences();
  const widthPct = maxGmv > 0 ? Math.max(3, (item.gmv / maxGmv) * 100) : 0;

  return (
    <div className={cn("relative flex items-center gap-2 text-[11.5px]", item.detail && "group")}>
      <span className="w-[78px] shrink-0 truncate text-ink-2" title={item.label}>
        {item.label}
      </span>
      <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-alt">
        <div className="h-full rounded-full" style={{ width: `${widthPct}%`, background: color }} />
      </div>
      <span className="w-[64px] shrink-0 text-right tabular font-semibold text-ink-1">{formatMoney(item.gmv)}</span>

      {item.detail && (
        <div className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-60 rounded-lg border border-border bg-surface p-2.5 text-[11px] shadow-lg group-hover:block">
          <div className="mb-1.5 font-bold text-ink-1">{t('Chi tiết "Khác"')}</div>
          <ul className="max-h-40 space-y-0.5 overflow-y-auto">
            {item.detail.map((d: ContentDetailItem) => (
              <li key={d.label} className="flex justify-between gap-2">
                <span className="truncate text-ink-2">{d.label}</span>
                <span className="shrink-0 tabular text-ink-1">{formatMoney(d.gmv)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Clone của WeeklyContentBreakdownSection (tab Weekly) nhưng theo Tháng — dùng filter Tháng chung của tab Tổng quan. */
export function MonthlyContentBreakdownSection() {
  const { month, platform, bu } = useFilters();
  const { t } = usePreferences();
  const breakdowns = getMonthlyContentBreakdown(month, platform, bu);

  if (breakdowns.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        {t("Lazada không có cột Content Type/Channel trong sheet nguồn.")}
      </p>
    );
  }

  return (
    <div className={cn("grid gap-4", breakdowns.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1")}>
      {breakdowns.map((b) => {
        const maxGmv = Math.max(...b.items.map((it) => it.gmv), 1);
        return (
          <div key={b.platform} className="rounded-lg border border-border p-3">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink-1">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: platformColor[b.platform] }}
                />
                {b.platform}
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">
                {t(b.dimensionLabel)}
              </span>
            </div>
            {b.hasData ? (
              <div className="space-y-2">
                {b.items.map((it) => (
                  <ContentBreakdownRow key={it.label} item={it} maxGmv={maxGmv} color={platformColor[b.platform]} />
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12px] text-ink-3">
                {t("Không có dữ liệu cho tháng này.")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Clone rút gọn của WeeklyChannelTable (tab Weekly) nhưng theo Tháng — chỉ 1 delta (so tháng trước). */
export function MonthlyChannelTable() {
  const { month, platform, bu } = useFilters();
  const { t, formatMoney } = usePreferences();
  const rows = getMonthlyChannelRows(month, platform, bu);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-8 text-center text-[12.5px] text-ink-3">
        {t("Không có kênh nào khớp bộ lọc.")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-3">
            <th className="py-2 pr-3 font-bold">{t("Kênh")}</th>
            <th className="py-2 pr-3 font-bold">GMV</th>
            <th className="py-2 pr-3 font-bold">{t("So sánh")}</th>
            <th className="py-2 pr-3 font-bold">{t("Đơn")}</th>
            <th className="py-2 pr-3 font-bold">{t("So sánh")}</th>
            <th className="py-2 pr-3 font-bold">ROAS</th>
            <th className="py-2 pr-3 font-bold">{t("Hoàn thành")}</th>
            <th className="py-2 font-bold">{t("Refund")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border/60 last:border-0">
              <td className="py-2 pr-3 font-semibold text-ink-1">
                {r.platform} {r.bu}
              </td>
              <td className="py-2 pr-3 tabular">{r.gmv != null ? formatMoney(r.gmv) : "—"}</td>
              <td className="py-2 pr-3">
                <DeltaTag d={toDelta(r.momGmvPct)} />
              </td>
              <td className="py-2 pr-3 tabular">{r.orders != null ? r.orders.toLocaleString("vi-VN") : "—"}</td>
              <td className="py-2 pr-3">
                <DeltaTag d={toDelta(r.momOrdersPct)} />
              </td>
              <td className="py-2 pr-3 tabular">{r.roas != null ? `${r.roas.toFixed(1)}x` : "—"}</td>
              <td className="py-2 pr-3 tabular">
                {r.completionRatePct != null ? formatPercent(r.completionRatePct) : "—"}
              </td>
              <td className="py-2 tabular">{r.refundRatePct != null ? formatPercent(r.refundRatePct) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
