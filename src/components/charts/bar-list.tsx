"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { formatVnd } from "@/lib/utils";

export type BarListItem = {
  name: string;
  value: number;
  color?: string;
  faded?: boolean;
  suffix?: string;
};

export function BarList({
  data,
  height,
  valueFormatter = formatVnd,
  color = "var(--color-s-shopee)",
}: {
  data: BarListItem[];
  height?: number;
  valueFormatter?: (v: number) => string;
  color?: string;
}) {
  const h = height ?? Math.max(120, data.length * 34);

  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 56, left: 4, bottom: 4 }}
        barCategoryGap={10}
      >
        <XAxis type="number" hide />
        {/* interval={0}: Recharts defaults category axes to interval="preserveEnd", which can silently
            drop a tick label (bars still render) when it misjudges label spacing at small heights. */}
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11.5 }}
          interval={0}
        />
        <Tooltip
          cursor={{ fill: "var(--color-surface-alt)" }}
          formatter={(value) => [valueFormatter(Number(value ?? 0)), "GMV"]}
        />
        <Bar dataKey="value" radius={4} maxBarSize={18}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.color ?? color}
              fillOpacity={d.faded ? 0.35 : 1}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v: React.ReactNode) => valueFormatter(Number(v ?? 0))}
            style={{ fontSize: 11, fill: "var(--color-ink-2)" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
