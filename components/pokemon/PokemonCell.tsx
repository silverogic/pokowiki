"use client";

import { FC } from "react";

import { Pokemon } from "@/types";
import { Link, getPokemonFullId, useI18n } from "@/utils";

import { PokemonIcon } from "./PokemonIcon";

interface IProps {
  pokemon?: Pokemon;
}

export const PokemonCell: FC<IProps> = ({ pokemon }) => {
  const { getPokemonDisplayName } = useI18n();

  if (!pokemon) return null;

  return (
    <Link
      href={`/p/${getPokemonFullId(pokemon)}`}
      className="cell-pokemon"
    >
      <PokemonIcon pokemon={pokemon} />
      <div>
        <div className="pokemon-name">{getPokemonDisplayName(pokemon)}</div>
        {pokemon.formName ? <div className="pokemon-form">{pokemon.formName}</div> : null}
      </div>
    </Link>
  );
};
