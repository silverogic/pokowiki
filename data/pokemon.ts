import { Pokemon } from "@/types";
import { getPokemonFullId, getPokemonFullName } from "@/utils";

import pokemonJson from "./pokemon.json";

export const PokemonData: Pokemon[] = pokemonJson as Pokemon[];
export const PokemonDataById = Object.fromEntries(PokemonData.map((p) => [getPokemonFullId(p), p]));
export const PokemonDataBySlug = Object.fromEntries(PokemonData.map((p) => [p.slug, p]));
export const PokemonDataByName = Object.fromEntries(PokemonData.map((p) => [getPokemonFullName(p), p]));
