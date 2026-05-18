"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { DesignCollageStrip } from "@/components/landing/design-collage-strip";
import { HeroSection } from "@/components/landing/hero-section";
import { PersonaSection } from "@/components/landing/persona-section";

export default function Home() {
  return (
    <div className="home-theme min-h-screen bg-[var(--home-bg)] font-sans text-[var(--home-ink)]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="home-orb home-orb--duck" />
        <div className="home-orb home-orb--meadow" />
        <div className="home-grid" />
      </div>

      <SiteHeader variant="home" />

      <main className="relative z-10">
        <HeroSection />
        <DesignCollageStrip />
        <PersonaSection />

        <div className="px-4 pb-12 text-center text-sm text-[var(--home-muted)] sm:px-6 sm:pb-16">
          <span className="font-medium text-[var(--home-ink)]">
            游客仍可免费体验 1 次
          </span>
        </div>
      </main>
    </div>
  );
}
