export type ParamType = "select" | "text" | "image" | "color";

export type SceneParam = {
  key: string;
  label: string;
  type: ParamType;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

export type Scene = {
  id: string;
  persona: string;
  name: string;
  description: string;
  sampleImages: string[];
  params: SceneParam[];
};

export type Persona = {
  id: string;
  name: string;
  description: string;
  sceneCount: number;
};

const sceneCatalog: Scene[] = [
  {
    id: "product-main",
    persona: "ecommerce",
    name: "商品主图",
    description: "白底、场景、模特三类电商主图",
    sampleImages: ["/window.svg"],
    params: [
      {
        key: "productType",
        label: "产品类型",
        type: "select",
        required: true,
        options: [
          { label: "女装", value: "women" },
          { label: "美妆", value: "beauty" },
          { label: "家居", value: "home" },
        ],
      },
      {
        key: "style",
        label: "设计风格",
        type: "select",
        required: true,
        options: [
          { label: "简约高级", value: "minimal_luxury" },
          { label: "清新通透", value: "fresh_clean" },
          { label: "现代质感", value: "modern_editorial" },
        ],
      },
      {
        key: "productImage",
        label: "产品参考图",
        type: "image",
        required: true,
        placeholder: "上传产品图片（JPG/PNG）",
      },
    ],
  },
  {
    id: "xhs-cover",
    persona: "creator",
    name: "小红书封面",
    description: "3:4 封面图，适合测评与种草内容",
    sampleImages: ["/globe.svg"],
    params: [
      {
        key: "topic",
        label: "主题描述",
        type: "text",
        required: true,
        placeholder: "例如：夏日防晒测评",
      },
      {
        key: "style",
        label: "风格",
        type: "select",
        required: true,
        options: [
          { label: "简约高级", value: "minimal_luxury" },
          { label: "清新通透", value: "fresh_clean" },
          { label: "杂志质感", value: "editorial" },
        ],
      },
      {
        key: "tone",
        label: "色调",
        type: "color",
        required: false,
        options: [
          { label: "浅蓝", value: "light_blue" },
          { label: "黑白", value: "black_white" },
          { label: "自动推荐", value: "auto" },
        ],
      },
    ],
  },
  {
    id: "brand-concept",
    persona: "designer",
    name: "品牌概念图",
    description: "用于提案的风格化品牌概念视觉",
    sampleImages: ["/file.svg"],
    params: [
      {
        key: "industry",
        label: "行业",
        type: "select",
        required: true,
        options: [
          { label: "科技", value: "tech" },
          { label: "美妆", value: "beauty" },
          { label: "时尚", value: "fashion" },
        ],
      },
      {
        key: "keywords",
        label: "关键词",
        type: "text",
        required: false,
        placeholder: "例如：克制、现代、轻玻璃",
      },
    ],
  },
  {
    id: "report-cover",
    persona: "office",
    name: "汇报配图",
    description: "用于工作汇报封面与章节页配图",
    sampleImages: ["/next.svg"],
    params: [
      {
        key: "reportTopic",
        label: "汇报主题",
        type: "text",
        required: true,
        placeholder: "例如：Q3 渠道增长复盘",
      },
      {
        key: "chartStyle",
        label: "图形风格",
        type: "select",
        required: true,
        options: [
          { label: "商务简约", value: "business" },
          { label: "数据科技", value: "data_tech" },
          { label: "黑白高级", value: "bw" },
        ],
      },
    ],
  },
];

export function getPersonas(): Persona[] {
  const grouped = new Map<string, Scene[]>();

  for (const scene of sceneCatalog) {
    if (!grouped.has(scene.persona)) {
      grouped.set(scene.persona, []);
    }
    grouped.get(scene.persona)?.push(scene);
  }

  const labels: Record<string, { name: string; description: string }> = {
    ecommerce: { name: "电商商家", description: "主图、海报、详情页配图" },
    creator: { name: "自媒体人", description: "封面、配图、头像" },
    designer: { name: "设计师", description: "提案图、概念图、视觉探索" },
    office: { name: "职场白领", description: "汇报配图、PPT 素材" },
  };

  return Array.from(grouped.entries()).map(([id, scenes]) => ({
    id,
    name: labels[id]?.name ?? id,
    description: labels[id]?.description ?? "",
    sceneCount: scenes.length,
  }));
}

export function getScenesByPersona(persona: string): Scene[] {
  return sceneCatalog.filter((scene) => scene.persona === persona);
}
