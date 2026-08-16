# Philips VN Marketplace — Performance Dashboard

Web app dashboard cho báo cáo hiệu suất Marketplace Philips Việt Nam (Shopee, Lazada,
TikTok Shop × PC/MCC), dựng theo bản đặc tả trong repo này.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — design tokens (light/dark) khai báo trong `src/app/globals.css`
- **[Recharts](https://recharts.org)** — toàn bộ biểu đồ (line, bar, stacked bar)
- **[Auth.js / NextAuth v5](https://authjs.dev)** — xác thực Credentials, session JWT,
  route bảo vệ qua `src/proxy.ts` (Next.js middleware convention mới)
- **bcryptjs**, **zod** — hash mật khẩu, validate

## Cấu trúc

```
src/
  app/
    login/              # trang đăng nhập (server action gọi signIn)
    (dashboard)/         # route group được bảo vệ bởi proxy.ts
      overview/           # Tab 1 — Tổng quan
      affiliate/          # Tab 2 — Affiliate & Creator
      operations/         # Tab 3 — Vận hành: Payout & ROAS
      content/             # Tab 4 — để trống, chờ bổ sung
  components/
    charts/               # các chart Recharts (client components)
    ui/                   # Card, Badge
    filter-context.tsx    # state lọc Platform/BU dùng chung 4 tab
  lib/
    data.ts               # dữ liệu thật, trích từ VN RunRate'26 + 5 sheet detail
    users.ts               # demo user store (thay bằng DB thật khi lên production)
    utils.ts               # format số VND/%, cn()
  auth.ts                  # cấu hình Auth.js (Credentials provider)
```

Dữ liệu trong `lib/data.ts` lấy trực tiếp từ 6 sheet nguồn trong
`Philips_VN MP Performance Report.xlsx` — xem chi tiết nguồn/công thức trong bản đặc tả
dashboard (artifact) đã gửi kèm trong hội thoại. Đây là dữ liệu tĩnh cho bản demo; khi lên
production, thay `lib/data.ts` bằng lớp gọi API/DB thật (ETL từ 6 sheet đó).

## Chạy local

```bash
npm install
cp .env.example .env.local   # rồi điền AUTH_SECRET (openssl rand -base64 32)
npm run dev
```

Đăng nhập demo:

- Email: `admin@tamsaglobal.com` (hoặc giá trị `DEMO_USER_EMAIL` trong `.env.local`)
- Mật khẩu: `philips2026` (hoặc giá trị `DEMO_USER_PASSWORD`)

## Biến môi trường

| Biến | Bắt buộc | Mô tả |
|---|---|---|
| `AUTH_SECRET` | Có | Khoá mã hoá session — `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Có (dev/PaaS) | `true` khi chạy sau proxy hoặc host không chuẩn |
| `DEMO_USER_EMAIL` | Không | Email demo user, mặc định `admin@tamsaglobal.com` |
| `DEMO_USER_PASSWORD` | Không | Mật khẩu demo user, mặc định `philips2026` |

`lib/users.ts` hiện chỉ seed 1 user demo bằng bcrypt hash — thay bằng bảng user thật
(Postgres/Prisma, v.v.) khi triển khai thật, giữ nguyên interface `findUserByEmail` /
`verifyPassword` để không phải sửa `auth.ts`.

## Scripts

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build + type-check
npm run start    # chạy bản build
npm run lint     # ESLint
```
