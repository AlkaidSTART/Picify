"use client";

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
              canClick ? "cursor-pointer hover:bg-[rgba(208,170,36,0.12)]" : ""
            } ${isCurrent ? "text-[var(--launch-ink)]" : ""} ${
              isFuture ? "text-[var(--launch-muted)]" : ""
            } ${isCompleted ? "text-[var(--launch-ink)]" : ""}`}
            disabled={!canClick}
            type="button"
            onClick={() => canClick && onStepClick?.(i)}
          >
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                isCurrent
                  ? "bg-[var(--launch-duck)] text-[var(--launch-ink)]"
                  : isCompleted
                    ? "bg-[var(--launch-meadow)] text-white"
                    : "border border-[var(--launch-border)] bg-white text-[var(--launch-muted)]"
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
