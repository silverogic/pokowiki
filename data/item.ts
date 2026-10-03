import { Item } from "@/types";

import itemsJson from "./items.json";

export const ItemData: Item[] = itemsJson as Item[];
export const ItemDataById = Object.fromEntries(ItemData.map((h) => [h.hash, h]));
export const ItemDataBySlug = Object.fromEntries(ItemData.map((h) => [h.slug, h]));
export const ItemDataByName = Object.fromEntries(ItemData.map((h) => [h.name, h]));
