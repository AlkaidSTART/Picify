import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });

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
    <html
      className={`${sans.variable} ${display.variable} h-full antialiased`}
      lang="zh-CN"
    >
      <body className="flex min-h-full flex-col bg-[var(--color-base)] text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
