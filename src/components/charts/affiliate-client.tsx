"use client";

import { useMemo } from "react";
import { useFilters } from "@/components/filter-context";
import { BarList } from "@/components/charts/bar-list";
import { StackedPercentBar } from "@/components/charts/stacked-percent-bar";
import {
  topCreators,
  categoryGmv,
  trafficChannelGmv,
  gmvSourceByBu,
  contentTypeGmv,
  campaignTypeByBu,
  orderStatusFunnel,
  type Platform,
} from "@/lib/data";
import { formatVnd, formatPercent } from "@/lib/utils";

function NotApplicable({ note }: { note: string }) {
  return (
    <p className="rounded-lg bg-surface-alt px-3 py-6 text-center text-[12.5px] text-ink-3">
      {note}
    </p>
  );
}

export function TopCreatorsSection() {
  const { platform } = useFilters();
  const effective: Platform = platform === "Tất cả" ? "TikTok Shop" : platform;
  const rows = topCreators[effective] ?? [];

  if (rows.length === 0) {
    return <NotApplicable note="Lazada không có dữ liệu Creator ở cấp giao dịch (chỉ theo Sản phẩm × Ngày)." />;
  }

  return (
    <>
      <BarList data={rows.map((r) => ({ name: r.name, value: r.gmv }))} />
      <p className="mt-2 text-[11px] text-ink-3">
        Đang hiển thị: <b>{effective}</b> — đổi bộ lọc Platform để xem kênh khác.
      </p>
    </>
  );
}

export function CategorySection() {
  const { platform } = useFilters();
  if (platform !== "Tất cả" && platform !== "Shopee") {
    return <NotApplicable note="Category chuẩn hoá (L1/L2/L3) chỉ có ở dữ liệu Shopee." />;
  }
  return <BarList data={categoryGmv.map((c) => ({ name: c.category, value: c.gmv }))} />;
}

export function TrafficChannelSection() {
  const { platform } = useFilters();
  if (platform !== "Tất cả" && platform !== "Shopee") {
    return <NotApplicable note="Cột kênh Traffic chỉ có ở dữ liệu Shopee." />;
  }
  return <BarList data={trafficChannelGmv.map((c) => ({ name: c.channel, value: c.gmv }))} />;
}

export function GmvSourceSection() {
  const { platform, bu } = useFilters();
  const bus = bu === "Tất cả" ? (["PC", "MCC"] as const) : ([bu] as const);
  const totals = useMemo(
    () =>
      bus.map((b) => {
        const rows = gmvSourceByBu[b];
        const total = rows.reduce((s, r) => s + r.gmv, 0);
        const entry: Record<string, number | string> = { bu: b };
        rows.forEach((r) => (entry[r.source] = r.gmv));
        return { entry, total };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bu]
  );

  if (platform !== "Tất cả" && platform !== "TikTok Shop") {
    return <NotApplicable note="Cột GMV Source (Seller/Affiliate/MCN) chỉ có ở dữ liệu TikTok Shop." />;
  }

  return (
    <>
      <StackedPercentBar
        data={totals.map((t) => t.entry)}
        keys={["Seller Creator", "Affiliate Creator", "MCN"]}
      />
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-3">
        {totals.map((t, i) => (
          <span key={i}>
            {bus[i]}: {formatVnd(t.total)}
          </span>
        ))}
      </div>
    </>
  );
}

export function ContentTypeSection() {
  const { platform, bu } = useFilters();
  if (platform !== "Tất cả" && platform !== "TikTok Shop") {
    return <NotApplicable note="Content Type chỉ có ở dữ liệu TikTok Shop." />;
  }
  if (bu === "PC") {
    return <NotApplicable note="Content Type chỉ populate đầy đủ ở kênh MCC trong dữ liệu hiện có." />;
  }
  const total = contentTypeGmv.reduce((s, r) => s + r.gmv, 0);
  return (
    <>
      <BarList data={contentTypeGmv.map((c) => ({ name: c.type, value: c.gmv }))} />
      <p className="mt-2 text-[11px] text-ink-3">
        % tính trên phần GMV do Affiliate Creator tạo ra ({formatVnd(total)}).
      </p>
    </>
  );
}

export function CampaignTypeSection() {
  const { platform, bu } = useFilters();
  if (platform !== "Tất cả" && platform !== "Shopee") {
    return <NotApplicable note="Campaign Type (Mở rộng/Mục tiêu) chỉ có ở dữ liệu Shopee." />;
  }
  const bus = bu === "Tất cả" ? (["PC", "MCC"] as const) : ([bu] as const);

  return (
    <div className="space-y-4">
      {bus.map((b) => (
        <div key={b}>
          <div className="mb-1.5 text-[11.5px] font-bold text-ink-2">{b}</div>
          <BarList
            height={90}
            data={campaignTypeByBu[b].map((c) => ({ name: c.type, value: c.gmv }))}
          />
        </div>
      ))}
    </div>
  );
}

export function OrderStatusSection() {
  const { platform } = useFilters();
  if (platform !== "Tất cả" && platform !== "TikTok Shop") {
    return <NotApplicable note="Phễu trạng thái minh hoạ theo dữ liệu TikTok Shop MCC." />;
  }
  const total = orderStatusFunnel.reduce((s, r) => s + r.gmv, 0);
  const realTotal = orderStatusFunnel.filter((r) => r.real).reduce((s, r) => s + r.gmv, 0);

  return (
    <>
      <BarList
        data={orderStatusFunnel.map((r) => ({
          name: `${r.status} · ${formatPercent((r.gmv / total) * 100, 0)}`,
          value: r.gmv,
          color: r.real ? "var(--color-good)" : "var(--color-crit)",
        }))}
      />
      <p className="mt-2 inline-block rounded-md bg-accent-soft px-2.5 py-1 text-[11.5px] text-accent-ink">
        Chỉ Settled + Completed ({formatPercent((realTotal / total) * 100, 0)}) là GMV đã ghi
        nhận thật.
      </p>
    </>
  );
}
