"use client";

import { FC, useEffect } from "react";

import { Pokemon } from "@/types";
import { useI18n } from "@/utils";

import { PokemonIcon } from "./PokemonIcon";

interface IProps {
  pokemon: Pokemon;
}

export const PokemonHeader: FC<IProps> = ({ pokemon }) => {
  const { getPokemonDisplayName, getPokemonDescription, t, locale } = useI18n();

  const displayName = getPokemonDisplayName(pokemon);
  const description = getPokemonDescription(pokemon);

  useEffect(() => {
    document.title = `${displayName} - ${t("siteTitle")}`;
  }, [displayName, t]);

  const otherNames = [
    locale !== "ko" && pokemon.korean ? { lang: "ko", text: pokemon.korean } : null,
    locale !== "zh" && pokemon.name ? { lang: "zh", text: pokemon.name } : null,
    locale !== "ja" && pokemon.japanese ? { lang: "ja", text: pokemon.japanese } : null,
    locale !== "en" && pokemon.english ? { lang: "en", text: pokemon.english } : null,
  ].filter(Boolean) as { lang: string; text: string }[];

  return (
    <section>
      <div className="header-icon">
        <PokemonIcon
          pokemon={pokemon}
          size={128}
        />
      </div>
      <h1>{displayName}</h1>
      <div className="names">
        {otherNames.map((n, i) => (
          <div
            key={i}
            lang={n.lang}
          >
            {n.text}
          </div>
        ))}
      </div>
      {pokemon.formName ? <div className="mb-4 text-xl text-gray-600">{pokemon.formName}</div> : null}
      <div className="description">{description || "—"}</div>
    </section>
  );
};
