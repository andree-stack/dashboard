"use client";

import { useMemo, useState } from "react";
import { useFilters } from "@/components/filter-context";
import { usePreferences } from "@/components/preferences-context";
import { Card, CardFootnote } from "@/components/ui/card";
import { MONTHS, platformColor } from "@/lib/data";
import { PRODUCT_CHANNELS, getProductRows, type ProductChannelKey, type ProductRow } from "@/lib/product-data";
import { translateMonthLabel } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ROW_LIMIT_DEFAULT = 8;

function ProductTable({ rows, channel }: { rows: ProductRow[]; channel: ProductChannelKey }) {
  const { t, formatMoney } = usePreferences();
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-ink-3">
              <th className="py-2 pr-3 font-bold">#</th>
              <th className="py-2 pr-3 font-bold">{t("Sản phẩm")}</th>
              <th className="py-2 pr-3 text-right font-bold">{t("SL bán")}</th>
              <th className="py-2 pr-3 font-bold">{t("Creator bán nhiều nhất")}</th>
              <th className="py-2 pr-3 text-right font-bold">{t("AOV của creator")}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={`${channel}-${r.name}`} className="border-b border-border/60 last:border-0 align-top">
                <td className="py-2 pr-3 tabular text-ink-3">{i + 1}</td>
                <td className="max-w-[260px] py-2 pr-3 font-semibold text-ink-1" title={r.name}>
                  <span className="line-clamp-2">{r.name}</span>
                </td>
                <td className="py-2 pr-3 text-right tabular font-semibold">{r.qty.toLocaleString("vi-VN")}</td>
                <td className="py-2 pr-3">
                  {r.topCreator ? (
                    <span className="text-ink-1" title={r.topCreator}>
                      {r.topCreator}
                      <span className="ml-1 text-ink-3">· {r.topCreatorQty?.toLocaleString("vi-VN")} {t("SP")}</span>
                    </span>
                  ) : (
                    <span className="text-ink-3">—</span>
                  )}
                </td>
                <td className="py-2 pr-3 text-right tabular">
                  {r.topCreatorAov != null ? formatMoney(r.topCreatorAov) : <span className="text-ink-3">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <ProductTable rows={rows} channel={channel.key} />
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
          {t("Số lượng sản phẩm bán ra theo từng kênh, creator bán nhiều nhất mỗi sản phẩm và AOV của creator đó —")}{" "}
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
          "Nguồn: Item Name/Qty (Shopee), Product Name/Quantity (TikTok Shop) group theo Tháng. Creator bán nhiều nhất = creator có tổng SL bán cao nhất của đúng sản phẩm đó trong tháng. AOV của creator = GMV ÷ số đơn CỦA RIÊNG creator đó trong cả kênh ở tháng này (không chỉ sản phẩm này). Lazada không có cột creator/product-level tương đương nên không xuất hiện."
        )}
      </CardFootnote>
    </div>
  );
}
