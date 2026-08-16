"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-accent text-[16px] font-bold text-white">
            P
          </span>
          <h1 className="text-[18px] font-bold text-ink-1">
            Philips VN Marketplace
          </h1>
          <p className="text-[13px] text-ink-3">Performance Dashboard</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@tamsaglobal.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13.5px] text-ink-1 outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-2">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13.5px] text-ink-1 outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-crit-bg px-3 py-2 text-[12.5px] text-crit-ink">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-3 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-5 text-center text-[11.5px] text-ink-3">
          Demo — mật khẩu mặc định:{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5">philips2026</code>
        </p>
      </div>
    </main>
  );
}
