"use client";

import { useMemo, useState } from "react";
import { useFilters } from "@/components/filter-context";
import { usePreferences } from "@/components/preferences-context";
import { Card, CardFootnote } from "@/components/ui/card";
import { MONTHS, platformColor } from "@/lib/data";
import { PRODUCT_CHANNELS, getProductRows, type ProductChannelKey, type ProductRow } from "@/lib/product-data";
import { translateMonthLabel } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ROW_LIMIT_DEFAULT = 5;

function CreatorMiniTable({ row }: { row: ProductRow }) {
  const { t, formatMoney } = usePreferences();

  if (row.topCreators.length === 0) {
    return <p className="mt-1.5 text-[11.5px] text-ink-3">{t("Không có dữ liệu creator cho sản phẩm này.")}</p>;
  }

  return (
    <table className="mt-1.5 w-full text-left text-[11.5px]">
      <thead>
        <tr className="text-ink-3">
          <th className="w-5 py-0.5 font-semibold">#</th>
          <th className="py-0.5 font-semibold">{t("Creator")}</th>
          <th className="py-0.5 text-right font-semibold">{t("SL bán")}</th>
          <th className="py-0.5 text-right font-semibold">{t("AOV của creator")}</th>
        </tr>
      </thead>
      <tbody>
        {row.topCreators.map((c, i) => (
          <tr key={c.name} className="border-t border-border/40">
            <td className="py-1 tabular text-ink-3">{i + 1}</td>
            <td className="max-w-[180px] truncate py-1 pr-2 text-ink-1" title={c.name}>
              {c.name}
            </td>
            <td className="py-1 text-right tabular font-semibold text-ink-1">{c.qty.toLocaleString("vi-VN")}</td>
            <td className="py-1 text-right tabular text-ink-2">
              {c.aov != null ? formatMoney(c.aov) : <span className="text-ink-3">—</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProductList({ rows, channel }: { rows: ProductRow[]; channel: ProductChannelKey }) {
  const { t } = usePreferences();
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? rows : rows.slice(0, ROW_LIMIT_DEFAULT);

  if (rows.length === 0) {
    return (
      <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
        {t("Không có dữ liệu cho kỳ này.")}
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2.5">
        {shown.map((r, i) => (
          <div key={`${channel}-${r.name}`} className="rounded-lg border border-border/60 px-3 py-2.5">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="shrink-0 tabular text-[11px] text-ink-3">{i + 1}</span>
                <span className="truncate text-[12.5px] font-semibold text-ink-1" title={r.name}>
                  {r.name}
                </span>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[12.5px] tabular font-bold text-ink-1">
                {r.qty.toLocaleString("vi-VN")} {t("SP")}
              </span>
            </div>
            <CreatorMiniTable row={r} />
          </div>
        ))}
      </div>
      {rows.length > ROW_LIMIT_DEFAULT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2.5 text-[12px] font-semibold text-accent-ink hover:underline"
        >
          {expanded ? t("Thu gọn") : `${t("Xem thêm")} (${rows.length - ROW_LIMIT_DEFAULT})`}
        </button>
      )}
    </>
  );
}

function ChannelCard({ channel }: { channel: (typeof PRODUCT_CHANNELS)[number] }) {
  const { month } = useFilters();
  const { t } = usePreferences();
  const rows = useMemo(() => getProductRows(channel.key, month), [channel.key, month]);
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="flex items-center gap-1.5 text-[14px] font-bold text-ink-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: platformColor[channel.platform] }} />
          {channel.label}
        </h4>
        <span className="text-[11px] text-ink-3">
          {rows.length} {t("sản phẩm")} · {totalQty.toLocaleString("vi-VN")} {t("SP đã bán")}
        </span>
      </div>
      <ProductList rows={rows} channel={channel.key} />
    </Card>
  );
}

export function ProductDashboard() {
  const { month } = useFilters();
  const { t, lang } = usePreferences();
  const monthLabel = translateMonthLabel(MONTHS.find((m) => m.key === month)?.label ?? month, lang);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-1">{t("Sản phẩm")}</h1>
        <p className="text-[13px] text-ink-2">
          {t("Số lượng sản phẩm bán ra theo từng kênh, top 5 creator bán nhiều nhất mỗi sản phẩm và AOV của từng creator đó —")}{" "}
          {monthLabel}. {t("Đổi")} <b>{t("Kỳ báo cáo")}</b> {t("ở thanh lọc phía trên.")}
        </p>
      </div>

      <div className={cn("grid gap-4", "md:grid-cols-2")}>
        {PRODUCT_CHANNELS.map((ch) => (
          <ChannelCard key={ch.key} channel={ch} />
        ))}
      </div>

      <CardFootnote>
        {t(
          "Nguồn: Item Name/Qty (Shopee), Product Name/Quantity (TikTok Shop) group theo Tháng. Top 5 creator = 5 creator có SL bán cao nhất của đúng sản phẩm đó trong tháng, sort giảm dần. AOV của mỗi creator = GMV ÷ số đơn CỦA RIÊNG creator đó trong cả kênh ở tháng này (không chỉ sản phẩm này). Lazada không có cột creator/product-level tương đương nên không xuất hiện."
        )}
      </CardFootnote>
    </div>
  );
}
