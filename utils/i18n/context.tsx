"use client";

import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";
import koKR from "antd/locale/ko_KR";
import zhCN from "antd/locale/zh_CN";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { Habitat, Item, Pokemon, PokemonType } from "@/types";

import {
  ITEM_CATEGORY_TRANSLATIONS,
  SPECIALITY_TRANSLATIONS,
  TYPE_TRANSLATIONS,
  TranslationKey,
  getTranslation,
} from "./translations";
import { SupportedLocale } from "./types";

interface I18nContextType {
  locale: SupportedLocale;
  language: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: TranslationKey) => string;
  getPokemonDisplayName: (pokemon?: Pokemon | null) => string;
  getPokemonDescription: (pokemon?: Pokemon | null) => string;
  getPokemonCategory: (pokemon?: Pokemon | null) => string;
  getItemDisplayName: (item?: Item | null) => string;
  getItemCategoryDisplayName: (category?: string | null) => string;
  getHabitatDisplayName: (habitat?: Habitat | null) => string;
  getSpecialityDisplayName: (speciality?: string | null) => string;
  getTypeDisplayName: (type?: PokemonType | string | null) => string;
  antdLocale: Locale;
}

const antdLocales: Record<SupportedLocale, Locale> = {
  en: enUS,
  ko: koKR,
  zh: zhCN,
  ja: jaJP,
};

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  language: "en",
  setLocale: () => {},
  t: (key) => key,
  getPokemonDisplayName: (p) => p?.name || "",
  getPokemonDescription: (p) => p?.description || "",
  getPokemonCategory: (p) => p?.category || "",
  getItemDisplayName: (i) => i?.name || "",
  getItemCategoryDisplayName: (c) => c || "",
  getHabitatDisplayName: (h) => h?.name || "",
  getSpecialityDisplayName: (s) => s || "",
  getTypeDisplayName: (ty) => ty || "",
  antdLocale: enUS,
});

/**
 * 접속 지역 및 브라우저 환경에 따른 언어 자동 감지
 * (silverogic/uxui: i18n.md 가이드라인: 사용자 지역 언어 우선, 그 외에는 영어가 기본값)
 */
export const detectUserLocale = (): SupportedLocale => {
  if (typeof window === "undefined") return "en";

  try {
    const saved = localStorage.getItem("pokowiki_lang") as SupportedLocale;
    if (saved && ["en", "ko", "zh", "ja"].includes(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || (navigator as any).userLanguage || "").toLowerCase();
    if (browserLang.startsWith("ko")) return "ko";
    if (browserLang.startsWith("zh")) return "zh";
    if (browserLang.startsWith("ja")) return "ja";
    return "en"; // Default fallback is English
  } catch {
    return "en";
  }
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>("en");

  useEffect(() => {
    const detected = detectUserLocale();
    setLocaleState(detected);
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("pokowiki_lang", newLocale);
      document.documentElement.lang = newLocale;
    } catch {}
  };

  const t = (key: TranslationKey): string => getTranslation(key, locale);

  const getPokemonDisplayName = (pokemon?: Pokemon | null): string => {
    if (!pokemon) return "";
    switch (locale) {
      case "ko":
        return pokemon.korean || pokemon.english || pokemon.name;
      case "en":
        return pokemon.english || pokemon.name;
      case "ja":
        return pokemon.japanese || pokemon.name;
      case "zh":
      default:
        return pokemon.name;
    }
  };

  const getPokemonDescription = (pokemon?: Pokemon | null): string => {
    if (!pokemon) return "";
    if (pokemon.descriptions) {
      if (locale === "ko" && pokemon.descriptions.ko) return pokemon.descriptions.ko;
      if (locale === "en" && pokemon.descriptions.en) return pokemon.descriptions.en;
      if (locale === "ja" && pokemon.descriptions.ja) return pokemon.descriptions.ja;
      if (locale === "zh" && pokemon.descriptions.zh) return pokemon.descriptions.zh;
      return (
        pokemon.descriptions[locale] || pokemon.descriptions.en || pokemon.descriptions.zh || pokemon.description || ""
      );
    }
    return pokemon.description || "";
  };

  const getPokemonCategory = (pokemon?: Pokemon | null): string => {
    if (!pokemon) return "";
    if (locale === "ko" && pokemon.koreanCategory) return `${pokemon.koreanCategory}`;
    if (locale === "en" && pokemon.englishCategory) return `${pokemon.englishCategory}`;
    if (locale === "ja") return `${pokemon.category}ポケモン`;
    return `${pokemon.category || "？？"}宝可梦`;
  };

  const getItemDisplayName = (item?: Item | null): string => {
    if (!item) return "";
    switch (locale) {
      case "ko":
        return item.korean || item.english || item.name;
      case "en":
        return item.english || item.name;
      case "ja":
        return item.japanese || item.name;
      case "zh":
      default:
        return item.name;
    }
  };

  const getHabitatDisplayName = (habitat?: Habitat | null): string => {
    if (!habitat) return "";
    switch (locale) {
      case "ko":
        return habitat.korean || habitat.english || habitat.name;
      case "en":
        return habitat.english || habitat.name;
      case "ja":
        return habitat.japanese || habitat.name;
      case "zh":
      default:
        return habitat.name;
    }
  };

  const getSpecialityDisplayName = (speciality?: string | null): string => {
    if (!speciality) return "";
    const match = SPECIALITY_TRANSLATIONS[speciality];
    if (match) return match[locale] || match.en || speciality;
    return speciality;
  };

  const getTypeDisplayName = (type?: PokemonType | string | null): string => {
    if (!type) return "";
    const match = TYPE_TRANSLATIONS[type];
    if (match) return match[locale] || match.en || type;
    return type;
  };

  const getItemCategoryDisplayName = (category?: string | null): string => {
    if (!category) return "";
    const match = ITEM_CATEGORY_TRANSLATIONS[category.toLowerCase()];
    if (match) return match[locale] || match.en || category;
    return category;
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        language: locale,
        setLocale,
        t,
        getPokemonDisplayName,
        getPokemonDescription,
        getPokemonCategory,
        getItemDisplayName,
        getItemCategoryDisplayName,
        getHabitatDisplayName,
        getSpecialityDisplayName,
        getTypeDisplayName,
        antdLocale: antdLocales[locale] || enUS,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
