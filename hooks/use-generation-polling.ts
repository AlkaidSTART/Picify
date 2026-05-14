"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type GenerationStatus =
  | "idle"
  | "pending"
  | "generating"
  | "completed"
  | "failed";

interface GenerationResult {
  taskId: string;
  status: GenerationStatus;
  mode?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  reasoning?: {
    analysis: string;
    enhancedPrompt: string;
    styleNotes: string;
    compositionTip: string;
  };
  errorMessage?: string;
  remainingCredits?: number;
}

export function useGenerationPolling(taskId: string | null) {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const taskIdRef = useRef(taskId);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    taskIdRef.current = taskId;
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 30;
    let cancelled = false;

    const poll = async (isFirst: boolean) => {
      if (cancelled) return;

      if (attempts >= MAX_ATTEMPTS) {
        setStatus("failed");
        return;
      }

      if (isFirst) {
        setStatus("pending");
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/api/v1/generate/status?taskId=${taskId}`,
          { cache: "no-store" },
        );
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok || !data.ok) {
          attempts++;
          timerRef.current = setTimeout(() => poll(false), 2000);
          return;
        }

        const taskData = data.data;
        setStatus(taskData.status as GenerationStatus);

        if (taskData.status === "completed" || taskData.status === "failed") {
          setResult(taskData as GenerationResult);
        } else {
          attempts++;
          timerRef.current = setTimeout(() => poll(false), 2000);
        }
      } catch {
        if (cancelled) return;
        attempts++;
        timerRef.current = setTimeout(() => poll(false), 2000);
      }
    };

    poll(true);

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [taskId]);

  return { status, result, reset };
}
