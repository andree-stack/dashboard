// Từ điển dịch UI chrome (nav, tiêu đề, nhãn, footnote) — KHÔNG dịch giá trị dữ liệu thô (tên
// creator, category, order status...) vì đó là dữ liệu gốc từ sheet, dịch sẽ làm sai lệch dữ liệu.
// translate() tra theo chuỗi tiếng Việt gốc làm khoá — không tìm thấy thì trả nguyên bản (an toàn
// khi có string mới chưa kịp thêm vào từ điển).
export type Lang = "vi" | "en";

export const USD_VND_RATE = 26000;

const DICT: Record<string, string> = {
  // Nav / chrome
  "Philips VN Marketplace": "Philips VN Marketplace",
  "Performance Dashboard": "Performance Dashboard",
  "Tổng quan": "Overview",
  "Affiliate & Creator": "Affiliate & Creator",
  "Vận hành": "Operations",
  "Content & Chiến dịch": "Content & Campaigns",
  "Đăng xuất": "Log out",

  // Filter bar
  "Kỳ báo cáo": "Report period",
  "Nền tảng": "Platform",
  "Tất cả": "All",
  "Xoá lọc": "Clear filters",
  "Tuần xem": "Week",
  "So sánh với": "Compare with",
  "Chế độ xem": "View mode",
  "Theo tháng": "Monthly",
  "Theo tuần": "Weekly",

  // Common words/labels
  "GMV": "GMV",
  "Đơn": "Orders",
  "Số đơn": "Orders",
  "AOV (GMV/đơn)": "AOV (GMV/order)",
  "Payout": "Payout",
  "ROAS": "ROAS",
  "Hoàn thành": "Completion",
  "Refund": "Refund",
  "Kênh": "Channel",
  "So sánh": "Compare",
  "So sánh GMV": "Compare GMV",
  "Mới": "New",
  "Mới?": "New?",
  "Creator": "Creator",
  "Đăng xuất tài khoản": "Sign out",
  "Trang": "Page",
  "Tìm creator ID...": "Search creator ID...",
  "creator": "creators",
  "creator (top 50/kênh đang track)": "creators (top 50/channel tracked)",
  "Chưa trọn tuần": "Week in progress",
  "MTD": "MTD",

  // Overview page
  "GMV thực tế vs. target, sức khoẻ toàn kênh — nguồn: VN RunRate'26. Đổi Kỳ báo cáo ở thanh lọc phía trên để xem theo từng tháng.":
    "GMV actual vs. target, overall channel health — source: VN RunRate'26. Change Report period in the filter bar above to view by month.",
  "GMV Thực tế vs. Target theo tháng — FY2026": "GMV Actual vs. Target by month — FY2026",
  "Line chart": "Line chart",
  "1 trục — VND. Nét đứt = Target, nét liền = Thực tế, điểm T8 để rỗng vì là số MTD.":
    "Single axis. Dashed = Target, solid = Actual, T8 is hollow because it's MTD.",
  "Nguồn: VN RunRate'26 — mục \"GMV TARGET 2026\" & \"GMV ACTUALISATION 2026\".":
    "Source: VN RunRate'26 — \"GMV TARGET 2026\" & \"GMV ACTUALISATION 2026\" sections.",
  "GMV theo Platform × BU": "GMV by Platform × BU",
  "Grouped bar": "Grouped bar",
  "Cập nhật theo tháng đang chọn.": "Updates with the selected month.",
  "Nguồn: VN RunRate'26 — \"GMV ACTUALISATION 2026\", theo từng kênh mỗi tháng.":
    "Source: VN RunRate'26 — \"GMV ACTUALISATION 2026\", per channel per month.",
  "% Đạt Target theo kênh": "% Target Achieved by channel",
  "Bullet / progress": "Bullet / progress",
  "Tính từ VN RunRate'26 — Actual ÷ Target theo từng kênh mỗi tháng.":
    "Computed from VN RunRate'26 — Actual ÷ Target per channel per month.",
  "GMV theo Content Type / Kênh traffic": "GMV by Content Type / Traffic channel",
  "Bar list": "Bar list",
  "So sánh chi tiết theo kênh": "Detailed channel comparison",
  "Table": "Table",
  "Luôn hiện đủ 6 tổ hợp Platform × BU khớp bộ lọc — kênh chưa có dữ liệu tháng này hiện \"—\".":
    "Always shows all 6 Platform × BU combinations matching the filter — channels with no data this month show \"—\".",

  // Weekly page
  "Weekly": "Weekly",
  "Theo dõi hiệu quả theo tuần (Thứ 2 → Chủ nhật) — nguồn: 5 sheet chi tiết giao dịch, group theo tuần. Đổi":
    "Track performance by week (Mon–Sun) — source: 5 transaction detail sheets, grouped by week. Change",
  "và": "and",
  "ở thanh lọc phía trên.": "in the filter bar above.",
  "GMV theo tuần": "GMV by week",
  "20 tuần gần nhất (30/03–16/08/2026). Vòng tròn rỗng = tuần chưa trọn 7 ngày.":
    "Last 20 weeks (30/03–16/08/2026). Hollow circle = week not yet complete.",
  "Nguồn: 5 sheet chi tiết giao dịch, group theo Order Time / Time Created / Date của từng đơn hàng.":
    "Source: 5 transaction detail sheets, grouped by each order's Order Time / Time Created / Date.",
  "Kênh cần chú ý (GMV lệch ≥ 15% so với tuần so sánh)": "Channels to watch (GMV shift ≥ 15% vs. compare week)",
  "Alert list": "Alert list",
  "Tự động rà toàn bộ kênh khớp bộ lọc, sort theo mức lệch lớn nhất.":
    "Automatically scans every channel matching the filter, sorted by largest deviation.",
  "Không có kênh nào lệch quá ±15% GMV so với tuần đang so sánh.":
    "No channel shifted more than ±15% GMV vs. the compare week.",
  "Luôn hiện đủ 6 tổ hợp Platform × BU khớp bộ lọc — kênh chưa có dữ liệu tuần này hiện \"—\".":
    "Always shows all 6 Platform × BU combinations matching the filter — channels with no data this week show \"—\".",
  "Tuần đang xem — theo đúng Platform/BU đang lọc. Shopee: Kênh traffic (Facebook/Websites/Shopee Video/Shopee Live/Khác). TikTok Shop: Content Type (Video/External Traffic/Showcase/Livestream/Khác).":
    "Selected week — matching the current Platform/BU filter. Shopee: traffic channel (Facebook/Websites/Shopee Video/Shopee Live/Other). TikTok Shop: content type (Video/External Traffic/Showcase/Livestream/Other).",

  // Affiliate page
  "Hiệu suất creator/affiliate": "Creator/affiliate performance",
  "Top Creator / Affiliate theo GMV": "Top Creator / Affiliate by GMV",
  "Bar ngang": "Horizontal bar",
  "GMV theo Category sản phẩm": "GMV by product category",
  "GMV theo Loại chiến dịch": "GMV by campaign type",
  "GMV theo nguồn Creator (GMV Source)": "GMV by creator source (GMV Source)",
  "Stacked bar 100%": "100% stacked bar",
  "Chi tiết Creator": "Creator detail",
  "Bảng": "Table",

  // Affiliate page (extra)
  "Không có creator nào khớp bộ lọc ở kỳ này.": "No creators match the filter this period.",
  "Không tìm thấy creator khớp": "No creator found matching",
  "khớp tìm kiếm": "matching search",
  "Category chuẩn hoá (L1/L2/L3) chỉ có ở dữ liệu Shopee.":
    "Standardized category (L1/L2/L3) is only available in Shopee data.",
  "Không có dữ liệu cho kỳ này.": "No data for this period.",
  "Campaign Type (Mở rộng/Mục tiêu) chỉ có ở dữ liệu Shopee.":
    "Campaign Type (Expansion/Targeted) is only available in Shopee data.",
  "Cột GMV Source (Seller/Affiliate/MCN) chỉ có ở dữ liệu TikTok Shop.":
    "The GMV Source column (Seller/Affiliate/MCN) is only available in TikTok Shop data.",
  "Top 10 mỗi trang —": "Top 10 per page —",
  ", tô màu theo platform.": ", colored by platform.",
  "Shopee — cột L1 Global Category,": "Shopee — L1 Global Category column,",
  "Shopee — Mở rộng vs. Mục tiêu,": "Shopee — Expansion vs. Targeted,",
  "TikTok Shop — Seller Creator / Affiliate Creator / MCN,":
    "TikTok Shop — Seller Creator / Affiliate Creator / MCN,",
  " · So sánh với ": " · Compared with ",
  " — Shopee + TikTok Shop.": " — Shopee + TikTok Shop.",
  "Nguồn: group theo Affiliate Username (Shopee) / Creator Username (TikTok Shop). Lazada không có dữ liệu creator ở cấp giao dịch.":
    "Source: grouped by Affiliate Username (Shopee) / Creator Username (TikTok Shop). Lazada has no creator-level transaction data.",
  "Nguồn: VN Shopee PC'26 + MCC'26.": "Source: VN Shopee PC'26 + MCC'26.",
  "Nguồn: VN Shopee PC'26 + MCC'26 — cột Campaign Type.": "Source: VN Shopee PC'26 + MCC'26 — Campaign Type column.",
  "Nguồn: (Updated) VN TTS PC'26 + MCC'26 — cột GMV Source.": "Source: (Updated) VN TTS PC'26 + MCC'26 — GMV Source column.",
  "ROAS = GMV ÷ Payout của đúng kỳ đang xem. \"Mới\" = creator chưa từng có doanh thu ở bất kỳ kỳ nào trước đó (trong phạm vi top-50/kênh đang track).":
    "ROAS = GMV ÷ Payout for the exact period shown. \"New\" = a creator with no revenue in any prior period (within the tracked top-50/channel scope).",
  "Đổi": "Change",
  "và kỳ báo cáo ở thanh lọc phía trên.": "and report period in the filter bar above.",
  "nguồn: 5 sheet chi tiết (Shopee, Lazada, TikTok Shop × PC/MCC).":
    "source: 5 transaction detail sheets (Shopee, Lazada, TikTok Shop × PC/MCC).",

  // Operations page
  "Vận hành: Payout & ROAS": "Operations: Payout & ROAS",
  "Payout theo kênh": "Payout by channel",
  "Bar": "Bar",
  "ROAS & Avg Commission % theo kênh": "ROAS & Avg Commission % by channel",
  "Phễu trạng thái đơn hàng": "Order status funnel",
  "Bar xếp hạng": "Ranked bar",
  "chưa có dữ liệu Payout/ROAS chi tiết (tháng chưa diễn ra hoặc chưa trích xuất).":
    "has no detailed Payout/ROAS data yet (month hasn't happened or hasn't been extracted).",
  "Tổng Payout": "Total Payout",
  "ROAS bình quân (blend)": "Average ROAS (blend)",
  "Số kênh đang chạy": "Active channels",
  "Lazada không có cột Order Status trong sheet nguồn.": "Lazada has no Order Status column in the source sheet.",
  "GMV thật: ": "Real GMV: ",
  "Không có dữ liệu cho tháng này.": "No data for this month.",
  "Hiệu quả chi hoa hồng theo kênh — nguồn: 5 sheet chi tiết giao dịch, group theo tháng (Tháng 4–8/2026).":
    "Commission spend efficiency by channel — source: 5 transaction detail sheets, grouped by month (Month 4–8/2026).",
  "ở thanh lọc phía trên để xem theo từng tháng.": "in the filter bar above to view by month.",
  "Nguồn: Σ commission/spend theo đơn hàng — Shopee: \"Order Brand Commission to Affiliate\"; TikTok Shop: Commission + Shop Ads + creator bonus; Lazada: \"Est. Spend\".":
    "Source: Σ commission/spend per order — Shopee: \"Order Brand Commission to Affiliate\"; TikTok Shop: Commission + Shop Ads + creator bonus; Lazada: \"Est. Spend\".",
  "Không dùng dual-axis — Avg Comm % ghép nhãn trên cùng bar.": "No dual-axis — Avg Comm % is appended to the same bar's label.",
  "TikTok Shop PC có ít đơn đã settle ở tháng đầu (T5, T8) nên ROAS bị đẩy lên rất cao — đây là độ trễ ghi nhận hoa hồng, không phải hiệu quả thật.":
    "TikTok Shop PC has few settled orders in its first months (May, Aug), which pushes ROAS artificially high — this is commission-recognition lag, not real performance.",
  "Shopee + TikTok Shop, tháng đang chọn — mỗi platform 1 bộ trạng thái riêng.":
    "Shopee + TikTok Shop, selected month — each platform has its own status set.",
  "Lazada không có cột Order Status nên không hiện ở đây. Shopee: GMV thật = đơn \"Hoàn thành\". TikTok Shop: GMV thật = Settled + Completed.":
    "Lazada has no Order Status column so it isn't shown here. Shopee: real GMV = \"Completed\" orders. TikTok Shop: real GMV = Settled + Completed.",
  "Payout & ROAS theo ngày trong tháng": "Payout & ROAS by day of month",
  "Line chart · chưa build": "Line chart · not built",
  "Cần group dữ liệu giao dịch theo ngày thay vì theo tháng — chưa làm ở bản này.":
    "Requires grouping transaction data by day instead of by month — not done in this version.",
  "5 sheet chi tiết có cột ngày giờ đặt đơn (Order Time/Time Created) nên hoàn toàn có thể group theo ngày khi cần, tương tự cách đã group theo tháng ở trên.":
    "The 5 detail sheets have order date/time columns (Order Time/Time Created) so grouping by day is entirely possible when needed, the same way grouping by month was done above.",

  // Content page
  "Để trống — bổ sung sau khi có yêu cầu cụ thể.": "Left empty — to be added once there's a specific request.",
  "Chưa xây dựng ở phiên bản này": "Not built in this version",
  "Cột": "The",
  "ở 2 sheet TikTok Shop detail (xem tab Affiliate & Creator) đã sẵn sàng dùng ngay khi cần mở rộng. Nếu cần thêm nhịp độ đăng bài hằng ngày, nối lại sheet":
    "column in the 2 TikTok Shop detail sheets (see the Affiliate & Creator tab) is ready to use as soon as this needs expanding. If a daily posting cadence is needed, reconnect the sheet",
  "(hiện tạm gác).": "(currently on hold).",

  // Trend chart / shared chart chrome
  "Tách theo Platform": "Split by Platform",
  "target là tổng target trong phạm vi đang lọc.": "target is the total target within the current filter scope.",
  "Đang xem": "Viewing",
  "Tháng": "Month",
  "Target": "Target",
  "GMV theo tuần, không có target tuần.": "GMV by week, no weekly target.",
  "Tuần": "Week",
  "Tuần chưa trọn (MTD)": "Week in progress (MTD)",

  // Overview KPI row / channel table (overview-client.tsx)
  "không có dữ liệu cho": "no data for",
  "bộ lọc này": "this filter",
  "GMV toàn kênh": "GMV all channels",
  "không có kênh khớp bộ lọc": "no channel matches the filter",
  "số MTD": "MTD figure",
  "chưa diễn ra": "hasn't happened yet",
  "Target GMV": "Target GMV",
  "% Đạt Target": "% Target Achieved",
  "đạt": "on track",
  "gần đạt": "near target",
  "rủi ro": "at risk",
  "Tăng trưởng MoM": "MoM growth",
  "tốt": "good",
  "giảm": "down",
  "Tỷ lệ đơn Hoàn thành": "Completion rate",
  "kênh này": "this channel",
  "không có cột Order Status": "has no Order Status column",
  "Tỷ lệ hoàn (Refund)": "Refund rate",
  "thấp": "low",
  "theo dõi": "watch",
  "không có cột Refund": "has no Refund column",
  "4 thẻ đầu nguồn VN RunRate'26. 4 thẻ sau (Avg Commission/ROAS/Hoàn thành/Refund) tính trực tiếp từ 5 sheet chi tiết giao dịch, theo đúng Tháng + Platform + BU đang chọn — GMV nội bộ của nhóm này có thể lệch nhẹ so với 4 thẻ đầu do khác nguồn tổng hợp. Lazada không có cột Order Status/Refund nên Tỷ lệ Hoàn thành/Refund luôn để trống cho kênh đó.":
    "The first 4 cards come from VN RunRate'26. The last 4 (Avg Commission/ROAS/Completion/Refund) are computed directly from the 5 transaction detail sheets, matching the selected Month + Platform + BU — internal GMV for this group may differ slightly from the first 4 cards due to a different data source. Lazada has no Order Status/Refund column so its Completion rate/Refund always show blank.",
  "chưa diễn ra — chưa có số liệu thực tế, chỉ có target.": "hasn't happened yet — no actual figures, target only.",
  "thực tế.": "actual.",
  "không có kênh nào có cả target và số liệu thực tế cho bộ lọc này.": "no channel has both target and actual figures for this filter.",
  "sắp xếp theo % thấp → cao.": "sorted by % low → high.",
  "Lazada không có cột Content Type/Channel trong sheet nguồn.": "Lazada has no Content Type/Channel column in the source sheet.",
  "Không có kênh nào khớp bộ lọc.": "No channel matches the filter.",
  "Chi tiết \"Khác\"": "\"Other\" detail",
  "Tháng đang chọn, so với tháng trước. Shopee: Kênh traffic (Facebook/Websites/Shopee Video/Shopee Live/Khác). TikTok Shop: Content Type (Video/External Traffic/Showcase/Livestream/Khác).":
    "Selected month, vs. the previous month. Shopee: traffic channel (Facebook/Websites/Shopee Video/Shopee Live/Other). TikTok Shop: content type (Video/External Traffic/Showcase/Livestream/Other).",
  "Lazada không có cột tương đương trong sheet nguồn nên không hiện ở đây. Shopee gộp ~20 giá trị Channel gốc về 4 nhóm chính + \"Khác\" để nhất quán qua các tháng — di chuột vào \"Khác\" để xem chi tiết từng kênh gốc bên trong.":
    "Lazada has no equivalent column in the source sheet so it isn't shown here. Shopee consolidates ~20 raw Channel values into 4 main groups + \"Other\" for consistency across months — hover over \"Other\" to see each underlying channel.",
  "So sánh với tháng liền trước (MoM) — không có \"so cùng tháng năm trước\" vì dữ liệu nguồn chỉ có 1 năm. Lazada không có cột Order Status/Refund nên Hoàn thành/Refund luôn để trống cho kênh đó; Lazada PC hiện chưa vận hành nên luôn \"—\". ROAS = GMV ÷ Payout của đúng tháng đang xem, không phải trung bình.":
    "Compared with the immediately preceding month (MoM) — no \"same month last year\" since the source data only spans 1 year. Lazada has no Order Status/Refund column so Completion/Refund always show blank for that channel; Lazada PC isn't operating yet so it always shows \"—\". ROAS = GMV ÷ Payout for the exact month shown, not an average.",
  "Kênh traffic": "Traffic channel",

  // Weekly KPI row / channel table (weekly-client.tsx)
  "So cùng tuần tháng trước": "Same week last month",
  "chưa chọn": "not selected",
  "là xấp xỉ vì tháng không chia hết cho tuần, không phải cùng ngày lịch chính xác.":
    "is approximate since months don't divide evenly into weeks — not the exact same calendar day.",
  "So cùng tuần th. trước": "Same wk. last mo.",
  "Không có dữ liệu cho tuần này.": "No data for this week.",
  "Tuần đang xem, so với tuần ở ô So sánh với. Shopee: Kênh traffic (Facebook/Websites/Shopee Video/Shopee Live/Khác). TikTok Shop: Content Type (Video/External Traffic/Showcase/Livestream/Khác).":
    "Selected week, vs. the week in the Compare with field. Shopee: traffic channel (Facebook/Websites/Shopee Video/Shopee Live/Other). TikTok Shop: content type (Video/External Traffic/Showcase/Livestream/Other).",
  "\"So sánh\" đối chiếu với tuần bạn chọn ở ô": "\"Compare\" checks against the week you chose in",
  "\"so cùng tuần tháng trước\" luôn tự động lùi lại đúng 4 tuần": "\"same week last month\" always automatically goes back exactly 4 weeks",
  "Lazada không có cột tương đương trong sheet nguồn nên không hiện ở đây. Shopee gộp ~20 giá trị Channel gốc về 4 nhóm chính + \"Khác\" để nhất quán qua các tuần — di chuột vào \"Khác\" để xem chi tiết từng kênh gốc bên trong.":
    "Lazada has no equivalent column in the source sheet so it isn't shown here. Shopee consolidates ~20 raw Channel values into 4 main groups + \"Other\" for consistency across weeks — hover over \"Other\" to see each underlying channel.",
  "Lazada không có cột Order Status/Refund nên Hoàn thành/Refund luôn để trống cho kênh đó, giống tab Vận hành; Lazada PC hiện chưa vận hành nên luôn \"—\". ROAS = GMV ÷ Payout của đúng tuần đang xem, không phải trung bình. TikTok Shop PC và Lazada MCC có volume thấp theo tuần nên ROAS/% so sánh có thể biến động mạnh do độ trễ ghi nhận hoa hồng hoặc chỉ vài đơn — đọc cùng với cột Đơn để tránh hiểu nhầm là xu hướng thật.":
    "Lazada has no Order Status/Refund column so Completion/Refund always show blank for that channel, same as the Operations tab; Lazada PC isn't operating yet so it always shows \"—\". ROAS = GMV ÷ Payout for the exact week shown, not an average. TikTok Shop PC and Lazada MCC have low weekly volume so ROAS/% comparisons can swing sharply due to commission-recognition lag or just a few orders — read alongside the Orders column to avoid mistaking it for a real trend.",
};

export function translate(vi: string, lang: Lang): string {
  if (lang === "vi") return vi;
  return DICT[vi] ?? vi;
}

/** "Tháng 7/2026 (MTD)" -> "Month 7/2026 (MTD)" — chỉ đổi mỗi từ "Tháng", số/format giữ nguyên. */
export function translateMonthLabel(label: string, lang: Lang): string {
  if (lang === "vi") return label;
  return label.replace("Tháng", "Month");
}
