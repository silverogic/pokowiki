"use client";

import { FC } from "react";

import { CatchToggleButton } from "@/components/user";
import { Pokemon } from "@/types";
import { Link, getPokemonFullId, useI18n } from "@/utils";

import { PokemonIcon } from "./PokemonIcon";

interface IProps {
  pokemon?: Pokemon;
}

export const PokemonCell: FC<IProps> = ({ pokemon }) => {
  const { getPokemonDisplayName } = useI18n();

  if (!pokemon) return null;
  const fullId = getPokemonFullId(pokemon);

  return (
    <div className="flex items-center gap-1.5">
      <CatchToggleButton
        pokemonId={fullId}
        size={18}
      />
      <Link
        href={`/p/${fullId}`}
        className="cell-pokemon min-w-0"
      >
        <PokemonIcon pokemon={pokemon} />
        <div className="truncate">
          <div className="pokemon-name">{getPokemonDisplayName(pokemon)}</div>
          {pokemon.formName ? <div className="pokemon-form">{pokemon.formName}</div> : null}
        </div>
      </Link>
    </div>
  );
};

export const PokemonName: FC<{ pokemon?: Pokemon }> = ({ pokemon }) => {
  const { getPokemonDisplayName } = useI18n();
  return <>{getPokemonDisplayName(pokemon)}</>;
};
