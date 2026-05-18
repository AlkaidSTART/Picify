"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { homePersonaEntries } from "@/components/landing/home-content";

export function PersonaSection() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24"
      id="roles"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="max-w-md">
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[var(--home-ink)] sm:text-4xl">
            先认领身份，再进入你的出图路径
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[var(--home-muted)] sm:text-base">
            四类人群各自进入自己的场景，不把创作台做成一块大参数面板。
          </p>
        </div>

        <div className="rounded-[2rem] border border-[var(--home-border)] bg-white/72 px-5 py-4 shadow-[0_24px_60px_rgba(23,22,18,0.06)]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--home-muted)]">
            <span className="rounded-full border border-[var(--home-border)] bg-[var(--home-duck)] px-3 py-1.5 text-[var(--home-ink)]">
              游客可先体验 1 次
            </span>
            <span className="rounded-full border border-[var(--home-border)] bg-[var(--home-paper)] px-3 py-1.5 text-[var(--home-ink)]">
              无需先学 Prompt
            </span>
            <span className="rounded-full border border-[var(--home-border)] px-3 py-1.5">
              基础模式 1 次 / 张
            </span>
            <span className="rounded-full border border-[var(--home-border)] px-3 py-1.5">
              高级模式 2 次 / 张
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {homePersonaEntries.map((role, index) => {
          const Icon = role.icon;

          return (
            <Link
              key={role.title}
              className={`home-persona-card group ${index % 2 === 0 ? "home-persona-card--duck" : "home-persona-card--meadow"}`}
              href={role.href}
            >
              <div className="flex items-start justify-between gap-5">
                <div className="home-persona-card__icon">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[0.68rem] tracking-[0.28em] text-[var(--home-muted)] uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--home-ink)]">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--home-muted)]">
                  {role.desc}
                </p>
              </div>

              <div className="mt-8 border-t border-[var(--home-border)] pt-5">
                <p className="text-sm leading-relaxed text-[var(--home-ink)]">
                  {role.value}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--home-ink)] transition-all group-hover:gap-2 group-hover:text-[var(--home-meadow)]">
                  进入对应场景
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
