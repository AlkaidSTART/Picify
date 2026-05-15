"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useGenerationPolling } from "@/hooks/use-generation-polling";
import { useBlobs } from "@/hooks/use-gsap";
import { StepProgress } from "@/components/ui/step-progress";
import { BalanceBadge } from "@/components/ui/balance-badge";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { StepPersona } from "@/components/dashboard/step-persona";
import { StepScene } from "@/components/dashboard/step-scene";
import { StepParams } from "@/components/dashboard/step-params";
import { StepResult } from "@/components/dashboard/step-result";

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

const STEP_TITLES = ["选择人群", "选择场景", "填写参数", "查看结果"];
const STEP_DESCS = [
  "选择你的角色与业务场景",
  "选择场景以确定出图类型",
  "填写参数并选择生成模式",
  "预览、下载或重新生成",
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const urlPersona = searchParams.get("persona");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const buildApiUrl = useCallback(
    (path: string) => {
      if (!apiBaseUrl) return path;
      return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
    },
    [apiBaseUrl],
  );

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>(urlPersona ?? "");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [generationTaskId, setGenerationTaskId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);

  const {
    status: genStatus,
    result: genResult,
    reset: resetGeneration,
  } = useGenerationPolling(generationTaskId);

  const blobsRef = useBlobs();

  // 计算当前步骤
  const currentStep = useMemo(() => {
    if (genStatus === "completed" || genStatus === "failed") return 3;
    if (genStatus === "pending" || genStatus === "generating") return 2;
    if (selectedSceneId) return 2;
    if (selectedPersona) return 1;
    return 0;
  }, [selectedPersona, selectedSceneId, genStatus]);

  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId),
    [scenes, selectedSceneId],
  );

  // 加载人群
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
          setErrorMessage(data?.error?.message ?? "加载人群失败，请稍后重试");
          return;
        }
        const list: Persona[] = data.personas ?? [];
        setPersonas(list);
        // 如果 URL 带有 persona 参数，自动选中对应人群
        if (urlPersona && list.some((p) => p.id === urlPersona)) {
          setSelectedPersona(urlPersona);
        }
      } catch {
        setErrorMessage("网络异常，暂时无法加载人群，请稍后重试");
      } finally {
        setLoadingPersonas(false);
      }
    }
    void loadPersonas();
  }, [buildApiUrl, urlPersona]);

  // 加载场景
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
          setErrorMessage(data?.error?.message ?? "加载场景失败，请稍后重试");
          return;
        }
        const list: Scene[] = data.scenes ?? [];
        setScenes(list);
      } catch {
        setErrorMessage("网络异常，暂时无法加载场景，请稍后重试");
      } finally {
        setLoadingScenes(false);
      }
    }
    void loadScenes();
  }, [buildApiUrl, selectedPersona]);

  // 加载余额
  useEffect(() => {
    if (!apiBaseUrl) return;
    async function loadBalance() {
      try {
        const res = await fetch(buildApiUrl("/api/v1/user/balance"), {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.ok) setRemainingCredits(data.data.remainingCredits);
      } catch {
        /* 余额获取失败不阻塞 */
      }
    }
    void loadBalance();
  }, [apiBaseUrl, buildApiUrl, generationTaskId]);

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
        setErrorMessage(data?.error?.message ?? "生成请求失败，请稍后重试");
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

  async function handleRedeemCdk(code: string) {
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
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok)
      throw new Error(data?.error?.message ?? "兑换失败");
    setRemainingCredits(data.data.remainingCredits);
  }

  function handleRetry() {
    resetGeneration();
    setGenerationTaskId(null);
  }

  function handleStepClick(step: number) {
    if (step === 0) {
      setSelectedPersona("");
      setSelectedSceneId("");
      setFormValues({});
      resetGeneration();
      setGenerationTaskId(null);
    } else if (step === 1) {
      setSelectedSceneId("");
      setFormValues({});
      resetGeneration();
      setGenerationTaskId(null);
    } else if (step === 2) {
      resetGeneration();
      setGenerationTaskId(null);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 背景光晕 */}
      <div ref={blobsRef} className="bg-blobs bg-blobs--subtle">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Header */}
      <header className="glass-deep sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <StepProgress
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          <div className="flex items-center gap-3">
            <BalanceBadge credits={remainingCredits} />
            <Link
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/80 px-3 text-sm font-medium text-[var(--color-ink)] transition-all hover:bg-white"
              href="/"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">返回首页</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 内容区 */}
      <main
        className={`relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 ${currentStep === 2 ? "content-with-action-bar" : ""}`}
      >
        {/* 错误提示 */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-2 rounded-2xl border border-[rgba(127,176,234,0.3)] bg-[var(--color-brand)] p-3 text-sm text-[var(--color-brand-deep)]">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* 步骤标题 */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {STEP_TITLES[currentStep]}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {STEP_DESCS[currentStep]}
          </p>
        </div>

        {/* 步骤内容 */}
        {currentStep === 0 && (
          <StepPersona
            loading={loadingPersonas}
            personas={personas}
            selected={selectedPersona}
            onSelect={setSelectedPersona}
          />
        )}

        {currentStep === 1 && (
          <StepScene
            loading={loadingScenes}
            scenes={scenes}
            selected={selectedSceneId}
            onSelect={setSelectedSceneId}
          />
        )}

        {currentStep === 2 && (
          <StepParams
            costCredits={costCredits}
            formValues={formValues}
            missingCount={missingCount}
            mode={mode}
            params={selectedScene?.params ?? []}
            remainingCredits={remainingCredits}
            submitting={submitting}
            onFieldChange={updateField}
            onGenerate={handleSubmit}
            onModeChange={setMode}
          />
        )}

        {currentStep === 3 && (
          <StepResult
            errorMessage={genResult?.errorMessage}
            imageUrl={genResult?.imageUrl}
            mode={mode}
            reasoning={genResult?.reasoning}
            remainingCredits={remainingCredits}
            status={
              genStatus === "completed" ||
              genStatus === "failed" ||
              genStatus === "pending" ||
              genStatus === "generating"
                ? genStatus
                : "idle"
            }
            onCdkRedeem={handleRedeemCdk}
            onRetry={handleRetry}
          />
        )}
      </main>

      {/* 移动端吸底操作栏（步骤 2 显示，步骤 3 已有生成按钮） */}
      {currentStep === 2 && (
        <MobileActionBar
          canGenerate={missingCount === 0 && !submitting}
          costCredits={costCredits}
          mode={mode}
          remainingCredits={remainingCredits}
          submitting={submitting}
          onGenerate={handleSubmit}
          onModeChange={setMode}
        />
      )}

      {/* 生成进度条动画样式 */}
      <style jsx>{`
        .generating-progress {
          animation: progress-flow 2s ease-in-out infinite;
        }
        @keyframes progress-flow {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand-strong)] border-t-transparent" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
