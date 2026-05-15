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
        <LoaderCircle className="h-8 w-8 animate-spin text-[var(--color-brand-strong)]" />
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[var(--color-muted)]">
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
            className={`glass-shallow group rounded-2xl p-5 text-left transition-all ${
              isSelected
                ? "glass-selected scale-[1.02] border-[rgba(127,176,234,0.45)]"
                : "hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            }`}
            type="button"
            onClick={() => onSelect(scene.id)}
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                isSelected
                  ? "bg-[var(--color-brand-strong)] text-white"
                  : "bg-[var(--color-brand)] text-[var(--color-brand-strong)]"
              }`}
            >
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">{scene.name}</h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {scene.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
