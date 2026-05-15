import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Picify 场景化 AI 出图",
  description: "面向 C 端用户的场景化 AI 出图平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" lang="zh-CN">
      <body className="flex min-h-full flex-col bg-white text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
