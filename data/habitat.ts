import { Habitat } from "@/types";

import habitatsJson from "./habitats.json";

export const HabitatData: Habitat[] = (habitatsJson as Habitat[]).map((h, i) => ({
  ...h,
  x: (i + 1) % 20,
  y: Math.floor((i + 1) / 20),
}));
export const HabitatDataById = Object.fromEntries(HabitatData.map((h) => [h.index, h]));
export const HabitatDataByName = Object.fromEntries(HabitatData.map((h) => [h.name, h]));
