"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const STEPS = [
  { key: "persona", label: "选人群" },
  { key: "scene", label: "选场景" },
  { key: "params", label: "填参数" },
  { key: "result", label: "看结果" },
];

interface StepProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (!fillRef.current) return;

    const fraction = currentStep / (STEPS.length - 1);
    gsap.to(fillRef.current, {
      width: `${fraction * 100}%`,
      duration: 0.4,
      ease: "power2.inOut",
    });

    prevStepRef.current = currentStep;
  }, [currentStep]);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isFuture = i > currentStep;
        const canClick = isCompleted;

        return (
          <button
            key={step.key}
            className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              canClick
                ? "cursor-pointer hover:bg-[var(--color-brand)]"
                : ""
            } ${isCurrent ? "text-[var(--color-brand-strong)]" : ""} ${
              isFuture ? "text-[var(--color-muted)]/60" : ""
            } ${isCompleted ? "text-[var(--color-brand-deep)]" : ""}`}
            type="button"
            disabled={!canClick}
            onClick={() => canClick && onStepClick?.(i)}
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                isCurrent
                  ? "bg-[var(--color-brand-strong)] text-white"
                  : isCompleted
                    ? "bg-[var(--color-brand)] text-[var(--color-brand-deep)]"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-muted)]"
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
