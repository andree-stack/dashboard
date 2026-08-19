"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarRange, Users, Activity, FolderClock, LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";

const tabs = [
  { href: "/overview", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/weekly", label: "Weekly", icon: CalendarRange },
  { href: "/affiliate", label: "Affiliate & Creator", icon: Users },
  { href: "/operations", label: "Vận hành", icon: Activity },
  { href: "/content", label: "Content & Chiến dịch", icon: FolderClock },
];

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-[13px] font-bold text-white">
            P
          </span>
          <div className="leading-tight">
            <div className="text-[13.5px] font-bold text-ink-1">
              Philips VN Marketplace
            </div>
            <div className="text-[10.5px] text-ink-3">Performance Dashboard</div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {tabs.map((t) => {
            const active = pathname?.startsWith(t.href);
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "bg-accent-soft text-accent-ink"
                    : "text-ink-2 hover:bg-surface-alt"
                )}
              >
                <Icon size={14} />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOutAction} className="flex items-center gap-3">
          <span className="hidden text-[12px] text-ink-3 sm:inline">{userName}</span>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-semibold text-ink-2 hover:bg-surface-alt"
          >
            <LogOut size={13} />
            Đăng xuất
          </button>
        </form>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {tabs.map((t) => {
          const active = pathname?.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "shrink-0 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold",
                active ? "bg-accent-soft text-accent-ink" : "text-ink-2"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
