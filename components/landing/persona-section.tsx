"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  MessageSquare,
  PenTool,
  Store,
} from "lucide-react";

const personas = [
  {
    title: "电商商家",
    desc: "商品主图、详情配图、营销海报",
    icon: Store,
    href: "/dashboard?persona=ecommerce",
  },
  {
    title: "自媒体人",
    desc: "平台封面、吸睛配图、个性头像",
    icon: PenTool,
    href: "/dashboard?persona=creator",
  },
  {
    title: "设计师",
    desc: "灵感草图、品牌概念、提案辅助",
    icon: Briefcase,
    href: "/dashboard?persona=designer",
  },
  {
    title: "职场白领",
    desc: "汇报插图、课件素材、演示文档",
    icon: MessageSquare,
    href: "/dashboard?persona=office",
  },
];

export function PersonaSection() {
  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24"
      id="roles"
    >
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">适用角色</h2>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          按角色分流场景，减少无效参数输入
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((role) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.title}
              href={role.href}
              className="glass-shallow group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-[var(--color-brand-strong)] transition-transform group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{role.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                {role.desc}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[var(--color-brand-strong)] transition-all group-hover:gap-2 sm:flex">
                进入场景
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
