"use client";

import React, { FC } from "react";

import { useI18n } from "@/utils";

export const PokemonListTitle: FC = () => {
  const { t } = useI18n();
  return <h1>{t("pokemonList")}</h1>;
};
