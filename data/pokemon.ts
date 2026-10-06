import { Pokemon } from "@/types";
import { getPokemonFullId, getPokemonFullName } from "@/utils";

import pokemonJson from "./pokemon.json";

export const PokemonData: Pokemon[] = pokemonJson as Pokemon[];
export const PokemonDataById = Object.fromEntries(PokemonData.map((p) => [getPokemonFullId(p), p]));
export const PokemonDataBySlug = Object.fromEntries(PokemonData.map((p) => [p.slug, p]));
const pokemonByName: Record<string, Pokemon> = {};
// Map by base name first
PokemonData.forEach((p) => {
  if (!pokemonByName[p.name]) {
    pokemonByName[p.name] = p;
  }
});
// Map specifically by full name (e.g. name-form)
PokemonData.forEach((p) => {
  pokemonByName[getPokemonFullName(p)] = p;
});

// Aliases for pokemon names referenced in habitats.json or variant scrapers
const POKEMON_NAME_ALIASES: Record<string, string> = {
  蜂女王: "Vespiqueen",
  美丽花: "洛托姆",
  宝宝丁: "乐天河童",
  煤炭龟: "Torkoak",
  乌波: "大炭车",
  米立龙: "Tatsugiri Forma Lánguida",
  "米立龙-1": "Tatsugiri Forma Recta",
  "米立龙-2": "Tatsugiri Forma Curvada",
  颤弦蝾螈: "Toxtricity Forma Aguda",
  "颤弦蝾螈-1": "Toxtricity Forma Grave",
};

Object.entries(POKEMON_NAME_ALIASES).forEach(([alias, target]) => {
  if (pokemonByName[target]) {
    pokemonByName[alias] = pokemonByName[target];
  }
});

export const PokemonDataByName = pokemonByName;
