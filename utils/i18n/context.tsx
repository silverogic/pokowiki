"use client";

import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US";
import jaJP from "antd/locale/ja_JP";
import koKR from "antd/locale/ko_KR";
import zhCN from "antd/locale/zh_CN";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { Pokemon } from "@/types";

import { TranslationKey, getTranslation } from "./translations";
import { SupportedLocale } from "./types";

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: TranslationKey) => string;
  getPokemonDisplayName: (pokemon?: Pokemon | null) => string;
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
  setLocale: () => {},
  t: (key) => key,
  getPokemonDisplayName: (p) => p?.name || "",
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
      case "en":
        return pokemon.english || pokemon.name;
      case "ja":
        return pokemon.japanese || pokemon.name;
      case "ko":
        return pokemon.english ? `${pokemon.name} (${pokemon.english})` : pokemon.name;
      case "zh":
      default:
        return pokemon.name;
    }
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        getPokemonDisplayName,
        antdLocale: antdLocales[locale] || enUS,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
