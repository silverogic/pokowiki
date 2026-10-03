import { notFound } from "next/navigation";
import { Fragment } from "react";

import { PokemonDetail, PokemonHeader, PokemonIcon, PrevNext } from "@/components";
import { HabitatDataById, PokemonData } from "@/data";
import { DEFAULT_TITLE, getPokemonFullId } from "@/utils";

interface IProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: IProps) => {
  const { id } = await params;

  const pokemon = PokemonData.find((p) => getPokemonFullId(p) === id || p.slug === id);

  if (!pokemon) {
    return {
      title: `宝可梦不存在 - ${DEFAULT_TITLE}`,
    };
  }

  return {
    title: `${pokemon.name} - ${DEFAULT_TITLE}`,
    description: `“${pokemon.name}”是《宝可梦 Pokopia》中登场的宝可梦之一，它的栖息地${pokemon.habitats.length === 0 ? "不明" : `包括${pokemon.habitats.map((h) => HabitatDataById[h]?.name || h).join("、")}`}。`,
  };
};

export async function generateStaticParams() {
  const ids = new Set<string>();
  PokemonData.forEach((p) => {
    ids.add(getPokemonFullId(p));
    if (p.slug) ids.add(p.slug);
  });
  return Array.from(ids).map((id) => ({ id }));
}

const PokemonDetailPage = async ({ params }: IProps) => {
  const { id } = await params;

  const pokemon = PokemonData.find((p) => getPokemonFullId(p) === id || p.slug === id);

  if (!pokemon) notFound();

  const prevPokemon = PokemonData.find((p) => p.id === pokemon.id - 1) || PokemonData[PokemonData.length - 1];
  const nextPokemon = PokemonData.find((p) => p.id === pokemon.id + 1) || PokemonData[0];

  return (
    <Fragment key="pokemon">
      <PokemonHeader pokemon={pokemon} />

      <PokemonDetail pokemon={pokemon} />

      <PrevNext
        prev={
          prevPokemon
            ? {
                id: (prevPokemon.index % 10000).toString().padStart(3, "0"),
                isEvent: prevPokemon.isEvent,
                name: prevPokemon.name,
                icon: (
                  <PokemonIcon
                    pokemon={prevPokemon}
                    size={24}
                  />
                ),
                formName: prevPokemon.formName,
                link: `/p/${getPokemonFullId(prevPokemon)}`,
              }
            : null
        }
        next={
          nextPokemon
            ? {
                id: (nextPokemon.index % 10000).toString().padStart(3, "0"),
                isEvent: nextPokemon.isEvent,
                name: nextPokemon.name,
                icon: (
                  <PokemonIcon
                    pokemon={nextPokemon}
                    size={24}
                  />
                ),
                formName: nextPokemon.formName,
                link: `/p/${getPokemonFullId(nextPokemon)}`,
              }
            : null
        }
      />
    </Fragment>
  );
};

export default PokemonDetailPage;
