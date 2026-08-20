"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatVnd } from "@/lib/utils";

export type BuGroupedBarRow = { label: string; PC: number; MCC: number };

/** Bar ngang nhóm theo label (category/campaign/gmv-source), tô màu PC/MCC nhất quán với các chart khác. */
export function BuGroupedBar({
  data,
  height,
  valueFormatter = formatVnd,
}: {
  data: BuGroupedBarRow[];
  height?: number;
  valueFormatter?: (v: number) => string;
}) {
  const h = height ?? Math.max(140, data.length * 44);

  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 4, bottom: 4 }} barGap={4}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={(v) => valueFormatter(v)} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="label" width={110} tickLine={false} axisLine={false} tick={{ fontSize: 11.5 }} />
        <Tooltip formatter={(v) => valueFormatter(Number(v ?? 0))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="PC" name="PC" fill="var(--color-s-shopee)" radius={[0, 4, 4, 0]} maxBarSize={16} />
        <Bar dataKey="MCC" name="MCC" fill="var(--color-s-tts)" radius={[0, 4, 4, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
