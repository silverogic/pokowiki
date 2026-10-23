export * from "./pokemon";
export * from "./habitat";
export * from "./item";
export * from "./location";
export * from "./event";
export * from "./community";
export * from "./user";

export * from "./other";

export interface WalkthroughChapterI18n {
  title: string;
  description: string;
}

export interface WalkthroughSectionI18n {
  title: string;
  content: string;
  tips?: string[];
}

export interface WalkthroughChapter {
  id: string;
  title: string;
  order: number;
  description: string;
  sections: WalkthroughSection[];
  i18n?: {
    ko?: WalkthroughChapterI18n;
    en?: WalkthroughChapterI18n;
    ja?: WalkthroughChapterI18n;
    zh?: WalkthroughChapterI18n;
  };
}

export interface WalkthroughSection {
  title: string;
  content: string;
  tips?: string[];
  i18n?: {
    ko?: WalkthroughSectionI18n;
    en?: WalkthroughSectionI18n;
    ja?: WalkthroughSectionI18n;
    zh?: WalkthroughSectionI18n;
  };
}
