"use client";

import {
  Check,
  LoaderCircle,
  Palette,
  Zap,
  Brain,
  Sparkles,
} from "lucide-react";

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
      <div className="glass-standard rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--color-brand-strong)]" />
          <h3 className="text-lg font-semibold">填写参数</h3>
        </div>

        {/* 参数表单 */}
        {params.length === 0 ? (
          <p className="rounded-xl border border-[var(--color-border)] bg-white/80 p-4 text-sm text-[var(--color-muted)]">
            请先选择人群与场景
          </p>
        ) : (
          <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {params.map((param) => {
              const value = formValues[param.key] ?? "";

              if (param.type === "select") {
                return (
                  <div key={param.key}>
                    <label className="mb-2 block text-sm font-medium">
                      {param.label}
                      {param.required && (
                        <span className="text-[var(--color-brand-strong)]">
                          {" "}
                          *
                        </span>
                      )}
                    </label>
                    <select
                      className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm transition-all outline-none focus:border-[var(--color-brand-strong)] focus:bg-[var(--color-brand)]"
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
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Palette className="h-4 w-4 text-[var(--color-brand-strong)]" />
                      {param.label}
                      {param.required && (
                        <span className="text-[var(--color-brand-strong)]">
                          {" "}
                          *
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {(param.options ?? []).map((opt) => (
                        <button
                          key={opt.value}
                          className={`h-10 rounded-xl border px-2 text-xs transition-all ${
                            value === opt.value
                              ? "border-[var(--color-brand-strong)] bg-[var(--color-brand)] text-[var(--color-brand-strong)]"
                              : "border-[var(--color-border)] bg-white/80 hover:border-[var(--color-brand-strong)]"
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
                  <label className="mb-2 block text-sm font-medium">
                    {param.label}
                    {param.required && (
                      <span className="text-[var(--color-brand-strong)]">
                        {" "}
                        *
                      </span>
                    )}
                  </label>
                  <input
                    className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm transition-all outline-none focus:border-[var(--color-brand-strong)] focus:bg-[var(--color-brand)]"
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

        {/* 分隔线 */}
        {params.length > 0 && <hr className="divider-blue my-6" />}

        {/* 模式切换 */}
        {params.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-semibold">模式选择</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  mode === "basic"
                    ? "border-[var(--color-brand-strong)] bg-[var(--color-brand)]/40"
                    : "border-[var(--color-border)] bg-white/60 hover:border-[var(--color-brand-strong)]"
                }`}
                type="button"
                onClick={() => onModeChange("basic")}
              >
                <Zap className="mt-0.5 h-5 w-5 text-[var(--color-brand-strong)]" />
                <div>
                  <p className="text-sm font-semibold">基础模式</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    消耗 1 次 · 快速出图 · 标准质量
                  </p>
                </div>
              </button>
              <button
                className={`relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  mode === "advanced"
                    ? "border-[var(--color-brand-strong)] bg-[var(--color-brand)]/40 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    : "border-[var(--color-border)] bg-white/60 hover:border-[var(--color-brand-strong)]"
                }`}
                type="button"
                onClick={() => onModeChange("advanced")}
              >
                {mode !== "advanced" && (
                  <span className="absolute -top-2 right-3 rounded-full bg-[var(--color-brand-strong)] px-2 py-0.5 text-[10px] font-semibold text-white">
                    推荐
                  </span>
                )}
                <Brain className="mt-0.5 h-5 w-5 text-[var(--color-brand-strong)]" />
                <div>
                  <p className="text-sm font-semibold">高级模式</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    消耗 2 次 · AI 深度推理 · 更高质量
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 生成按钮 */}
        {params.length > 0 && (
          <div className="mt-6">
            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-strong)] px-5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brand-deep)] hover:shadow-[0_0_0_6px_rgba(127,176,234,0.15)] disabled:cursor-not-allowed disabled:bg-[var(--color-border)] disabled:shadow-none"
              disabled={!canGenerate}
              type="button"
              onClick={onGenerate}
            >
              {submitting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              立即生成（{costCredits} 次）
            </button>

            {missingCount > 0 && (
              <p className="mt-2 text-center text-xs text-[var(--color-brand-strong)]">
                仍有 {missingCount} 个必填项未完成
              </p>
            )}

            {remainingCredits !== null && remainingCredits < costCredits && (
              <p className="mt-2 text-center text-xs text-[var(--color-brand-strong)]">
                余额不足，请先充值
              </p>
            )}

            {remainingCredits !== null && (
              <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
                剩余 {remainingCredits} 次
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
