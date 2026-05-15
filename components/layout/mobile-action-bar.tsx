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
      className="glass-deep fixed bottom-0 left-0 right-0 z-40 rounded-none border-b-0 border-x-0 px-4 py-3 sm:hidden"
    >
      <div className="flex items-center gap-3">
        {/* 模式切换 */}
        <div className="flex rounded-xl border border-[var(--color-border)] bg-white/80 p-0.5">
          <button
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              mode === "basic"
                ? "bg-[var(--color-brand-strong)] text-white"
                : "text-[var(--color-muted)]"
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
                ? "bg-[var(--color-brand-strong)] text-white"
                : "text-[var(--color-muted)]"
            }`}
            type="button"
            onClick={() => onModeChange("advanced")}
          >
            <Brain className="h-3 w-3" />
            高级
          </button>
        </div>

        {/* 生成按钮 */}
        <button
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-strong)] px-4 text-sm font-semibold text-white transition-all active:scale-95 disabled:bg-[var(--color-border)]"
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
          <span className="text-xs text-[var(--color-muted)]">{remainingCredits} 次</span>
        )}
      </div>
    </div>
  );
}
