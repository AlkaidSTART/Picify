"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Layers,
  LoaderCircle,
  Palette,
  RefreshCw,
  Sparkles,
  Users,
  Zap,
  Brain,
  Gift,
} from "lucide-react";
import { useGenerationPolling } from "@/hooks/use-generation-polling";

type ParamOption = { label: string; value: string };
type SceneParam = {
  key: string;
  label: string;
  type: "select" | "text" | "image" | "color";
  required: boolean;
  placeholder?: string;
  options?: ParamOption[];
};

type Scene = {
  id: string;
  persona: string;
  name: string;
  description: string;
  sampleImages: string[];
  params: SceneParam[];
};

type Persona = {
  id: string;
  name: string;
  description: string;
  sceneCount: number;
};

export default function Dashboard() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const buildApiUrl = useCallback(
    (path: string) => {
      if (!apiBaseUrl) return path;
      return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
    },
    [apiBaseUrl],
  );

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [generationTaskId, setGenerationTaskId] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [reasoningOpen, setReasoningOpen] = useState(false);

  const [remainingCredits, setRemainingCredits] = useState<number | null>(
    null,
  );

  const [cdkCode, setCdkCode] = useState("");
  const [cdkMessage, setCdkMessage] = useState("");
  const [cdkSubmitting, setCdkSubmitting] = useState(false);

  const { status: genStatus, result: genResult, reset: resetGeneration } =
    useGenerationPolling(generationTaskId);

  useEffect(() => {
    async function loadPersonas() {
      setLoadingPersonas(true);
      setErrorMessage("");

      try {
        const res = await fetch(buildApiUrl("/api/v1/personas"), {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(
            data?.error?.message ?? "加载人群失败，请稍后重试",
          );
          return;
        }

        const list: Persona[] = data.personas ?? [];
        setPersonas(list);

        if (list.length > 0) {
          setSelectedPersona(list[0].id);
        }
      } catch {
        setErrorMessage("网络异常，暂时无法加载人群，请稍后重试");
      } finally {
        setLoadingPersonas(false);
      }
    }

    void loadPersonas();
  }, [buildApiUrl]);

  useEffect(() => {
    if (!selectedPersona) return;

    async function loadScenes() {
      setLoadingScenes(true);
      setErrorMessage("");
      setScenes([]);
      setSelectedSceneId("");
      setFormValues({});

      try {
        const res = await fetch(
          buildApiUrl(`/api/v1/scenes?persona=${selectedPersona}`),
          { cache: "no-store" },
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(
            data?.error?.message ?? "加载场景失败，请稍后重试",
          );
          return;
        }

        const list: Scene[] = data.scenes ?? [];
        setScenes(list);

        if (list.length > 0) {
          setSelectedSceneId(list[0].id);
        }
      } catch {
        setErrorMessage("网络异常，暂时无法加载场景，请稍后重试");
      } finally {
        setLoadingScenes(false);
      }
    }

    void loadScenes();
  }, [buildApiUrl, selectedPersona]);

  useEffect(() => {
    if (!apiBaseUrl) return;

    async function loadBalance() {
      try {
        const res = await fetch(buildApiUrl("/api/v1/user/balance"), {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.ok) {
          setRemainingCredits(data.data.remainingCredits);
        }
      } catch {
        // 余额获取失败不阻塞主流程
      }
    }

    void loadBalance();
  }, [apiBaseUrl, buildApiUrl, generationTaskId]);

  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId),
    [scenes, selectedSceneId],
  );

  function updateField(key: string, value: string) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  function getRequiredMissingCount() {
    if (!selectedScene) return 0;

    return selectedScene.params.filter((param) => {
      if (!param.required) return false;
      return !formValues[param.key]?.trim();
    }).length;
  }

  const missingCount = getRequiredMissingCount();
  const costCredits = mode === "advanced" ? 2 : 1;

  async function handleSubmit() {
    if (!selectedScene || missingCount > 0) return;

    setSubmitting(true);
    setErrorMessage("");
    setGenerationTaskId(null);

    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrf_token="))
        ?.split("=")[1];

      const res = await fetch(buildApiUrl("/api/v1/generate"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({
          persona: selectedPersona,
          scene: selectedSceneId,
          mode,
          params: formValues,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(
          data?.error?.message ?? "生成请求失败，请稍后重试",
        );
        return;
      }

      setGenerationTaskId(data.data.taskId);
      setRemainingCredits(data.data.remainingCredits);
    } catch {
      setErrorMessage("网络异常，无法提交生成请求");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRedeemCdk() {
    if (!cdkCode.trim()) return;

    setCdkSubmitting(true);
    setCdkMessage("");

    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrf_token="))
        ?.split("=")[1];

      const res = await fetch(buildApiUrl("/api/v1/cdk/redeem"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        },
        body: JSON.stringify({ code: cdkCode.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setCdkMessage(data?.error?.message ?? "兑换失败");
        return;
      }

      setCdkMessage(`兑换成功！到账 ${data.data.addedCredits} 次`);
      setCdkCode("");
      setRemainingCredits(data.data.remainingCredits);
    } catch {
      setCdkMessage("网络异常，兑换失败");
    } finally {
      setCdkSubmitting(false);
    }
  }

  function handleRetry() {
    resetGeneration();
    setGenerationTaskId(null);
  }

  const isGenerating =
    genStatus === "pending" || genStatus === "generating";

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label">Create</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
                四步完成出图
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                选择人群、选择场景、填写参数、发起生成。移动端和桌面端保持一致操作流程。
              </p>
            </div>
            <div className="flex items-center gap-3">
              {remainingCredits !== null && (
                <span className="rounded-full border border-[var(--color-border)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--color-muted)]">
                  剩余 {remainingCredits} 次
                </span>
              )}
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/80 px-4 text-sm font-medium text-[var(--color-ink)] transition hover:bg-white"
                href="/"
              >
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Link>
            </div>
          </div>
        </header>

        {errorMessage ? (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-3 text-sm text-[#9f1239]">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="glass-panel rounded-3xl p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              <h2 className="text-base font-semibold">第 1 步：选择人群</h2>
            </div>

            {loadingPersonas ? (
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/75 p-3 text-sm text-[var(--color-muted)]">
                <LoaderCircle className="h-4 w-4 animate-spin" /> 正在加载人群
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    className={`rounded-2xl border p-3 text-left transition ${
                      selectedPersona === persona.id
                        ? "border-[var(--color-brand-strong)] bg-white"
                        : "border-[var(--color-border)] bg-white/75"
                    }`}
                    type="button"
                    onClick={() => setSelectedPersona(persona.id)}
                  >
                    <p className="text-sm font-semibold">{persona.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {persona.description} · {persona.sceneCount} 个场景
                    </p>
                  </button>
                ))}
              </div>
            )}
          </article>

          <article className="glass-panel rounded-3xl p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <h2 className="text-base font-semibold">第 2 步：选择场景</h2>
            </div>

            {loadingScenes ? (
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/75 p-3 text-sm text-[var(--color-muted)]">
                <LoaderCircle className="h-4 w-4 animate-spin" /> 正在加载场景
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    className={`rounded-2xl border p-3 text-left transition ${
                      selectedSceneId === scene.id
                        ? "border-[var(--color-brand-strong)] bg-white"
                        : "border-[var(--color-border)] bg-white/75"
                    }`}
                    type="button"
                    onClick={() => setSelectedSceneId(scene.id)}
                  >
                    <p className="text-sm font-semibold">{scene.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {scene.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">第 3 步：填写参数</h3>
            </div>

            {!selectedScene ? (
              <p className="rounded-xl border border-[var(--color-border)] bg-white/80 p-3 text-sm text-[var(--color-muted)]">
                请先选择人群与场景。
              </p>
            ) : (
              <>
                <form className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
                  {selectedScene.params.map((param) => {
                    const value = formValues[param.key] ?? "";

                    if (param.type === "select") {
                      return (
                        <div key={param.key}>
                          <label className="mb-2 block text-sm font-medium">
                            {param.label}
                            {param.required ? (
                              <span className="text-[#b91c1c]"> *</span>
                            ) : null}
                          </label>
                          <select
                            className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm outline-none transition focus:border-[var(--color-brand-strong)]"
                            value={value}
                            onChange={(e) =>
                              updateField(param.key, e.target.value)
                            }
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
                        <div key={param.key}>
                          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                            <Palette className="h-4 w-4" />
                            {param.label}
                            {param.required ? (
                              <span className="text-[#b91c1c]"> *</span>
                            ) : null}
                          </div>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {(param.options ?? []).map((opt) => (
                              <button
                                key={opt.value}
                                className={`h-10 rounded-xl border px-2 text-xs ${
                                  value === opt.value
                                    ? "border-[var(--color-brand-strong)] bg-white"
                                    : "border-[var(--color-border)] bg-white/80"
                                }`}
                                type="button"
                                onClick={() =>
                                  updateField(param.key, opt.value)
                                }
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
                          {param.required ? (
                            <span className="text-[#b91c1c]"> *</span>
                          ) : null}
                        </label>
                        <input
                          className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm outline-none transition focus:border-[var(--color-brand-strong)]"
                          placeholder={param.placeholder ?? "请输入"}
                          type="text"
                          value={value}
                          onChange={(e) =>
                            updateField(param.key, e.target.value)
                          }
                        />
                      </div>
                    );
                  })}
                </form>

                <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                  <p className="mb-3 text-sm font-semibold">模式选择</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        mode === "basic"
                          ? "border-[var(--color-brand-strong)] bg-white"
                          : "border-[var(--color-border)] bg-white/75"
                      }`}
                      type="button"
                      onClick={() => setMode("basic")}
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
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        mode === "advanced"
                          ? "border-[var(--color-brand-strong)] bg-white"
                          : "border-[var(--color-border)] bg-white/75"
                      }`}
                      type="button"
                      onClick={() => setMode("advanced")}
                    >
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
              </>
            )}
          </article>

          <div className="flex flex-col gap-4">
            <article className="glass-panel rounded-3xl p-4 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <h3 className="text-base font-semibold">第 4 步：发起生成</h3>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/80 p-6 text-center">
                  <LoaderCircle className="h-8 w-8 animate-spin text-[var(--color-brand-strong)]" />
                  <p className="text-sm font-medium">
                    {genStatus === "pending"
                      ? "任务排队中..."
                      : "AI 正在生成图片..."}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {mode === "advanced"
                      ? "高级模式通常需要 15-20 秒"
                      : "基础模式通常需要 5-10 秒"}
                  </p>
                </div>
              ) : genStatus === "completed" && genResult ? (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/80">
                    {genResult.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt="生成结果"
                        className="w-full"
                        src={genResult.imageUrl}
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-sm text-[var(--color-muted)]">
                        图片加载中...
                      </div>
                    )}
                  </div>

                  {mode === "advanced" && genResult.reasoning && (
                    <div className="rounded-2xl border border-[var(--color-border)] bg-white/75">
                      <button
                        className="flex w-full items-center justify-between p-3 text-sm font-medium"
                        type="button"
                        onClick={() => setReasoningOpen(!reasoningOpen)}
                      >
                        <span className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI 设计师的思考过程
                        </span>
                        {reasoningOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      {reasoningOpen && (
                        <div className="border-t border-[var(--color-border)] p-3 text-xs leading-relaxed text-[var(--color-muted)]">
                          <p className="mb-2 font-medium text-[var(--color-ink)]">
                            需求分析
                          </p>
                          <p className="mb-3">
                            {genResult.reasoning.analysis}
                          </p>
                          <p className="mb-2 font-medium text-[var(--color-ink)]">
                            风格说明
                          </p>
                          <p className="mb-3">
                            {genResult.reasoning.styleNotes}
                          </p>
                          <p className="mb-2 font-medium text-[var(--color-ink)]">
                            构图建议
                          </p>
                          <p>{genResult.reasoning.compositionTip}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {genResult.imageUrl && (
                      <a
                        download
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand-strong)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6ea1df]"
                        href={genResult.imageUrl}
                      >
                        <Download className="h-4 w-4" />
                        下载原图
                      </a>
                    )}
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/80 px-4 py-2.5 text-sm font-medium transition hover:bg-white"
                      type="button"
                      onClick={handleRetry}
                    >
                      <RefreshCw className="h-4 w-4" />
                      重新生成
                    </button>
                  </div>
                </div>
              ) : genStatus === "failed" ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-4 text-sm text-[#9f1239]">
                    <p className="font-medium">生成失败</p>
                    <p className="mt-1 text-xs">
                      {genResult?.errorMessage ?? "请稍后重试，已自动退还次数"}
                    </p>
                  </div>
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/80 px-4 py-2.5 text-sm font-medium transition hover:bg-white"
                    type="button"
                    onClick={handleRetry}
                  >
                    <RefreshCw className="h-4 w-4" />
                    重新生成
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
                  <p className="text-sm text-[var(--color-muted)]">
                    {missingCount > 0
                      ? `仍有 ${missingCount} 个必填项未完成`
                      : "参数已完整，可发起生成"}
                  </p>
                  <button
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#7d8590]"
                    disabled={
                      !selectedScene || missingCount > 0 || submitting
                    }
                    type="button"
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    立即生成（{costCredits} 次）
                  </button>
                  {remainingCredits !== null && remainingCredits < costCredits && (
                    <p className="mt-2 text-center text-xs text-[#b91c1c]">
                      余额不足，请先充值
                    </p>
                  )}
                </div>
              )}
            </article>

            {remainingCredits !== null && remainingCredits < 5 && (
              <article className="glass-panel rounded-3xl p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <h3 className="text-sm font-semibold">兑换码充值</h3>
                </div>
                <div className="flex gap-2">
                  <input
                    className="h-10 flex-1 rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm outline-none transition focus:border-[var(--color-brand-strong)]"
                    placeholder="输入兑换码"
                    type="text"
                    value={cdkCode}
                    onChange={(e) => setCdkCode(e.target.value.toUpperCase())}
                  />
                  <button
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand-strong)] px-4 text-sm font-semibold text-white transition hover:bg-[#6ea1df] disabled:opacity-50"
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
                        ? "text-green-700"
                        : "text-[#b91c1c]"
                    }`}
                  >
                    {cdkMessage}
                  </p>
                )}
              </article>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
