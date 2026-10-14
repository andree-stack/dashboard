// Tab Sản phẩm — logic layer over product-raw-data.ts (extracted from cùng 5 sheet chi tiết dùng
// cho affiliate-raw-data.ts/data.ts, group theo tên sản phẩm + Tháng, tách riêng theo từng kênh
// Platform×BU). Lazada không có cột Item/Product Name + creator trong sheet nguồn nên không có mặt.
import type { MonthKey, Platform, BU } from "./data";
import { productMonthRaw, type ProductEntry } from "./product-raw-data";

export type ProductChannelKey = "Shopee-PC" | "Shopee-MCC" | "TikTok Shop-PC" | "TikTok Shop-MCC";

export const PRODUCT_CHANNELS: { key: ProductChannelKey; platform: Platform; bu: BU; label: string }[] = [
  { key: "Shopee-PC", platform: "Shopee", bu: "PC", label: "Shopee PC" },
  { key: "Shopee-MCC", platform: "Shopee", bu: "MCC", label: "Shopee MCC" },
  { key: "TikTok Shop-PC", platform: "TikTok Shop", bu: "PC", label: "TikTok Shop PC" },
  { key: "TikTok Shop-MCC", platform: "TikTok Shop", bu: "MCC", label: "TikTok Shop MCC" },
];

/** Tháng có dữ liệu sản phẩm/creator (khớp phạm vi 5 sheet chi tiết — xem affiliate-raw-data.ts). */
export const PRODUCT_MONTHS: MonthKey[] = ["T4", "T5", "T6", "T7", "T8", "T9", "T10"];
export const DEFAULT_PRODUCT_MONTH: MonthKey = "T10";

export type ProductRow = ProductEntry & {
  /** AOV (GMV ÷ số đơn) của topCreator trong CẢ kênh ở tháng này — không chỉ riêng sản phẩm này. */
  topCreatorAov: number | null;
};

/** Danh sách sản phẩm của 1 kênh (Platform×BU) ở 1 tháng, sort theo số lượng bán giảm dần. */
export function getProductRows(channel: ProductChannelKey, month: MonthKey): ProductRow[] {
  const rows = productMonthRaw[channel]?.[month] ?? [];
  return rows
    .map((r) => ({
      ...r,
      topCreatorAov:
        r.topCreatorGmv != null && r.topCreatorOrders ? r.topCreatorGmv / r.topCreatorOrders : null,
    }))
    .sort((a, b) => b.qty - a.qty);
}

export function hasProductData(channel: ProductChannelKey, month: MonthKey): boolean {
  return (productMonthRaw[channel]?.[month]?.length ?? 0) > 0;
}
