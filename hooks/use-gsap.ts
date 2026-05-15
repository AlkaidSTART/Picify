"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      callback(ctx);
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}

export function useBlobs() {
  const blobsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blobsRef.current;
    if (!el) return;

    const blobs = el.querySelectorAll<HTMLDivElement>(".blob");
    if (blobs.length === 0) return;

    const tl = gsap.timeline({ repeat: -1 });

    blobs.forEach((blob, i) => {
      const duration = 20 + i * 5;
      const xRange = 40 + i * 20;
      const yRange = 30 + i * 15;

      tl.to(
        blob,
        {
          x: `+=${xRange}`,
          y: `+=${yRange}`,
          duration: duration / 4,
          ease: "sine.inOut",
        },
        0,
      );
      tl.to(
        blob,
        {
          x: `-=${xRange * 2}`,
          y: `-=${yRange}`,
          duration: duration / 4,
          ease: "sine.inOut",
        },
        duration / 4,
      );
      tl.to(
        blob,
        {
          x: `+=${xRange}`,
          y: `-=${yRange * 2}`,
          duration: duration / 4,
          ease: "sine.inOut",
        },
        duration / 2,
      );
      tl.to(
        blob,
        {
          x: 0,
          y: 0,
          duration: duration / 4,
          ease: "sine.inOut",
        },
        (duration * 3) / 4,
      );
    });

    const ctx = gsap.context(() => tl, el);
    return () => ctx.revert();
  }, []);

  return blobsRef;
}
