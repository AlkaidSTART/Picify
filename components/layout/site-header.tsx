"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

type SiteHeaderProps = {
  variant?: "default" | "home";
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const isHome = variant === "home";

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
      className={
        isHome
          ? "sticky top-0 z-30 border-b border-[var(--home-border)] bg-[rgba(247,244,236,0.92)] backdrop-blur-xl"
          : "sticky top-0 z-30 border-b border-[var(--launch-border)] bg-white/96 backdrop-blur-xl"
      }
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className={
              isHome
                ? "home-mark text-3xl leading-none text-[var(--home-ink)]"
                : "flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--launch-border)] bg-[var(--launch-paper)] text-[var(--launch-ink)]"
            }
          >
            {isHome ? "P" : "P"}
          </div>
          <div className="space-y-0.5">
            <p
              className={
                isHome
                  ? "text-sm font-semibold text-[var(--home-ink)]"
                  : "text-sm font-semibold"
              }
            >
              Picify
            </p>
            <p
              className={
                isHome
                  ? "text-xs text-[var(--home-muted)]"
                  : "text-xs text-[var(--launch-muted)]"
              }
            >
              智能场景绘图
            </p>
          </div>
        </div>

        <Link
          className={
            isHome
              ? "inline-flex items-center gap-2 rounded-full bg-[var(--home-ink)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-black hover:shadow-[0_0_0_6px_rgba(30,30,26,0.12)]"
              : "launch-btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all"
          }
          href="/dashboard"
        >
          进入创作台
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
