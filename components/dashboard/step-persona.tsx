"use client";

import { Briefcase, MessageSquare, PenTool, Store } from "lucide-react";

const PERSONA_ICONS: Record<string, typeof Store> = {
  ecommerce: Store,
  creator: PenTool,
  designer: Briefcase,
  office: MessageSquare,
};

interface Persona {
  id: string;
  name: string;
  description: string;
  sceneCount: number;
}

interface StepPersonaProps {
  personas: Persona[];
  selected: string;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function StepPersona({
  personas,
  selected,
  onSelect,
  loading,
}: StepPersonaProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--launch-duck)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
      {personas.map((persona) => {
        const Icon = PERSONA_ICONS[persona.id] ?? Store;
        const isSelected = selected === persona.id;

        return (
          <button
            key={persona.id}
            className={`launch-card group rounded-[1.75rem] p-6 text-left transition-all ${
              isSelected
                ? "launch-card--duck scale-[1.02]"
                : "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(29,29,24,0.08)]"
            }`}
            type="button"
            onClick={() => onSelect(persona.id)}
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                isSelected
                  ? "bg-[var(--launch-duck)] text-[var(--launch-ink)]"
                  : "border border-[var(--launch-border)] bg-white text-[var(--launch-ink)] group-hover:scale-110"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--launch-ink)]">
              {persona.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--launch-muted)]">
              {persona.description}
            </p>
            <p className="mt-3 text-xs font-medium text-[var(--launch-meadow)]">
              {persona.sceneCount} 个场景
            </p>
          </button>
        );
      })}
    </div>
  );
}
