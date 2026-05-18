"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  Download,
  Gift,
  LoaderCircle,
  RefreshCw,
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

  if (status === "pending" || status === "generating") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="launch-card rounded-[2rem] p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <LoaderCircle className="h-10 w-10 animate-spin text-[var(--launch-duck)]" />
            <p className="text-sm font-semibold text-[var(--launch-ink)]">
              {status === "pending" ? "任务排队中" : "正在生成图片"}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--launch-paper)]">
              <div className="generating-progress h-full w-full rounded-full bg-[var(--launch-duck)]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="launch-card rounded-[2rem] p-6">
          <div className="flex items-start gap-3 rounded-xl border border-[var(--launch-border-strong)] bg-white p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 text-[var(--launch-ink)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--launch-ink)]">
                生成失败
              </p>
              <p className="mt-1 text-xs text-[var(--launch-muted)]">
                {errorMessage ?? "请稍后重试，已自动退还次数"}
              </p>
            </div>
          </div>
          <button
            className="launch-btn-secondary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
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

  if (status === "completed") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="launch-card rounded-[2rem] p-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--launch-border)]">
            {imageUrl ? (
              <Image
                alt="生成结果"
                className="h-auto w-full"
                height={1024}
                src={imageUrl}
                width={1024}
              />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-[var(--launch-muted)]">
                图片加载中...
              </div>
            )}
          </div>

          {mode === "advanced" && reasoning && (
            <div className="mt-4 rounded-2xl border border-[var(--launch-border)] bg-white">
              <button
                className="flex w-full items-center justify-between p-4 text-sm font-semibold text-[var(--launch-ink)] transition-colors hover:text-[var(--launch-meadow)]"
                type="button"
                onClick={() => setReasoningOpen(!reasoningOpen)}
              >
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[var(--launch-meadow)]" />
                  AI 推理过程
                </span>
                {reasoningOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {reasoningOpen && (
                <div className="border-t border-[var(--launch-border)] p-4 text-xs leading-relaxed text-[var(--launch-muted)]">
                  <p className="mb-2 font-semibold text-[var(--launch-ink)]">
                    需求分析
                  </p>
                  <p className="mb-3">{reasoning.analysis}</p>
                  <p className="mb-2 font-semibold text-[var(--launch-ink)]">
                    风格说明
                  </p>
                  <p className="mb-3">{reasoning.styleNotes}</p>
                  <p className="mb-2 font-semibold text-[var(--launch-ink)]">
                    构图建议
                  </p>
                  <p>{reasoning.compositionTip}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {imageUrl && (
              <a
                download
                className="launch-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                href={imageUrl}
              >
                <Download className="h-4 w-4" />
                下载原图
              </a>
            )}
            <button
              className="launch-btn-secondary flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
              type="button"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
              重新生成
            </button>
          </div>

          {remainingCredits !== null && remainingCredits < 5 && (
            <div className="mt-4 rounded-2xl border border-[var(--launch-border)] bg-white">
              <button
                className="flex w-full items-center justify-between p-3 text-sm font-medium text-[var(--launch-ink)] transition-colors hover:text-[var(--launch-meadow)]"
                type="button"
                onClick={() => setCdkOpen(!cdkOpen)}
              >
                <span className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[var(--launch-meadow)]" />
                  兑换码充值
                </span>
                {cdkOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {cdkOpen && (
                <div className="border-t border-[var(--launch-border)] p-3">
                  <div className="flex gap-2">
                    <input
                      className="launch-input h-10 flex-1 rounded-xl px-3 text-sm transition-all"
                      placeholder="输入兑换码"
                      type="text"
                      value={cdkCode}
                      onChange={(e) => setCdkCode(e.target.value.toUpperCase())}
                    />
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--launch-meadow)] px-4 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
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
                      className={`mt-2 text-xs ${
                        cdkMessage.startsWith("兑换成功")
                          ? "text-[var(--launch-meadow)]"
                          : "text-[var(--launch-ink)]"
                      }`}
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

  return null;
}
