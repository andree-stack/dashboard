"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useFilters } from "@/components/filter-context";
import { usePreferences } from "@/components/preferences-context";
import { getWeeklyTrendSeries, type WeekKey } from "@/lib/weekly-data";

export function WeeklyTrendChart({ week }: { week: WeekKey }) {
  const { platform, bu } = useFilters();
  const { lang, t, formatMoney } = usePreferences();
  const { series, rows } = getWeeklyTrendSeries(platform, bu);

  const modeLabel =
    series.length === 1
      ? lang === "vi"
        ? `1 line — đúng kênh đang lọc (${series[0].label})`
        : `1 line — matches the current filter (${series[0].label})`
      : platform === "Tất cả"
      ? t("Tách theo Platform")
      : lang === "vi"
      ? `Tách theo BU trong ${platform}`
      : `Split by BU within ${platform}`;

  return (
    <div>
      <p className="mb-2 text-[12px] text-ink-2">
        {modeLabel} — {t("GMV theo tuần, không có target tuần.")}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} interval={2} tick={{ fontSize: 11 }} />
          <ReferenceLine
            x={rows.find((r) => r.week === week)?.label}
            stroke="var(--color-accent)"
            strokeDasharray="2 2"
            label={{ value: t("Đang xem"), position: "insideTopLeft", fill: "var(--color-accent-ink)", fontSize: 10 }}
          />
          <YAxis tickFormatter={(v) => formatMoney(v)} width={72} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value) => (typeof value === "number" ? formatMoney(value) : String(value ?? "—"))}
            labelFormatter={(label) => `${t("Tuần")} ${String(label)}`}
          />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, payload, key } = props;
                if (payload[s.key] == null) return <g key={key} />;
                return (
                  <circle
                    key={key}
                    cx={cx}
                    cy={cy}
                    r={payload.isPartial ? 4.5 : 3}
                    fill={payload.isPartial ? "var(--color-surface)" : s.color}
                    stroke={s.color}
                    strokeWidth={2}
                  />
                );
              }}
              connectNulls={false}
              name={s.label}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-ink-3 bg-surface" />
          {t("Tuần chưa trọn (MTD)")}
        </span>
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-[3px] w-4 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
