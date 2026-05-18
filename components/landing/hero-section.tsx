"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

import {
  homeCollageCards,
  homeStoryScenes,
} from "@/components/landing/home-content";

gsap.registerPlugin(ScrollTrigger);

function splitText(text: string) {
  return Array.from(text);
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const accentPanelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const accentPanel = accentPanelRef.current;
    const line = lineRef.current;
    const dot = dotRef.current;

    if (!section || !stage || !accentPanel || !line || !dot) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const groups = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-story-group]"),
    );

    if (groups.length === 0) return;

    const getChars = (group: HTMLElement) =>
      Array.from(group.querySelectorAll<HTMLElement>("[data-story-char]"));

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const revealStaticLayout = () => {
        groups.forEach((group, groupIndex) => {
          const chars = getChars(group);
          gsap.set(group, {
            autoAlpha: groupIndex === 0 ? 1 : 0,
          });
          gsap.set(chars, {
            clearProps: "all",
          });
        });
        gsap.set([line, dot], { autoAlpha: 0 });
        gsap.set(accentPanel, { autoAlpha: 1, y: 0, x: 0, rotate: 0 });
      };

      if (reduceMotion) {
        revealStaticLayout();
        return;
      }

      const buildTimeline = (pin: boolean, end: string) => {
        const charsByGroup = groups.map((group) => getChars(group));
        const stageRect = stage.getBoundingClientRect();
        const centerX = stageRect.width / 2;
        const centerY = stageRect.height * 0.48;
        const lineY = centerY + 4;

        const lineOffsets = charsByGroup.map((chars) =>
          chars.map((char) => {
            const rect = char.getBoundingClientRect();
            const charCenterX = rect.left - stageRect.left + rect.width / 2;
            const charCenterY = rect.top - stageRect.top + rect.height / 2;

            return {
              x: centerX - charCenterX,
              y: lineY - charCenterY,
            };
          }),
        );

        charsByGroup.forEach((chars, groupIndex) => {
          gsap.set(groups[groupIndex], { autoAlpha: groupIndex === 0 ? 1 : 0 });
          gsap.set(chars, {
            x: 0,
            y: 0,
            opacity: groupIndex === 0 ? 1 : 0,
            scaleX: 1,
            scaleY: 1,
            transformOrigin: "50% 50%",
          });
        });

        gsap.set(line, {
          autoAlpha: 0,
          scaleX: 0.15,
          transformOrigin: "50% 50%",
        });
        gsap.set(dot, {
          autoAlpha: 0,
          scale: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(accentPanel, {
          autoAlpha: 0,
          x: 48,
          y: 28,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top+=76",
            end,
            scrub: 0.9,
            pin: pin ? stage : false,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        timeline.fromTo(
          stage.querySelectorAll("[data-stage-intro]"),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.24,
            stagger: 0.06,
          },
        );

        charsByGroup.forEach((chars, groupIndex) => {
          if (groupIndex === charsByGroup.length - 1) return;

          const nextChars = charsByGroup[groupIndex + 1];
          const nextOffsets = lineOffsets[groupIndex + 1];
          const showAccent = groupIndex >= 1;

          timeline
            .to(
              chars,
              {
                x: (index) => lineOffsets[groupIndex][index]?.x ?? 0,
                y: (index) => lineOffsets[groupIndex][index]?.y ?? 0,
                scaleY: 0.18,
                opacity: 0,
                duration: 0.28,
                stagger: 0.012,
              },
              "+=0.08",
            )
            .set(groups[groupIndex], { autoAlpha: 0 }, "<0.22")
            .fromTo(
              line,
              { autoAlpha: 0, scaleX: 0.1 },
              { autoAlpha: 1, scaleX: 1, duration: 0.2 },
              "<",
            )
            .to(
              line,
              {
                scaleX: 0.08,
                autoAlpha: 0.3,
                duration: 0.16,
              },
              ">-0.02",
            )
            .fromTo(
              dot,
              { autoAlpha: 0, scale: 0 },
              { autoAlpha: 1, scale: 1, duration: 0.14 },
              "<",
            )
            .set(groups[groupIndex + 1], { autoAlpha: 1 })
            .set(
              nextChars,
              {
                x: (index) => nextOffsets[index]?.x ?? 0,
                y: (index) => nextOffsets[index]?.y ?? 0,
                opacity: 0,
                scaleX: 0.35,
                scaleY: 0.18,
                transformOrigin: "50% 50%",
              },
              ">-0.01",
            )
            .to(
              dot,
              {
                autoAlpha: 0,
                scale: 0,
                duration: 0.12,
              },
              ">-0.02",
            )
            .to(
              line,
              {
                autoAlpha: 0,
                scaleX: 1,
                duration: 0.1,
              },
              "<",
            )
            .to(
              nextChars,
              {
                x: 0,
                y: 0,
                opacity: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 0.34,
                stagger: 0.02,
              },
              "<",
            );

          if (showAccent) {
            timeline.to(
              accentPanel,
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 0.3,
              },
              "<0.02",
            );
          }
        });

        timeline.to(
          stage.querySelectorAll("[data-stage-fade]"),
          {
            opacity: 0.45,
            y: -24,
            duration: 0.24,
          },
          ">-0.04",
        );

        return timeline;
      };

      mm.add("(min-width: 768px)", () => buildTimeline(true, "+=2300"));
      mm.add("(max-width: 767px)", () => buildTimeline(false, "+=980"));
    }, stage);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip px-4 pt-8 pb-14 sm:px-6 sm:pt-10 sm:pb-20"
    >
      <div
        ref={stageRef}
        className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between gap-10 md:min-h-[calc(100svh-3rem)]"
      >
        <div className="grid gap-8 pt-8 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:items-start md:pt-14">
          <div className="max-w-lg">
            <p
              data-stage-intro
              className="text-sm font-medium text-[var(--home-muted)] sm:text-base"
            >
              不用写 Prompt
            </p>
            <p
              data-stage-fade
              data-stage-intro
              className="mt-4 max-w-md text-sm leading-relaxed text-[var(--home-muted)] sm:text-base"
            >
              从角色、场景到结果，直接进入可发布的视觉产出。
            </p>
          </div>

          <div
            ref={accentPanelRef}
            data-stage-fade
            className="relative md:justify-self-end"
          >
            <div className="grid gap-3 sm:grid-cols-2 md:w-[360px]">
              {homeCollageCards.slice(0, 2).map((card) => (
                <article
                  key={card.id}
                  className={`home-mini-card ${card.rotateClassName} ${
                    card.tone === "duck"
                      ? "home-mini-card--duck"
                      : "home-mini-card--meadow"
                  }`}
                >
                  <span className="home-mini-card__badge">{card.badge}</span>
                  <h3 className="mt-6 text-lg leading-tight font-semibold">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--home-muted)]">
                    {card.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <p className="sr-only">
            Picify，让灵感快速浮现，为电商商家而生，为自媒体人而生，为设计师而生，为职场白领而生。
          </p>

          <div
            ref={lineRef}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[2px] w-[min(52vw,25rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--home-ink)]/55"
          />
          <div
            ref={dotRef}
            className="pointer-events-none absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--home-meadow)] shadow-[0_0_0_8px_rgba(111,145,96,0.12)]"
          />

          {homeStoryScenes.map((scene) => (
            <div
              key={scene.id}
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center"
              data-story-group={scene.id}
            >
              <div
                className={`flex max-w-5xl flex-wrap items-center justify-center gap-x-[0.08em] gap-y-3 text-balance ${
                  scene.id === "brand"
                    ? "home-mark text-[clamp(4.5rem,13vw,9rem)]"
                    : "text-[clamp(2.2rem,6.4vw,5.4rem)] font-semibold tracking-[-0.06em]"
                } ${
                  scene.accent === "duck"
                    ? "text-[var(--home-duck)]"
                    : scene.accent === "meadow"
                      ? "text-[var(--home-meadow)]"
                      : "text-[var(--home-ink)]"
                }`}
              >
                {splitText(scene.text).map((char, index) => (
                  <span
                    key={`${scene.id}-${char}-${index}`}
                    data-story-char
                    className={`inline-block ${
                      char === " " ? "w-[0.4em]" : ""
                    }`}
                  >
                    {char === " " ? "\u00a0" : char}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 pb-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div
            data-stage-fade
            className="flex flex-col gap-3 sm:flex-row md:col-start-2 md:justify-self-end"
          >
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--home-ink)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-black hover:shadow-[0_0_0_6px_rgba(30,30,26,0.12)]"
              href="/dashboard"
            >
              进入创作台
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[var(--home-border)] bg-white/88 px-7 py-3 text-sm font-semibold text-[var(--home-ink)] transition-all hover:border-[var(--home-meadow)] hover:bg-[var(--home-paper)]"
              href="#collage"
            >
              继续看版式展开
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
