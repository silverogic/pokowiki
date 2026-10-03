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
  {
    title: "站外导航",
    contents: [
      {
        title: "官方网站",
        contents: [
          {
            path: "https://pokemonkorea.co.kr/pokemonpokopia",
            label: "한국어 공식 사이트",
            icon: "website-en",
            language: "ko",
          },
          {
            path: "https://www.pocoapokemon.jp/ja/",
            label: "일본 공식 사이트",
            icon: "website-ja",
            language: "ja",
          },
          {
            path: "https://pokopia.pokemon.com/en-us/",
            label: "영어 공식 사이트",
            icon: "website-en",
            language: "en",
          },
          {
            path: "https://www.pocoapokemon.jp/sc/",
            label: "중국어 간체 공식 사이트",
            icon: "website-zh-hans",
            language: "zh-hans",
          },
          {
            path: "https://www.pocoapokemon.jp/tc/",
            label: "중국어 번체 공식 사이트",
            icon: "website-zh-hant",
            language: "zh-hant",
          },
        ],
      },
    ],
  },
];
