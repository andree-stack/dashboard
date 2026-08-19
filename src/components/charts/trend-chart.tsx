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
import { getTrendSeries } from "@/lib/data";
import { formatVnd } from "@/lib/utils";

export function TrendChart() {
  const { month, platform, bu } = useFilters();
  const { series, rows } = getTrendSeries(platform, bu);

  const modeLabel =
    series.length === 1
      ? `1 line — đúng kênh đang lọc (${series[0].label})`
      : platform === "Tất cả"
      ? "Tách theo Platform"
      : `Tách theo BU trong ${platform}`;

  return (
    <div>
      <p className="mb-2 text-[12px] text-ink-2">{modeLabel} — target là tổng target trong phạm vi đang lọc.</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ReferenceLine
            x={month}
            stroke="var(--color-accent)"
            strokeDasharray="2 2"
            label={{ value: "Đang xem", position: "insideTopLeft", fill: "var(--color-accent-ink)", fontSize: 10 }}
          />
          <YAxis tickFormatter={(v) => formatVnd(v)} width={72} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value) => (typeof value === "number" ? formatVnd(value) : String(value ?? "—"))}
            labelFormatter={(label) => `Tháng ${String(label).replace("T", "")}`}
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="var(--color-ink-3)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            name="Target"
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
                    r={payload.isMtd ? 4.5 : 3}
                    fill={payload.isMtd ? "var(--color-surface)" : s.color}
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
          <span className="inline-block h-0 w-4 border-t-2 border-dashed border-ink-3" />
          Target
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
