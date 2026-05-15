"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sparkles, ArrowRight } from "lucide-react";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={headerRef}
      className="glass-deep sticky top-0 z-30 rounded-none border-x-0 border-t-0"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--color-brand-strong)]/30 bg-[var(--color-brand)]">
            <Sparkles className="h-4 w-4 text-[var(--color-brand-strong)]" />
          </div>
          <p className="text-sm font-semibold">Picify 智能场景绘图</p>
        </div>

        <Link
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-strong)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brand-deep)] hover:shadow-[0_0_0_6px_rgba(127,176,234,0.15)]"
          href="/dashboard"
        >
          进入创作台
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
