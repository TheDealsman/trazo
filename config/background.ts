export type BackgroundId = "paper" | "dark" | "cream" | "rose" | "mint" | "sky";

export interface BackgroundOption {
  id: BackgroundId;
  label: string;
  hex: string;
  dark?: boolean;
}

export const BACKGROUND_STORAGE_KEY = "trazo:background";

export const DEFAULT_BACKGROUND_ID: BackgroundId = "paper";

export const backgroundOptions: readonly BackgroundOption[] = [
  {
    id: "paper",
    label: "Paper",
    hex: "#ffffff",
  },
  {
    id: "dark",
    label: "Dark",
    hex: "#181715",
    dark: true,
  },
  {
    id: "cream",
    label: "Cream",
    hex: "#fff7e8",
  },
  {
    id: "rose",
    label: "Rose",
    hex: "#fff1f2",
  },
  {
    id: "mint",
    label: "Mint",
    hex: "#f0fdf4",
  },
  {
    id: "sky",
    label: "Sky",
    hex: "#f0f9ff",
  },
] as const;

export function isBackgroundId(value: string | null): value is BackgroundId {
  return backgroundOptions.some((option) => option.id === value);
}

export function findBackgroundOption(id: BackgroundId): BackgroundOption {
  return backgroundOptions.find((option) => option.id === id) ?? backgroundOptions[0];
}
