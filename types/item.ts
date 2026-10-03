export interface CraftingMaterial {
  name: string;
  slug: string;
  quantity: number;
  iconUrl: string | null;
}

export interface Item {
  id: number;
  slug: string;
  hash: string;
  name: string;
  japanese: string;
  english: string;
  korean?: string;
  description?: string;
  hasIcon?: boolean;
  imageUrl?: string | null;
  category: string;
  tag?: string | null;
  label?: string;
  locations?: string[];
  obtains?: string[];
  craftingRecipe?: CraftingMaterial[] | null;
  recipeStatus?: "none" | "verified" | "incomplete";
  recipeLocation?: string | null;
  value: number;
  favorites?: string[];
  contentSource?: "base" | "free-update" | "event" | "expansion-pass";
  x?: number;
  y?: number;
}
