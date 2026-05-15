"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface BalanceBadgeProps {
  credits: number | null;
}

export function BalanceBadge({ credits }: BalanceBadgeProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prevCreditsRef = useRef(credits);

  useEffect(() => {
    if (credits === null || !numRef.current) return;
    const prev = prevCreditsRef.current;
    if (prev !== null && prev !== credits) {
      const obj = { val: prev };
      gsap.to(obj, {
        val: credits,
        duration: 0.6,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = String(Math.round(obj.val));
          }
        },
      });
    }
    prevCreditsRef.current = credits;
  }, [credits]);

  if (credits === null) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-strong)] px-3 py-1 text-xs font-semibold text-white">
      <span ref={numRef}>{credits}</span> 次
    </span>
  );
}
