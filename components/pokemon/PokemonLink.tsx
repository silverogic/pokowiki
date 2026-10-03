"use client";

import { FC } from "react";

import { PokemonDataByName } from "@/data";
import { Link, getPokemonFullId, useI18n } from "@/utils";

import { PokemonIcon } from "./PokemonIcon";

interface IProps {
  name: string;
}

export const PokemonLink: FC<IProps> = ({ name }) => {
  const { getPokemonDisplayName } = useI18n();
  const pokemon = PokemonDataByName[name];
  const displayName = pokemon ? getPokemonDisplayName(pokemon) : name;

  return (
    <span className="icon-wrapper-inline">
      <PokemonIcon
        pokemon={pokemon}
        size={24}
      />
      {pokemon ? (
        <Link href={`/p/${getPokemonFullId(pokemon)}`}>
          {displayName}
          {pokemon.formName ? `（${pokemon.formName}）` : null}
        </Link>
      ) : (
        <span>{name}</span>
      )}
    </span>
  );
};
