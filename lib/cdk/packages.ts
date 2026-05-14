export const PACKAGES = {
  starter: { credits: 30, bonus: 0, label: "体验包" },
  basic: { credits: 100, bonus: 10, label: "基础包" },
  pro: { credits: 300, bonus: 50, label: "专业包" },
  team: { credits: 800, bonus: 200, label: "团队包" },
} as const;

export type PackageType = keyof typeof PACKAGES;

export function getPackageInfo(type: PackageType) {
  return PACKAGES[type];
}

export function isValidPackageType(type: string): type is PackageType {
  return type in PACKAGES;
}
