import { WalkthroughChapter, WalkthroughSection } from "@/types";

import { SupportedLocale } from "./i18n";

export const getChapterTitle = (chapter: WalkthroughChapter, locale: SupportedLocale): string => {
  if (locale === "zh") return chapter.title;
  return chapter.i18n?.[locale]?.title || chapter.i18n?.en?.title || chapter.title;
};

export const getChapterDescription = (chapter: WalkthroughChapter, locale: SupportedLocale): string => {
  if (locale === "zh") return chapter.description;
  return chapter.i18n?.[locale]?.description || chapter.i18n?.en?.description || chapter.description;
};

export const getSectionTitle = (section: WalkthroughSection, locale: SupportedLocale): string => {
  if (locale === "zh") return section.title;
  return section.i18n?.[locale]?.title || section.i18n?.en?.title || section.title;
};

export const getSectionContent = (section: WalkthroughSection, locale: SupportedLocale): string => {
  if (locale === "zh") return section.content;
  return section.i18n?.[locale]?.content || section.i18n?.en?.content || section.content;
};

export const getSectionTips = (section: WalkthroughSection, locale: SupportedLocale): string[] => {
  if (locale === "zh") return section.tips || [];
  return section.i18n?.[locale]?.tips || section.i18n?.en?.tips || section.tips || [];
};
