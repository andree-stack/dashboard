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
import { monthlyTrend } from "@/lib/data";
import { formatVnd } from "@/lib/utils";

export function TrendChart() {
  const { month } = useFilters();
  const data = monthlyTrend.map((d) => ({
    ...d,
    actualDisplay: d.actual,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ReferenceLine
          x={month}
          stroke="var(--color-accent)"
          strokeDasharray="2 2"
          label={{ value: "Đang xem", position: "insideTopLeft", fill: "var(--color-accent-ink)", fontSize: 10 }}
        />
        <YAxis
          tickFormatter={(v) => formatVnd(v)}
          width={72}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value, name) => [
            typeof value === "number" ? formatVnd(value) : String(value ?? ""),
            name === "target" ? "Target" : "Thực tế",
          ]}
          labelFormatter={(label) => `Tháng ${String(label).replace("T", "")}`}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="var(--color-ink-3)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
          name="target"
        />
        <Line
          type="monotone"
          dataKey="actualDisplay"
          stroke="var(--color-s-shopee)"
          strokeWidth={2.5}
          dot={(props) => {
            const { cx, cy, payload, key } = props;
            if (payload.actual == null) return <g key={key} />;
            return (
              <circle
                key={key}
                cx={cx}
                cy={cy}
                r={payload.isMtd ? 4.5 : 3}
                fill={payload.isMtd ? "var(--color-surface)" : "var(--color-s-shopee)"}
                stroke="var(--color-s-shopee)"
                strokeWidth={2}
              />
            );
          }}
          connectNulls={false}
          name="actual"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
