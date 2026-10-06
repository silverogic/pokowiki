"use client";

import { FC, useEffect } from "react";

import { Pokemon } from "@/types";
import { useI18n } from "@/utils";

import { PokemonIcon } from "./PokemonIcon";

interface IProps {
  pokemon: Pokemon;
}

export const PokemonHeader: FC<IProps> = ({ pokemon }) => {
  const { getPokemonDisplayName, getPokemonDescription, getPokemonFormDisplayName, t } = useI18n();

  const displayName = getPokemonDisplayName(pokemon);
  const description = getPokemonDescription(pokemon);

  useEffect(() => {
    document.title = `${displayName} - ${t("siteTitle")}`;
  }, [displayName, t]);

  return (
    <section>
      <div className="header-icon">
        <PokemonIcon
          pokemon={pokemon}
          size={128}
        />
      </div>
      <h1>{displayName}</h1>
      {pokemon.formName ? (
        <div className="mb-4 text-xl text-gray-600">{getPokemonFormDisplayName(pokemon.formName)}</div>
      ) : null}
      <div className="description">{description || "—"}</div>
    </section>
  );
};
