import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { homeCollageCards } from "@/components/landing/home-content";

export function DesignCollageStrip() {
  return (
    <section
      className="relative px-4 pt-6 pb-20 sm:px-6 sm:pt-10 sm:pb-24"
      id="collage"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
          <div className="max-w-md">
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[var(--home-ink)] sm:text-4xl">
              商品、封面、提案、汇报，各自都有清晰版式
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--home-muted)] sm:text-base">
              不先展示复杂参数，先把你最终会拿到的画面语言直接摆出来。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--home-border)] bg-[var(--home-paper)] px-4 py-2 text-xs font-medium text-[var(--home-ink)]">
                黑白骨架
              </span>
              <span className="rounded-full border border-[var(--home-border)] bg-[var(--home-duck)] px-4 py-2 text-xs font-medium text-[var(--home-ink)]">
                鸭黄色点题
              </span>
              <span className="rounded-full border border-[var(--home-border)] bg-[var(--home-meadow)] px-4 py-2 text-xs font-medium text-white">
                草甸绿收束
              </span>
            </div>

            <Link
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--home-ink)] transition-colors hover:text-[var(--home-meadow)]"
              href="#roles"
            >
              继续看适用人群
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-12 md:gap-5">
            {homeCollageCards.map((card) => (
              <article
                key={card.id}
                className={`home-collage-card ${card.sizeClassName} ${card.rotateClassName} ${
                  card.tone === "duck"
                    ? "home-collage-card--duck"
                    : card.tone === "meadow"
                      ? "home-collage-card--meadow"
                      : "home-collage-card--paper"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="home-collage-card__badge">{card.badge}</span>
                  <span className="text-[0.7rem] tracking-[0.28em] text-[var(--home-muted)] uppercase">
                    Picify
                  </span>
                </div>

                <div className="mt-8 space-y-3">
                  <h3 className="max-w-[12ch] text-xl leading-tight font-semibold text-[var(--home-ink)] sm:text-2xl">
                    {card.title}
                  </h3>
                  <p className="max-w-[28ch] text-sm leading-relaxed text-[var(--home-muted)]">
                    {card.detail}
                  </p>
                </div>

                <div className="mt-8 flex items-end gap-3">
                  <div className="home-collage-card__frame flex-1">
                    <div
                      className={`home-collage-card__image ${
                        card.tone === "duck"
                          ? "home-collage-card__image--duck"
                          : card.tone === "meadow"
                            ? "home-collage-card__image--meadow"
                            : "home-collage-card__image--paper"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`h-12 w-12 rounded-2xl border border-[var(--home-border)] ${
                        card.tone === "duck"
                          ? "bg-[var(--home-duck)]"
                          : card.tone === "meadow"
                            ? "bg-[var(--home-meadow)]"
                            : "bg-[var(--home-paper)]"
                      }`}
                    />
                    <div className="h-[4.5rem] w-12 rounded-3xl bg-[var(--home-ink)]/7" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
