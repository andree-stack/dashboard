import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Philips VN Marketplace Performance Dashboard",
  description:
    "Dashboard GMV, Affiliate/Creator và Vận hành cho Philips VN Marketplace (Shopee, Lazada, TikTok Shop).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
