"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer } from "recharts";

const SEGMENT_COLORS = ["var(--color-s-shopee)", "var(--color-s-tts)", "var(--color-s-4)"];

export function StackedPercentBar({
  data,
  keys,
}: {
  data: Record<string, number | string>[];
  keys: string[];
}) {
  // Chuẩn hoá về tỷ lệ (0..1) trước khi vẽ — stackOffset="expand" của Recharts chỉ chỉnh chiều cao
  // hiển thị, KHÔNG chỉnh giá trị dữ liệu gốc mà Tooltip/LabelList đọc, nên tự tính % ở đây để
  // không hiện % sai (vd 42300791300.0%) như trước.
  const normalized = data.map((row) => {
    const total = keys.reduce((s, k) => s + (Number(row[k]) || 0), 0);
    const out: Record<string, number | string> = { bu: row.bu };
    for (const k of keys) {
      out[k] = total > 0 ? (Number(row[k]) || 0) / total : 0;
    }
    return out;
  });

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        data={normalized}
        layout="vertical"
        margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
        barCategoryGap={22}
      >
        <XAxis type="number" hide domain={[0, 1]} />
        {/* interval={0}: Recharts defaults category axes to interval="preserveEnd", which can silently
            drop a tick label (bars still render) when it misjudges label spacing at small heights. */}
        <YAxis type="category" dataKey="bu" width={40} tickLine={false} axisLine={false} interval={0} />
        <Tooltip formatter={(v) => `${(Number(v ?? 0) * 100).toFixed(1)}%`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} stackId="a" fill={SEGMENT_COLORS[i % 3]} maxBarSize={34}>
            <LabelList
              dataKey={k}
              position="center"
              formatter={(v: React.ReactNode) => {
                const pct = Number(v ?? 0) * 100;
                return pct >= 6 ? `${pct.toFixed(0)}%` : "";
              }}
              style={{ fontSize: 11, fill: "#fff", fontWeight: 700 }}
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
