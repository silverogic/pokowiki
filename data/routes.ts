import { NavigationItem } from "@/types";

type IHomepageNavigation = {
  title: string;
  contents: {
    title: string;
    contents: NavigationItem[];
  }[];
}[];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { path: "/", label: "首页", icon: "home" },
  { path: "/pokemon-list", label: "宝可梦一览", icon: "pokemon" },
  { path: "/habitat-list", label: "栖息地一览", icon: "habitat" },
  { path: "/item-list", label: "道具一览", icon: "collection" },
  { path: "/event-list", label: "活动一览", icon: "request" },
];

export const HOME_NAVIGATIONS: IHomepageNavigation = [
  {
    title: "站内导航",
    contents: [
      {
        title: "常用列表",
        contents: [
          { path: "/pokemon-list", label: "宝可梦一览", icon: "pokemon" },
          { path: "/habitat-list", label: "栖息地一览", icon: "habitat" },
          { path: "/item-list", label: "道具一览", icon: "collection" },
          { path: "/event-list", label: "活动一览", icon: "request" },
        ],
      },
    ],
  },
];

export interface OfficialLink {
  path: string;
  labelKey: "officialSiteKo" | "officialSiteJa" | "officialSiteEn" | "officialSiteZhHans" | "officialSiteZhHant";
}

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    path: "https://pokemonkorea.co.kr/pokemonpokopia",
    labelKey: "officialSiteKo",
  },
  {
    path: "https://www.pocoapokemon.jp/ja/",
    labelKey: "officialSiteJa",
  },
  {
    path: "https://pokopia.pokemon.com/en-us/",
    labelKey: "officialSiteEn",
  },
  {
    path: "https://www.pocoapokemon.jp/sc/",
    labelKey: "officialSiteZhHans",
  },
  {
    path: "https://www.pocoapokemon.jp/tc/",
    labelKey: "officialSiteZhHant",
  },
];
