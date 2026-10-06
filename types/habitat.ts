export interface Habitat {
  id: number;
  index: number;
  isEvent: boolean;
  isBubblyBasin: boolean;
  name: string;
  japanese: string;
  english: string;
  korean?: string;
  description: string;
  koreanDescription?: string;
  descriptions?: {
    zh?: string;
    en?: string;
    ko?: string;
    ja?: string;
  };
  detail: {
    name: string;
    count: number;
  }[];
  pokemon: {
    form: string;
    rarity: string;
    location: string;
  }[];
  x: number;
  y: number;
}
