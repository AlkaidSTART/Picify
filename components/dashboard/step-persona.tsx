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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand-strong)] border-t-transparent" />
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
            className={`glass-standard group rounded-2xl p-6 text-left transition-all ${
              isSelected
                ? "glass-selected scale-[1.02] border-[rgba(127,176,234,0.45)]"
                : "hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            }`}
            type="button"
            onClick={() => onSelect(persona.id)}
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                isSelected
                  ? "bg-[var(--color-brand-strong)] text-white"
                  : "bg-[var(--color-brand)] text-[var(--color-brand-strong)] group-hover:scale-110"
              }`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{persona.name}</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {persona.description}
            </p>
            <p className="mt-2 text-xs font-medium text-[var(--color-brand-strong)]">
              {persona.sceneCount} 个场景
            </p>
          </button>
        );
      })}
    </div>
  );
}
