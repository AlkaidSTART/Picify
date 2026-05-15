"use client";

import { useCallback, useState } from "react";
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Download,
  LoaderCircle,
  RefreshCw,
  Gift,
  AlertCircle,
} from "lucide-react";

interface Reasoning {
  analysis: string;
  styleNotes: string;
  compositionTip: string;
}

interface StepResultProps {
  status: "idle" | "pending" | "generating" | "completed" | "failed";
  imageUrl?: string;
  errorMessage?: string;
  reasoning?: Reasoning;
  mode: "basic" | "advanced";
  onRetry: () => void;
  remainingCredits: number | null;
  onCdkRedeem: (code: string) => Promise<void>;
}

export function StepResult({
  status,
  imageUrl,
  errorMessage,
  reasoning,
  mode,
  onRetry,
  remainingCredits,
  onCdkRedeem,
}: StepResultProps) {
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [cdkOpen, setCdkOpen] = useState(false);
  const [cdkCode, setCdkCode] = useState("");
  const [cdkMessage, setCdkMessage] = useState("");
  const [cdkSubmitting, setCdkSubmitting] = useState(false);

  const handleRedeemCdk = useCallback(async () => {
    if (!cdkCode.trim()) return;
    setCdkSubmitting(true);
    setCdkMessage("");
    try {
      await onCdkRedeem(cdkCode.trim());
      setCdkMessage("兑换成功");
      setCdkCode("");
    } catch {
      setCdkMessage("兑换失败");
    } finally {
      setCdkSubmitting(false);
    }
  }, [cdkCode, onCdkRedeem]);

  // 生成中
  if (status === "pending" || status === "generating") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="glass-standard rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <LoaderCircle className="h-10 w-10 animate-spin text-[var(--color-brand-strong)]" />
            <div>
              <p className="text-sm font-semibold">
                {status === "pending" ? "任务排队中..." : "AI 正在生成图片..."}
              </p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                {mode === "advanced"
                  ? "高级模式通常需要 15-20 秒"
                  : "基础模式通常需要 5-10 秒"}
              </p>
            </div>
            {/* 进度条 */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-brand)]">
              <div className="generating-progress h-full w-full rounded-full bg-gradient-to-r from-[var(--color-brand-strong)] to-[var(--color-brand-deep)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 生成失败
  if (status === "failed") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="glass-standard rounded-2xl p-6">
          <div className="flex items-start gap-3 rounded-xl border border-[rgba(127,176,234,0.3)] bg-[var(--color-brand)] p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-[var(--color-brand-strong)]" />
            <div>
              <p className="text-sm font-semibold">生成失败</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                {errorMessage ?? "请稍后重试，已自动退还次数"}
              </p>
            </div>
          </div>
          <button
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-brand-strong)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-brand-strong)] transition-all hover:bg-[var(--color-brand)]"
            type="button"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4" />
            重新生成
          </button>
        </div>
      </div>
    );
  }

  // 生成完成
  if (status === "completed") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="glass-standard rounded-2xl p-6">
          {/* 结果图 */}
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="生成结果" className="w-full" src={imageUrl} />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-[var(--color-muted)]">
                图片加载中...
              </div>
            )}
          </div>

          {/* 推理过程 */}
          {mode === "advanced" && reasoning && (
            <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white/50">
              <button
                className="flex w-full items-center justify-between p-4 text-sm font-semibold transition-colors hover:text-[var(--color-brand-strong)]"
                type="button"
                onClick={() => setReasoningOpen(!reasoningOpen)}
              >
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[var(--color-brand-strong)]" />
                  AI 设计师的思考过程
                </span>
                {reasoningOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {reasoningOpen && (
                <div className="border-t border-[var(--color-border)] p-4 text-xs leading-relaxed text-[var(--color-muted)]">
                  <p className="mb-2 font-semibold text-[var(--color-ink)]">
                    需求分析
                  </p>
                  <p className="mb-3">{reasoning.analysis}</p>
                  <p className="mb-2 font-semibold text-[var(--color-ink)]">
                    风格说明
                  </p>
                  <p className="mb-3">{reasoning.styleNotes}</p>
                  <p className="mb-2 font-semibold text-[var(--color-ink)]">
                    构图建议
                  </p>
                  <p>{reasoning.compositionTip}</p>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-4 flex gap-3">
            {imageUrl && (
              <a
                download
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-strong)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brand-deep)] hover:shadow-[0_0_0_6px_rgba(127,176,234,0.15)]"
                href={imageUrl}
              >
                <Download className="h-4 w-4" />
                下载原图
              </a>
            )}
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-brand-strong)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-brand-strong)] transition-all hover:bg-[var(--color-brand)]"
              type="button"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
              重新生成
            </button>
          </div>

          {/* CDK 兑换 */}
          {remainingCredits !== null && remainingCredits < 5 && (
            <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white/50">
              <button
                className="flex w-full items-center justify-between p-3 text-sm font-medium transition-colors hover:text-[var(--color-brand-strong)]"
                type="button"
                onClick={() => setCdkOpen(!cdkOpen)}
              >
                <span className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[var(--color-brand-strong)]" />
                  兑换码充值
                </span>
                {cdkOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {cdkOpen && (
                <div className="border-t border-[var(--color-border)] p-3">
                  <div className="flex gap-2">
                    <input
                      className="h-10 flex-1 rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm transition-all outline-none focus:border-[var(--color-brand-strong)] focus:bg-[var(--color-brand)]"
                      placeholder="输入兑换码"
                      type="text"
                      value={cdkCode}
                      onChange={(e) => setCdkCode(e.target.value.toUpperCase())}
                    />
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand-strong)] px-4 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brand-deep)] disabled:opacity-50"
                      disabled={!cdkCode.trim() || cdkSubmitting}
                      type="button"
                      onClick={handleRedeemCdk}
                    >
                      {cdkSubmitting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        "兑换"
                      )}
                    </button>
                  </div>
                  {cdkMessage && (
                    <p
                      className={`mt-2 text-xs ${cdkMessage.startsWith("兑换成功") ? "text-[var(--color-brand-strong)]" : "text-[var(--color-brand-deep)]"}`}
                    >
                      {cdkMessage}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 空闲态
  return null;
}
