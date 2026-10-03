export const EPokemonType = [
  "一般",
  "格斗",
  "飞行",
  "毒",
  "地面",
  "岩石",
  "虫",
  "幽灵",
  "钢",
  "火",
  "水",
  "草",
  "电",
  "超能力",
  "冰",
  "龙",
  "恶",
  "妖精",
] as const;

export type PokemonType = (typeof EPokemonType)[number];

export const ESpecialities = [
  "点火",
  "栽培",
  "滋润",
  "伐木",
  "建造",
  "重踏",
  "找东西",
  "飞翔",
  "瞬间移动",
  "回收利用",
  "分类",
  "发电",
  "碾压",
  "乱撒",
  "交易",
  "带动气氛",
  "哈欠",
  "梦岛",
  "采蜜",
  "收纳",
  "爆炸",
  "收藏家",
  "稀有物",
  "鉴定",
  "发光",
  "彩绘",
  "贪吃鬼",
  "开派对",
  "DJ",
  "工匠",
] as const;

export type Speciality = (typeof ESpecialities)[number] | "不明";

export interface PokemonEvolution {
  number: string;
  name: string;
}

export interface PokemonHabitatDetail {
  name: string;
  rarity: number | null;
  iconUrl: string | null;
}

export interface Pokemon {
  id: number;
  index: number;
  nationalNumber: number;
  slug: string;
  isEvent: boolean;
  isBubblyBasin: boolean;
  form: number;
  name: string;
  formName: string;
  japanese: string;
  english: string;
  korean?: string;
  koreanCategory?: string;
  englishCategory?: string;
  descriptions?: {
    zh?: string;
    en?: string;
    ko?: string;
    ja?: string;
  };
  types: PokemonType[];
  typeIcons?: (string | null)[];
  specialties: Speciality[];
  specialtyIcons?: (string | null)[];
  time: string;
  weather: string;
  habitats: number[];
  habitatDetails?: PokemonHabitatDetail[];
  environment: string;
  favorites: string[];
  category: string;
  description: string;
  height: string;
  weight: string;
  imageUrl?: string | null;
  spawnZones?: string[];
  previousEvolution?: PokemonEvolution | null;
  nextEvolution?: PokemonEvolution | null;
  contentSource?: "base" | "free-update" | "event" | "expansion-pass";
  x?: number;
  y?: number;
}
