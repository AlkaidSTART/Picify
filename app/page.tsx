import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ImagePlus,
  MessageSquare,
  PenTool,
  Sparkles,
  Store,
  WandSparkles,
} from "lucide-react";

const personas = [
  { title: "电商商家", desc: "商品主图、详情配图、营销海报", icon: Store },
  { title: "自媒体人", desc: "平台封面、吸睛配图、个性头像", icon: PenTool },
  { title: "设计师", desc: "灵感草图、品牌概念、提案辅助", icon: Briefcase },
  { title: "职场白领", desc: "汇报插图、课件素材、演示文档", icon: MessageSquare },
];

const steps = [
  "选择你的角色与业务场景",
  "按表单填写最少必要参数",
  "系统自动优化提示词与构图",
  "一键生成并继续迭代版本",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] font-sans">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--color-brand-strong)]/30 bg-[var(--color-brand)]">
              <Sparkles className="h-4 w-4 text-[var(--color-brand-strong)]" />
            </div>
            <p className="text-sm font-semibold">Picify 智能场景绘图</p>
          </div>

          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
            href="/dashboard"
          >
            进入创作台
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="text-center lg:text-left">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-1.5 text-xs text-[var(--color-muted)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-brand-strong)]" />
                面向 C 端用户的场景化 AI 出图流程
              </p>

              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                不写提示词，
                <br className="hidden sm:block" />
                直接做出可发布视觉
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg lg:mx-0">
                从角色到参数再到生成，全部收敛在一个稳定流程里。你只做业务选择，其余优化交给系统完成。
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-brand-strong)] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#6ea1df] sm:w-auto"
                  href="/dashboard"
                >
                  免费开始
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white/65 px-8 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white sm:w-auto"
                  href="#roles"
                >
                  查看适用角色
                </a>
              </div>
            </div>

            <div className="glass-panel rounded-[28px] p-3">
              <div className="rounded-3xl border border-white/80 bg-white/75 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-medium text-[var(--color-muted)]">实时生成预览</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-brand-strong)]">
                    <WandSparkles className="h-3 w-3" />
                    深度推理中
                  </span>
                </div>

                <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-sky-50 to-slate-100 p-6 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">防晒新品小红书封面</p>
                  <p className="mt-2 text-xs text-gray-500">系统正在自动修正文案层级与人物构图比例</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[var(--color-muted)]">
                  <div className="rounded-xl border border-[var(--color-border)] bg-white/80 px-3 py-2">
                    模型策略: 角色优先
                  </div>
                  <div className="rounded-xl border border-[var(--color-border)] bg-white/80 px-3 py-2">
                    目标平台: 小红书 3:4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="glass-panel rounded-3xl p-5 sm:p-7">
            <p className="section-label">Workflow</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">四步完成出图</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {steps.map((item, idx) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand)] text-xs font-semibold text-[var(--color-brand-strong)]">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-[var(--color-ink)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24" id="roles">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">适用角色</h2>
            <p className="mt-3 text-sm text-[var(--color-muted)]">按角色分流场景，减少无效参数输入</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {personas.map((role) => {
              const Icon = role.icon;
              return (
                <article
                  key={role.title}
                  className="glass-panel group rounded-3xl border border-white/55 bg-white/45 p-6 transition hover:bg-white/85"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand)]/65 text-[var(--color-brand-strong)] transition group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">{role.desc}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
