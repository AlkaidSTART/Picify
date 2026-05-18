import { getScenesByPersona } from "../scenes/catalog";

const personaLabels: Record<string, string> = {
  ecommerce: "e-commerce seller",
  creator: "content creator",
  designer: "brand designer",
  office: "office professional",
};

const styleLabels: Record<string, string> = {
  minimal_luxury: "minimal luxury",
  fresh_clean: "fresh and clean",
  modern_editorial: "modern editorial",
  editorial: "editorial magazine style",
  business: "business minimalism",
  data_tech: "data-driven tech style",
  bw: "premium black and white",
};

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function buildBasicPrompt(
  persona: string,
  scene: string,
  params: Record<string, unknown>,
) {
  const sceneConfig = getScenesByPersona(persona).find(
    (item) => item.id === scene,
  );
  const personaLabel = personaLabels[persona] ?? persona;
  const sceneLabel = sceneConfig?.name ?? scene;

  const promptParts = [
    `Create a polished commercial image for a ${personaLabel}.`,
    `Scene: ${sceneLabel}.`,
    "The output should feel premium, clean, realistic, and production-ready.",
  ];

  const style = toText(params.style);
  if (style) {
    promptParts.push(`Visual style: ${styleLabels[style] ?? style}.`);
  }

  const filledParams = sceneConfig?.params
    .map((param) => {
      const rawValue = params[param.key];
      if (rawValue == null) return null;
      const value = toText(rawValue);
      if (!value) return null;

      const optionLabel =
        param.options?.find((option) => option.value === value)?.label ?? value;
      const label = param.label.replace(/：$/, "");
      if (param.type === "image") {
        return `${label}: use the uploaded reference image as a key visual reference (${optionLabel}).`;
      }
      return `${label}: ${optionLabel}.`;
    })
    .filter((item): item is string => Boolean(item));

  if (filledParams && filledParams.length > 0) {
    promptParts.push(...filledParams);
  }

  promptParts.push(
    "Keep the composition focused, lighting intentional, and details sharp.",
  );

  return promptParts.join(" ");
}
