import { Item } from "@/types";

import itemsJson from "./items.json";

export const ItemData: Item[] = itemsJson as Item[];
export const ItemDataById = Object.fromEntries(ItemData.map((h) => [h.hash, h]));
export const ItemDataBySlug = Object.fromEntries(ItemData.map((h) => [h.slug, h]));
const itemByName: Record<string, Item> = {};
ItemData.forEach((i) => {
  itemByName[i.name] = i;
});

// Aliases for items referenced by Chinese name in habitats.json
const ITEM_NAME_ALIASES: Record<string, string> = {
  暴鲤龙喷泉: "Gyarados fountain",
  基拉祈台灯: "Jirachi lamp",
  云朵桌子: "Cloud table",
  泡泡机: "Bubble machine",
  搅拌机: "Blender",
  音乐盒: "Music box",
  竖琴: "Harp",
  装饰用超级球: "Decorative Great Ball",
  装饰用治愈球: "Decorative Heal Ball",
  装饰用潜水球: "Decorative Dive Ball",
  装饰用捕网球: "Decorative Net Ball",
  装饰用诱饵球: "Decorative Lure Ball",
};

Object.entries(ITEM_NAME_ALIASES).forEach(([alias, target]) => {
  if (itemByName[target]) {
    itemByName[alias] = itemByName[target];
  }
});

export const ItemDataByName = itemByName;
