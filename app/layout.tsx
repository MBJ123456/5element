import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "五行 × 体质 · 日常助手",
  description: "极简水墨风 · 五行人格 × 中医体质 × 天气每日建议"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="ink-bg min-h-screen text-ink">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}


