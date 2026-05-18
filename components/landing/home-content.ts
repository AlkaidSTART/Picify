import {
  Briefcase,
  MessageSquare,
  PenTool,
  Store,
  type LucideIcon,
} from "lucide-react";

export type HomeStoryScene = {
  id: string;
  text: string;
  accent: "ink" | "duck" | "meadow";
  persona: string;
  collageStyle: "poster" | "product" | "editorial" | "diagram";
};

export type HomeCollageCard = {
  id: string;
  badge: string;
  title: string;
  detail: string;
  tone: "duck" | "meadow" | "paper";
  rotateClassName: string;
  sizeClassName: string;
};

export type HomePersonaEntry = {
  title: string;
  desc: string;
  value: string;
  href: string;
  icon: LucideIcon;
};

export const homeStoryScenes: HomeStoryScene[] = [
  {
    id: "brand",
    text: "Picify",
    accent: "ink",
    persona: "品牌",
    collageStyle: "poster",
  },
  {
    id: "spark",
    text: "让灵感快速浮现",
    accent: "duck",
    persona: "品牌句",
    collageStyle: "editorial",
  },
  {
    id: "ecommerce",
    text: "为电商商家而生",
    accent: "duck",
    persona: "电商商家",
    collageStyle: "product",
  },
  {
    id: "creator",
    text: "为自媒体人而生",
    accent: "meadow",
    persona: "自媒体人",
    collageStyle: "editorial",
  },
  {
    id: "designer",
    text: "为设计师而生",
    accent: "duck",
    persona: "设计师",
    collageStyle: "poster",
  },
  {
    id: "office",
    text: "为职场白领而生",
    accent: "meadow",
    persona: "职场白领",
    collageStyle: "diagram",
  },
];

export const homeCollageCards: HomeCollageCard[] = [
  {
    id: "commerce",
    badge: "电商主图",
    title: "白底也能保持高级感",
    detail: "白底、场景、促销三种版式。",
    tone: "duck",
    rotateClassName: "md:-rotate-6",
    sizeClassName: "md:col-span-4",
  },
  {
    id: "creator",
    badge: "封面叙事",
    title: "封面图像像杂志页一样被拉出来",
    detail: "适合小红书与公众号封面。",
    tone: "meadow",
    rotateClassName: "md:rotate-3",
    sizeClassName: "md:col-span-5",
  },
  {
    id: "designer",
    badge: "提案草图",
    title: "从概念字句直接长成版式",
    detail: "适合品牌概念图与提案页。",
    tone: "paper",
    rotateClassName: "md:-rotate-2",
    sizeClassName: "md:col-span-3",
  },
  {
    id: "office",
    badge: "汇报配图",
    title: "让说明页也有重点和节奏",
    detail: "适合流程图、数据页、对比页。",
    tone: "paper",
    rotateClassName: "md:rotate-6",
    sizeClassName: "md:col-span-4",
  },
];

export const homePersonaEntries: HomePersonaEntry[] = [
  {
    title: "电商商家",
    desc: "商品主图、详情配图、营销海报",
    value: "商品主图、详情配图、营销海报",
    href: "/dashboard?persona=ecommerce",
    icon: Store,
  },
  {
    title: "自媒体人",
    desc: "平台封面、吸睛配图、个性头像",
    value: "平台封面、吸睛配图、个性头像",
    href: "/dashboard?persona=creator",
    icon: PenTool,
  },
  {
    title: "设计师",
    desc: "灵感草图、品牌概念、提案辅助",
    value: "灵感草图、品牌概念、提案辅助",
    href: "/dashboard?persona=designer",
    icon: Briefcase,
  },
  {
    title: "职场白领",
    desc: "汇报插图、课件素材、演示文档",
    value: "汇报插图、课件素材、演示文档",
    href: "/dashboard?persona=office",
    icon: MessageSquare,
  },
];
