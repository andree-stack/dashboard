"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatVnd } from "@/lib/utils";
import type { Platform } from "@/lib/data";

export function GroupedBuBar({
  data,
  dimPlatform,
}: {
  data: { platform: Platform; PC: number; MCC: number }[];
  dimPlatform?: Platform | "Tất cả";
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="platform" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => formatVnd(v)} width={64} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v) => formatVnd(Number(v ?? 0))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="PC" fill="var(--color-s-shopee)" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fillOpacity={dimPlatform && dimPlatform !== "Tất cả" && dimPlatform !== d.platform ? 0.25 : 0.55}
            />
          ))}
        </Bar>
        <Bar dataKey="MCC" fill="var(--color-s-tts)" radius={[4, 4, 0, 0]} maxBarSize={36}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fillOpacity={dimPlatform && dimPlatform !== "Tất cả" && dimPlatform !== d.platform ? 0.25 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
