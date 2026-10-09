export interface ICategoryConfig {
  key: string;
  name: string;
  id: string;
  term: string;
  slug: string;
  emoji: string;
  labelKey: "categoryGeneral" | "categoryQA" | "categoryShowAndTell" | "categoryIdeas" | "categoryAnnouncements";
  descKey:
    | "categoryGeneralDesc"
    | "categoryQADesc"
    | "categoryShowAndTellDesc"
    | "categoryIdeasDesc"
    | "categoryAnnouncementsDesc";
}

export const COMMUNITY_CATEGORIES: ICategoryConfig[] = [
  {
    key: "general",
    name: "General",
    id: "DIC_kwDOU5hVEM4DG7CQ",
    term: "General",
    slug: "general",
    emoji: "💬",
    labelKey: "categoryGeneral",
    descKey: "categoryGeneralDesc",
  },
  {
    key: "q-a",
    name: "Q&A",
    id: "DIC_kwDOU5hVEM4DG7CR",
    term: "Q&A",
    slug: "q-a",
    emoji: "❓",
    labelKey: "categoryQA",
    descKey: "categoryQADesc",
  },
  {
    key: "show-and-tell",
    name: "Show and tell",
    id: "DIC_kwDOU5hVEM4DG7CT",
    term: "Show and tell",
    slug: "show-and-tell",
    emoji: "🙌",
    labelKey: "categoryShowAndTell",
    descKey: "categoryShowAndTellDesc",
  },
  {
    key: "ideas",
    name: "Ideas",
    id: "DIC_kwDOU5hVEM4DG7CS",
    term: "Ideas",
    slug: "ideas",
    emoji: "💡",
    labelKey: "categoryIdeas",
    descKey: "categoryIdeasDesc",
  },
  {
    key: "announcements",
    name: "Announcements",
    id: "DIC_kwDOU5hVEM4DG7CP",
    term: "Announcements",
    slug: "announcements",
    emoji: "📢",
    labelKey: "categoryAnnouncements",
    descKey: "categoryAnnouncementsDesc",
  },
];
