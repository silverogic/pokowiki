export type SupportedLocale = "en" | "ko" | "zh" | "ja";

export interface ILocaleOption {
  value: SupportedLocale;
  label: string;
  flag: string;
}

export const SUPPORTED_LOCALES: ILocaleOption[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "zh", label: "简体中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
];
