"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarRange, Users, Activity, FolderClock, LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { usePreferences } from "@/components/preferences-context";
import type { Lang } from "@/lib/i18n";
import type { Currency } from "@/components/preferences-context";

const tabs = [
  { href: "/overview", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/weekly", label: "Weekly", icon: CalendarRange },
  { href: "/affiliate", label: "Affiliate & Creator", icon: Users },
  { href: "/operations", label: "Vận hành", icon: Activity },
  { href: "/content", label: "Content & Chiến dịch", icon: FolderClock },
];

function PrefToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-border text-[11px] font-bold">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "px-2 py-1",
            value === o.value ? "bg-accent-soft text-accent-ink" : "bg-surface text-ink-2 hover:bg-surface-alt"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const { lang, currency, setLang, setCurrency, t } = usePreferences();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[13px] font-bold text-white">
            P
          </span>
          <div className="leading-tight">
            <div className="text-[13.5px] font-bold text-ink-1">{t("Philips VN Marketplace")}</div>
            <div className="text-[10.5px] text-ink-3">{t("Performance Dashboard")}</div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {tabs.map((tab) => {
            const active = pathname?.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "bg-accent-soft text-accent-ink"
                    : "text-ink-2 hover:bg-surface-alt"
                )}
              >
                <Icon size={14} />
                {t(tab.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <PrefToggle<Lang>
            value={lang}
            onChange={setLang}
            options={[
              { value: "vi", label: "VI" },
              { value: "en", label: "EN" },
            ]}
          />
          <PrefToggle<Currency>
            value={currency}
            onChange={setCurrency}
            options={[
              { value: "vnd", label: "₫" },
              { value: "usd", label: "$" },
            ]}
          />
          <form action={signOutAction} className="flex items-center gap-3">
            <span className="hidden text-[12px] text-ink-3 sm:inline">{userName}</span>
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-ink-2 hover:bg-surface-alt"
            >
              <LogOut size={13} />
              {t("Đăng xuất")}
            </button>
          </form>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {tabs.map((tab) => {
          const active = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold",
                active ? "bg-accent-soft text-accent-ink" : "text-ink-2"
              )}
            >
              {t(tab.label)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
