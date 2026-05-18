"use client";

import { Check, LoaderCircle, Palette, Zap, Brain } from "lucide-react";

type ParamOption = { label: string; value: string };
type SceneParam = {
  key: string;
  label: string;
  type: "select" | "text" | "image" | "color";
  required: boolean;
  placeholder?: string;
  options?: ParamOption[];
};

interface StepParamsProps {
  params: SceneParam[];
  formValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
  mode: "basic" | "advanced";
  onModeChange: (mode: "basic" | "advanced") => void;
  missingCount: number;
  costCredits: number;
  remainingCredits: number | null;
  submitting: boolean;
  onGenerate: () => void;
}

export function StepParams({
  params,
  formValues,
  onFieldChange,
  mode,
  onModeChange,
  missingCount,
  costCredits,
  remainingCredits,
  submitting,
  onGenerate,
}: StepParamsProps) {
  const canGenerate = missingCount === 0 && !submitting;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="launch-card rounded-[2rem] p-6 sm:p-8">
        {params.length === 0 ? (
          <p className="rounded-xl border border-[var(--launch-border)] bg-white p-4 text-sm text-[var(--launch-muted)]">
            请先选择人群与场景
          </p>
        ) : (
          <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {params.map((param) => {
              const value = formValues[param.key] ?? "";

              if (param.type === "select") {
                return (
                  <div key={param.key}>
                    <label className="mb-2 block text-sm font-medium text-[var(--launch-ink)]">
                      {param.label}
                      {param.required && (
                        <span className="text-[var(--launch-duck)]"> *</span>
                      )}
                    </label>
                    <select
                      className="launch-input h-11 w-full rounded-xl px-3 text-sm transition-all"
                      value={value}
                      onChange={(e) => onFieldChange(param.key, e.target.value)}
                    >
                      <option value="">请选择</option>
                      {(param.options ?? []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (param.type === "color") {
                return (
                  <div key={param.key} className="sm:col-span-2">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--launch-ink)]">
                      <Palette className="h-4 w-4 text-[var(--launch-ink)]" />
                      {param.label}
                      {param.required && (
                        <span className="text-[var(--launch-duck)]"> *</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {(param.options ?? []).map((opt) => (
                        <button
                          key={opt.value}
                          className={`h-10 rounded-xl border px-2 text-xs transition-all ${
                            value === opt.value
                              ? "border-[var(--launch-duck)] bg-[var(--launch-duck)] text-[var(--launch-ink)]"
                              : "border-[var(--launch-border)] bg-white hover:border-[var(--launch-ink)]"
                          }`}
                          type="button"
                          onClick={() => onFieldChange(param.key, opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={param.key}>
                  <label className="mb-2 block text-sm font-medium text-[var(--launch-ink)]">
                    {param.label}
                    {param.required && (
                      <span className="text-[var(--launch-duck)]"> *</span>
                    )}
                  </label>
                  <input
                    className="launch-input h-11 w-full rounded-xl px-3 text-sm transition-all"
                    placeholder={param.placeholder ?? "请输入"}
                    type="text"
                    value={value}
                    onChange={(e) => onFieldChange(param.key, e.target.value)}
                  />
                </div>
              );
            })}
          </form>
        )}

        {params.length > 0 && <hr className="launch-divider my-6" />}

        {params.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold text-[var(--launch-ink)]">
              模式选择
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  mode === "basic"
                    ? "border-[var(--launch-duck)] bg-white"
                    : "border-[var(--launch-border)] bg-white hover:border-[var(--launch-ink)]"
                }`}
                type="button"
                onClick={() => onModeChange("basic")}
              >
                <Zap className="mt-0.5 h-5 w-5 text-[var(--launch-ink)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--launch-ink)]">
                    基础模式
                  </p>
                  <p className="mt-1 text-xs text-[var(--launch-muted)]">
                    消耗 1 次
                  </p>
                </div>
              </button>
              <button
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  mode === "advanced"
                    ? "border-[var(--launch-duck)] bg-white shadow-[0_8px_20px_rgba(29,29,24,0.06)]"
                    : "border-[var(--launch-border)] bg-white hover:border-[var(--launch-ink)]"
                }`}
                type="button"
                onClick={() => onModeChange("advanced")}
              >
                <Brain className="mt-0.5 h-5 w-5 text-[var(--launch-ink)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--launch-ink)]">
                    高级模式
                  </p>
                  <p className="mt-1 text-xs text-[var(--launch-muted)]">
                    消耗 2 次
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {params.length > 0 && (
          <div className="mt-6">
            <button
              className="launch-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:bg-[var(--launch-border)] disabled:text-white"
              disabled={!canGenerate}
              type="button"
              onClick={onGenerate}
            >
              {submitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              生成图片（{costCredits} 次）
            </button>

            {missingCount > 0 && (
              <p className="mt-2 text-center text-xs text-[var(--launch-duck)]">
                仍有 {missingCount} 个必填项未完成
              </p>
            )}

            {remainingCredits !== null && remainingCredits < costCredits && (
              <p className="mt-2 text-center text-xs text-[var(--launch-duck)]">
                余额不足，请先充值
              </p>
            )}

            {remainingCredits !== null && (
              <p className="mt-2 text-center text-xs text-[var(--launch-muted)]">
                剩余 {remainingCredits} 次
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
