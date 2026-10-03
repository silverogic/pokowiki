import { SupportedLocale } from "./types";

export const translations = {
  siteTitle: {
    en: "Pokémon Pokopia Database",
    ko: "포켓몬 포코피아 데이터베이스",
    zh: "宝可梦 Pokopia 数据库",
    ja: "ポケモン ポコピア データベース",
  },
  siteNav: {
    en: "Site Navigation",
    ko: "사이트 내비게이션",
    zh: "站内导航",
    ja: "サイト内ナビ",
  },
  externalNav: {
    en: "External Links",
    ko: "외부 링크",
    zh: "站外导航",
    ja: "外部リンク",
  },
  tableOfContents: {
    en: "Table of Contents",
    ko: "목차",
    zh: "目录",
    ja: "目次",
  },
  search: {
    en: "Search",
    ko: "검색",
    zh: "搜索",
    ja: "検索",
  },
  searchPlaceholder: {
    en: "Search Pokémon, habitat, item...",
    ko: "포켓몬, 서식지, 아이템 검색...",
    zh: "搜索宝可梦、栖息地、道具...",
    ja: "ポケモン、生息地、道具を検索...",
  },
  home: {
    en: "Home",
    ko: "홈",
    zh: "首页",
    ja: "ホーム",
  },
  pokemonList: {
    en: "Pokémon List",
    ko: "포켓몬 도감",
    zh: "宝可梦一览",
    ja: "ポケモン一覧",
  },
  habitatList: {
    en: "Habitats",
    ko: "서식지 목록",
    zh: "栖息地一览",
    ja: "生息地一覧",
  },
  eventList: {
    en: "Events",
    ko: "이벤트 목록",
    zh: "活动一览",
    ja: "イベント一覧",
  },
  walkthrough: {
    en: "Walkthrough",
    ko: "스토리 공략",
    zh: "通关指南",
    ja: "攻略チャート",
  },
  about: {
    en: "About",
    ko: "소개",
    zh: "关于",
    ja: "について",
  },
  // Table headers
  pokemon: {
    en: "Pokémon",
    ko: "포켓몬",
    zh: "宝可梦",
    ja: "ポケモン",
  },
  index: {
    en: "No.",
    ko: "번호",
    zh: "编号",
    ja: "図鑑No.",
  },
  types: {
    en: "Type",
    ko: "타입",
    zh: "属性",
    ja: "タイプ",
  },
  specialties: {
    en: "Specialty",
    ko: "특기",
    zh: "特长",
    ja: "得意分野",
  },
  habitats: {
    en: "Habitats",
    ko: "서식지",
    zh: "栖息地",
    ja: "生息地",
  },
  time: {
    en: "Time",
    ko: "시간",
    zh: "时间",
    ja: "時間",
  },
  weather: {
    en: "Weather",
    ko: "날씨",
    zh: "天气",
    ja: "天気",
  },
  name: {
    en: "Name",
    ko: "이름",
    zh: "名字",
    ja: "名前",
  },
  image: {
    en: "Image",
    ko: "이미지",
    zh: "图片",
    ja: "画像",
  },
  eventDates: {
    en: "Dates",
    ko: "개최 기간",
    zh: "举办时间",
    ja: "開催期間",
  },
  details: {
    en: "Details",
    ko: "상세",
    zh: "详情",
    ja: "詳細",
  },
  comments: {
    en: "Comments",
    ko: "댓글",
    zh: "评论区",
    ja: "コメント",
  },
  language: {
    en: "Language",
    ko: "언어 선택",
    zh: "切换语言",
    ja: "言語切替",
  },
} as const;

export type TranslationKey = keyof typeof translations;

export const getTranslation = (key: TranslationKey, locale: SupportedLocale): string => {
  const item = translations[key];
  if (!item) return key;
  return item[locale] || item.en || key;
};
