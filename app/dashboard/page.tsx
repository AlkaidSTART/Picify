"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Check,
  Layers,
  LoaderCircle,
  Palette,
  Sparkles,
  Users,
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

  const buildApiUrl = (path: string) => {
    if (!apiBaseUrl) return path;
    return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
  };

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loadingPersonas, setLoadingPersonas] = useState(true);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
  }, []);

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
          {
            cache: "no-store",
          },
        );
        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data?.error?.message ?? "加载场景失败，请稍后重试");
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
  }, [selectedPersona]);

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

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label">Create</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">四步完成出图</h1>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                选择人群、选择场景、填写参数、发起生成。移动端和桌面端保持一致操作流程。
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white/80 px-4 text-sm font-medium text-[var(--color-ink)] transition hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
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
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{scene.description}</p>
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
              <form className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
                {selectedScene.params.map((param) => {
                  const value = formValues[param.key] ?? "";

                  if (param.type === "select") {
                    return (
                      <div key={param.key}>
                        <label className="mb-2 block text-sm font-medium">
                          {param.label}
                          {param.required ? <span className="text-[#b91c1c]"> *</span> : null}
                        </label>
                        <select
                          className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm outline-none transition focus:border-[var(--color-brand-strong)]"
                          value={value}
                          onChange={(e) => updateField(param.key, e.target.value)}
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
                          {param.required ? <span className="text-[#b91c1c]"> *</span> : null}
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
                              onClick={() => updateField(param.key, opt.value)}
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
                        {param.required ? <span className="text-[#b91c1c]"> *</span> : null}
                      </label>
                      <input
                        className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white/90 px-3 text-sm outline-none transition focus:border-[var(--color-brand-strong)]"
                        placeholder={param.placeholder ?? "请输入"}
                        type="text"
                        value={value}
                        onChange={(e) => updateField(param.key, e.target.value)}
                      />
                    </div>
                  );
                })}
              </form>
            )}
          </article>

          <article className="glass-panel rounded-3xl p-4 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-base font-semibold">第 4 步：发起生成</h3>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 p-4">
              <p className="text-sm text-[var(--color-muted)]">
                {missingCount > 0
                  ? `仍有 ${missingCount} 个必填项未完成`
                  : "参数已完整，可发起生成"}
              </p>
              <button
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#7d8590]"
                disabled={!selectedScene || missingCount > 0}
                type="button"
              >
                <Check className="h-4 w-4" />
                立即生成
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white/80 p-4 text-xs leading-relaxed text-[var(--color-muted)]">
              当前阶段先完成流程和参数体验，生成接口接入后，这里将展示任务状态、预计耗时和结果入口。
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
