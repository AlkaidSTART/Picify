import {
  BadgeCheck,
  Check,
  Image as ImageIcon,
  Palette,
  Smartphone,
  Sparkles,
  User,
  WandSparkles
} from "lucide-react";

const cEndScenes = [
  {
    id: "xhs-cover",
    title: "小红书封面",
    desc: "3:4 比例，适合测评、穿搭、生活分享等垂直场景",
    hot: true,
    icon: Smartphone,
  },
  {
    id: "avatar",
    title: "个性头像",
    desc: "适配多平台头像规范，保留角色个人特色",
    hot: false,
    icon: User,
  },
  {
    id: "article-insert",
    title: "图文配图",
    desc: "微信公众号、博客等文章插图",
    hot: false,
    icon: ImageIcon,
  },
  {
    id: "wallpaper",
    title: "手机壁纸",
    desc: "高清手机锁屏及桌面背景定制",
    hot: true,
    icon: Sparkles,
  },
];

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-auto bg-[var(--color-base)] font-sans">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10">
        <header className="glass-panel relative overflow-hidden rounded-[32px] p-6 sm:p-8 border border-white/60 bg-white/40 shadow-sm">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold sm:text-3xl text-gray-900">选择您的创作场景</h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base max-w-xl">
              为自媒体和个人创作者提供的高级预设。您无需了解复杂参数，仅需选择场景及简单配置，即可生成高水准成品。
            </p>
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />
        </header>

        <section className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cEndScenes.map((scene) => {
              const Icon = scene.icon;
              return (
                <button
                  key={scene.id}
                  className="glass-panel relative flex min-h-[164px] flex-col rounded-3xl p-6 text-left transition-all hover:bg-white/80 hover:shadow-md border border-white/50 bg-white/40 group"
                >
                  {scene.hot && (
                    <span className="absolute right-4 top-4 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                      推荐
                    </span>
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand)]/50 text-[var(--color-brand-strong)] transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-gray-900">{scene.title}</h2>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                    {scene.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="glass-panel mt-8 rounded-[32px] p-6 sm:p-8 lg:p-10 border border-white/60 bg-white/40 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand)]/50 text-[var(--color-brand-strong)]">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">创作表单</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">当前选择：小红书封面</p>
            </div>
          </div>

          <form className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-8">
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-900">
                  核心主题 <span className="text-red-500">*</span>
                </label>
                <input
                  className="h-12 w-full rounded-2xl border border-gray-200/80 bg-white/80 px-4 text-sm text-gray-900 outline-none transition focus:border-[var(--color-brand-strong)] focus:ring-4 focus:ring-blue-100/50 shadow-sm"
                  placeholder="例如：夏日防晒霜测评，室外海滩背景"
                  type="text"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-gray-900">视觉风格</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    "清透亮肤",
                    "高级极简",
                    "日常网感",
                    "暖阳胶片",
                    "柔和日系",
                    "棚拍质感",
                  ].map((style) => (
                    <button
                      key={style}
                      className="h-11 rounded-xl border border-gray-200/80 bg-white/60 px-3 text-xs font-medium text-gray-700 transition hover:bg-white hover:border-gray-300 shadow-sm"
                      type="button"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Palette className="h-4 w-4 text-[var(--color-muted)]" />
                  主色调倾向
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" className="h-8 w-8 rounded-full border-2 border-[var(--color-brand-strong)] bg-[#dbeafe] shadow-sm relative"><span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-[var(--color-brand-strong)]"></span></button>
                  <button type="button" className="h-8 w-8 rounded-full border border-gray-200 bg-[#f8fafc] shadow-sm transform hover:scale-110 transition"></button>
                  <button type="button" className="h-8 w-8 rounded-full border border-gray-200 bg-[#0f172a] shadow-sm transform hover:scale-110 transition"></button>
                  <span className="text-xs text-[var(--color-muted)] ml-2">已使用智能推荐配色</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--color-brand-strong)]/30 bg-blue-50/50 p-5 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-100/50 blur-2xl" />
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2 text-[var(--color-brand-strong)]">
                    <WandSparkles className="h-5 w-5" />
                    <p className="text-sm font-bold">高级优化模式已就绪</p>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600">
                    开启该模式，AI 将自动分析您的主题，补全构图细节与真实光影层次，直接输出符合商业质量的作品。
                  </p>
                </div>
              </div>

              <button
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-strong)] text-sm font-bold text-white shadow-md transition hover:bg-blue-500 hover:shadow-lg focus:ring-4 focus:ring-blue-200"
                type="button"
              >
                <Check className="h-5 w-5" />
                立即生成作品（每次消耗 2 额度）
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
