import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Picify",
  description: "AI scene-based image generation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" lang="zh-CN">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
