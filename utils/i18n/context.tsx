"use client";

import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";
import koKR from "antd/locale/ko_KR";
import zhCN from "antd/locale/zh_CN";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { Habitat, Item, Pokemon, PokemonType } from "@/types";

import {
  ENVIRONMENT_TRANSLATIONS,
  FAVORITE_TRANSLATIONS,
  HABITAT_REQUIREMENT_TRANSLATIONS,
  ITEM_CATEGORY_TRANSLATIONS,
  LOCATION_TRANSLATIONS,
  POKEMON_FORM_TRANSLATIONS,
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
  getPokemonFormDisplayName: (formName?: string | null) => string;
  getItemDisplayName: (item?: Item | null) => string;
  getItemCategoryDisplayName: (category?: string | null) => string;
  getHabitatDisplayName: (habitat?: Habitat | null) => string;
  getHabitatDescription: (habitat?: Habitat | null) => string;
  getLocationDisplayName: (location?: string | null) => string;
  getRequirementDisplayName: (name?: string | null) => string;
  getSpecialityDisplayName: (speciality?: string | null) => string;
  getTypeDisplayName: (type?: PokemonType | string | null) => string;
  getFavoriteDisplayName: (favorite?: string | null) => string;
  getEnvironmentDisplayName: (environment?: string | null) => string;
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
  getPokemonFormDisplayName: (fn) => fn || "",
  getItemDisplayName: (i) => i?.name || "",
  getItemCategoryDisplayName: (c) => c || "",
  getHabitatDisplayName: (h) => h?.name || "",
  getHabitatDescription: (h) => h?.description || "",
  getLocationDisplayName: (l) => l || "",
  getRequirementDisplayName: (r) => r || "",
  getSpecialityDisplayName: (s) => s || "",
  getTypeDisplayName: (ty) => ty || "",
  getFavoriteDisplayName: (f) => f || "",
  getEnvironmentDisplayName: (e) => e || "",
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

  const getPokemonFormDisplayName = (formName?: string | null): string => {
    if (!formName) return "";
    const match = POKEMON_FORM_TRANSLATIONS[formName];
    if (match) return match[locale] || match.zh || formName;
    return formName;
  };

  const getItemDisplayName = (item?: Item | null): string => {
    if (!item) return "";
    switch (locale) {
      case "ko":
        return item.korean || HABITAT_REQUIREMENT_TRANSLATIONS[item.name]?.ko || item.english || item.name;
      case "en":
        return item.english || HABITAT_REQUIREMENT_TRANSLATIONS[item.name]?.en || item.name;
      case "ja":
        return item.japanese || HABITAT_REQUIREMENT_TRANSLATIONS[item.name]?.ja || item.name;
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

  const getHabitatDescription = (habitat?: Habitat | null): string => {
    if (!habitat) return "";
    if (habitat.descriptions) {
      if (locale === "ko" && habitat.descriptions.ko) return habitat.descriptions.ko;
      if (locale === "en" && habitat.descriptions.en) return habitat.descriptions.en;
      if (locale === "ja" && habitat.descriptions.ja) return habitat.descriptions.ja;
      if (locale === "zh" && habitat.descriptions.zh) return habitat.descriptions.zh;
      return (
        habitat.descriptions[locale] ||
        habitat.descriptions.ko ||
        habitat.descriptions.en ||
        habitat.descriptions.zh ||
        habitat.description ||
        ""
      );
    }
    if (locale === "ko" && habitat.koreanDescription) return habitat.koreanDescription;
    return habitat.description || "";
  };

  const getLocationDisplayName = (location?: string | null): string => {
    if (!location) return "";
    const match = LOCATION_TRANSLATIONS[location];
    if (match) return match[locale] || match.zh || location;
    return location;
  };

  const getRequirementDisplayName = (name?: string | null): string => {
    if (!name) return "";
    const match = HABITAT_REQUIREMENT_TRANSLATIONS[name];
    if (match) return match[locale] || match.zh || name;
    return name;
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

  const getFavoriteDisplayName = (favorite?: string | null): string => {
    if (!favorite) return "";
    const match = FAVORITE_TRANSLATIONS[favorite];
    if (match) return match[locale] || match.en || favorite;
    return favorite;
  };

  const getEnvironmentDisplayName = (environment?: string | null): string => {
    if (!environment) return "";
    const match = ENVIRONMENT_TRANSLATIONS[environment];
    if (match) return match[locale] || match.en || environment;
    return environment;
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
        getPokemonFormDisplayName,
        getItemDisplayName,
        getItemCategoryDisplayName,
        getHabitatDisplayName,
        getHabitatDescription,
        getLocationDisplayName,
        getRequirementDisplayName,
        getSpecialityDisplayName,
        getTypeDisplayName,
        getFavoriteDisplayName,
        getEnvironmentDisplayName,
        antdLocale: antdLocales[locale] || enUS,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
