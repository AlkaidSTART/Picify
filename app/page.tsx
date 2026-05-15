"use client";

import { useBlobs } from "@/hooks/use-gsap";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { PersonaSection } from "@/components/landing/persona-section";

export default function Home() {
  const blobsRef = useBlobs();

  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)] font-sans">
      {/* 背景光晕 Blob */}
      <div ref={blobsRef} className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <SiteHeader />

      <main className="relative z-10">
        <HeroSection />
        <PersonaSection />

        {/* 一句话收尾 */}
        <div className="pb-12 text-center text-sm text-[var(--color-muted)] sm:pb-16">
          基础模式 1 次 / 张 · 高级模式 2 次 / 张 ·{" "}
          <span className="font-medium text-[var(--color-brand-strong)]">游客可免费体验 1 次</span>
        </div>
      </main>
    </div>
  );
}
