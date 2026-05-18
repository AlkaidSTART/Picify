"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Zap, Brain, Check, LoaderCircle } from "lucide-react";

interface MobileActionBarProps {
  mode: "basic" | "advanced";
  onModeChange: (mode: "basic" | "advanced") => void;
  canGenerate: boolean;
  costCredits: number;
  remainingCredits: number | null;
  submitting: boolean;
  onGenerate: () => void;
}

export function MobileActionBar({
  mode,
  onModeChange,
  canGenerate,
  costCredits,
  remainingCredits,
  submitting,
  onGenerate,
}: MobileActionBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (delta > 10) setVisible(false);
      else if (delta < -5) setVisible(true);
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!barRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        y: visible ? 0 : 100,
        duration: 0.3,
        ease: "power2.inOut",
      });
    });
    return () => ctx.revert();
  }, [visible]);

  return (
    <div
      ref={barRef}
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-[var(--launch-border)] bg-white/96 px-4 py-3 backdrop-blur-xl sm:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="flex rounded-xl border border-[var(--launch-border)] bg-white p-0.5">
          <button
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              mode === "basic"
                ? "bg-[var(--launch-duck)] text-[var(--launch-ink)]"
                : "text-[var(--launch-muted)]"
            }`}
            type="button"
            onClick={() => onModeChange("basic")}
          >
            <Zap className="h-3 w-3" />
            基础
          </button>
          <button
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              mode === "advanced"
                ? "bg-[var(--launch-duck)] text-[var(--launch-ink)]"
                : "text-[var(--launch-muted)]"
            }`}
            type="button"
            onClick={() => onModeChange("advanced")}
          >
            <Brain className="h-3 w-3" />
            高级
          </button>
        </div>

        <button
          className="launch-btn-primary flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all active:scale-95 disabled:bg-[var(--launch-border)]"
          disabled={!canGenerate || submitting}
          type="button"
          onClick={onGenerate}
        >
          {submitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          生成（{costCredits} 次）
        </button>

        {/* 余额 */}
        {remainingCredits !== null && (
          <span className="text-xs text-[var(--launch-muted)]">
            {remainingCredits} 次
          </span>
        )}
      </div>
    </div>
  );
}
