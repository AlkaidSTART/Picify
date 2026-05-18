"use client";

import { Layers, LoaderCircle } from "lucide-react";

interface Scene {
  id: string;
  persona: string;
  name: string;
  description: string;
  sampleImages: string[];
}

interface StepSceneProps {
  scenes: Scene[];
  selected: string;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function StepScene({
  scenes,
  selected,
  onSelect,
  loading,
}: StepSceneProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle className="h-8 w-8 animate-spin text-[var(--launch-duck)]" />
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[var(--launch-muted)]">
        请先选择人群以加载场景列表
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {scenes.map((scene) => {
        const isSelected = selected === scene.id;

        return (
          <button
            key={scene.id}
            className={`launch-card group rounded-[1.5rem] p-5 text-left transition-all ${
              isSelected
                ? "launch-card--duck scale-[1.02]"
                : "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(29,29,24,0.08)]"
            }`}
            type="button"
            onClick={() => onSelect(scene.id)}
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                isSelected
                  ? "bg-[var(--launch-duck)] text-[var(--launch-ink)]"
                  : "border border-[var(--launch-border)] bg-white text-[var(--launch-ink)]"
              }`}
            >
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--launch-ink)]">
              {scene.name}
            </h3>
            <p className="mt-1 text-xs text-[var(--launch-muted)]">
              {scene.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
