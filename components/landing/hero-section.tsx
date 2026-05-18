"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, CheckCircle2, ImagePlus, WandSparkles } from "lucide-react";

const SAMPLES = [
  { label: "电商白底主图", desc: "简洁高级的商品主图" },
  { label: "小红书封面", desc: "清新 ins 风互动封面" },
  { label: "促销海报", desc: "节日限时折扣海报" },
  { label: "品牌概念图", desc: "高端品牌视觉概念" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleLinesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sampleRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (titleLinesRef.current) {
        const lines = titleLinesRef.current.querySelectorAll("[data-title-line]");
        tl.from(lines, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
        }, 0);
      }

      if (ctaRef.current) {
        tl.from(ctaRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.4,
        }, 0.5);
      }

      if (sampleRef.current) {
        tl.from(sampleRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
        }, 0.6);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="text-center lg:text-left">
          <div ref={titleLinesRef}>
            <p
              data-title-line
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-1.5 text-xs text-[var(--color-muted)]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-brand-strong)]" />
              面向 C 端用户的场景化 AI 出图流程
            </p>

            <h1
              data-title-line
              className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              不写提示词，
            </h1>
            <h1
              data-title-line
              className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              直接做出可发布视觉
            </h1>

            <p
              data-title-line
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg lg:mx-0"
            >
              从角色到参数再到生成，全部收敛在一个稳定流程里。你只做业务选择，其余优化交给系统完成。
            </p>
          </div>

          <div ref={ctaRef} className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Link
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-brand-strong)] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brand-deep)] hover:shadow-[0_0_0_6px_rgba(127,176,234,0.15)] sm:w-auto"
              href="/dashboard"
            >
              免费开始
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white/65 px-8 py-3 text-sm font-semibold text-[var(--color-ink)] transition-all hover:bg-white hover:shadow-[0_0_0_4px_rgba(127,176,234,0.08)] sm:w-auto"
              href="#roles"
            >
              查看适用角色
            </a>
          </div>
        </div>

        <div ref={sampleRef} className="glass-standard rounded-[28px] p-3">
          <div className="rounded-3xl border border-white/80 bg-white/75 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--color-muted)]">生成样例预览</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-brand-strong)]">
                <WandSparkles className="h-3 w-3" />
                AI 生成
              </span>
            </div>

            <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-brand)] to-white p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <ImagePlus className="h-5 w-5 text-[var(--color-brand-strong)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {SAMPLES[activeIdx].label}
              </p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                {SAMPLES[activeIdx].desc}
              </p>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {SAMPLES.map((_, i) => (
                  <button
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIdx
                        ? "w-6 bg-[var(--color-brand-strong)]"
                        : "w-1.5 bg-[var(--color-border)]"
                    }`}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                  />
                ))}
              </div>
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
  );
}
