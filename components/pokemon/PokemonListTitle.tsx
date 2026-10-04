"use client";

import React, { FC, useEffect } from "react";

import { useI18n } from "@/utils";

export const PokemonListTitle: FC = () => {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("pokemonList")} - ${t("siteTitle")}`;
  }, [t]);

  return <h1>{t("pokemonList")}</h1>;
};
