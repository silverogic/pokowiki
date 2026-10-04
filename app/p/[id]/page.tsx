import { notFound } from "next/navigation";
import { Fragment } from "react";

import { PokemonDetail, PokemonHeader, PokemonIcon, PokemonName, PrevNext } from "@/components";
import { PokemonData } from "@/data";
import { DEFAULT_TITLE, getPokemonFullId } from "@/utils";

interface IProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: IProps) => {
  const { id } = await params;

  const pokemon = PokemonData.find((p) => getPokemonFullId(p) === id || p.slug === id);

  if (!pokemon) {
    return {
      title: `포켓몬을 찾을 수 없습니다 - ${DEFAULT_TITLE}`,
    };
  }

  const displayName = pokemon.korean || pokemon.english || pokemon.name;
  return {
    title: `${displayName} - ${DEFAULT_TITLE}`,
    description: `"${displayName}"은(는) 《포켓몬 포코피아》에 등장하는 포켓몬 중 하나입니다.`,
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
                name: <PokemonName pokemon={prevPokemon} />,
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
                name: <PokemonName pokemon={nextPokemon} />,
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
