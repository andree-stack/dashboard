"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SEGMENT_COLORS = ["var(--color-s-shopee)", "var(--color-s-tts)", "var(--color-s-4)"];

export function StackedPercentBar({
  data,
  keys,
}: {
  data: Record<string, number | string>[];
  keys: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        data={data}
        layout="vertical"
        stackOffset="expand"
        margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
        barCategoryGap={22}
      >
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="bu" width={40} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v) => `${(Number(v ?? 0) * 100).toFixed(1)}%`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} stackId="a" fill={SEGMENT_COLORS[i % 3]} maxBarSize={34} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
