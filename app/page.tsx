import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Sparkles,
  Store,
  PenTool,
  MessageSquare,
  Briefcase
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-[var(--color-ink)] bg-[var(--color-base)] font-sans">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/78 backdrop-blur(4px)">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[var(--color-brand-strong)]/30 bg-[var(--color-brand)]">
              <Sparkles className="h-4 w-4 text-[var(--color-brand-strong)]" />
            </div>
            <div>
              <p className="text-sm font-semibold">智能场景绘图</p>
            </div>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
            href="/dashboard"
          >
            进入创作台
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        {/* 首屏 Banner */}
        <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="flex flex-col justify-center text-center lg:text-left">
              <p className="mb-4 inline-flex items-center justify-center gap-2 self-center rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-1.5 text-xs text-[var(--color-muted)] lg:self-start backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-brand-strong)]" />
                专为内容创作者与商家设计
              </p>
              <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900">
                免填提示词，
                <br className="hidden sm:block" />
                轻松生成高质量配图
              </h1>
              <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg max-w-2xl mx-auto lg:mx-0">
                只需选择角色与适用场景，简单点选参数。我们通过智能深度推理，将您的需求转化为达到商业发布标准的优质图片，移动端也可流畅创作。
              </p>
              
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--color-brand-strong)] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-500"
                  href="/dashboard"
                >
                  免费体验
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[var(--color-border)] bg-white/50 px-8 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white backdrop-blur-sm"
                  href="#roles"
                >
                  了解功能
                </a>
              </div>
            </div>

            {/* 极轻液态玻璃示例面板 */}
            <div className="relative mt-8 lg:mt-0">
              <div className="glass-panel relative z-10 rounded-[32px] p-2 shadow-2xl shadow-[var(--color-brand-strong)]/10 border border-white/60 bg-white/40">
                <div className="rounded-[24px] border border-white/80 bg-white/70 p-6 backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-medium text-[var(--color-muted)]">实时生成预览</p>
                    <span className="flex items-center gap-1 rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-brand-strong)]">
                      <Sparkles className="h-3 w-3" />
                      高级优化处理中
                    </span>
                  </div>
                  
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 to-gray-50 border border-white/50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                      <ImagePlus className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">夏日清透感防晒霜封面</p>
                    <p className="text-xs text-gray-500 mt-2">正在通过 AI 强化光影层次与排版...</p>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="h-10 w-full animate-pulse rounded-xl bg-white/60 border border-white/50" />
                    <div className="h-10 w-3/4 animate-pulse rounded-xl bg-white/60 border border-white/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 角色分发区 */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24" id="roles">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl text-gray-900">我们专注为您解决具体场景问题</h2>
            <p className="mt-4 text-sm text-[var(--color-muted)]">请选择您的创作角色，解锁专属的高级模板</p>
          </div>
          
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "电商商家", desc: "商品主图、详情配图、营销海报", icon: Store },
              { title: "自媒体人", desc: "平台封面、吸睛配图、个性头像", icon: PenTool },
              { title: "设计师", desc: "灵感草图、品牌概念、提案辅助", icon: Briefcase },
              { title: "职场白领", desc: "汇报插图、课件素材、演示文档", icon: MessageSquare },
            ].map((role) => {
              const Icon = role.icon;
              return (
                <div key={role.title} className="glass-panel group rounded-3xl p-6 transition-all hover:bg-white/80 border border-white/50 bg-white/40 shadow-sm cursor-pointer">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand)]/50 text-[var(--color-brand-strong)] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                    {role.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
