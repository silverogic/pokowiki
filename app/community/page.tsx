"use client";

import { ExportOutlined, GithubOutlined } from "@ant-design/icons";
import { Alert, Button, Tabs } from "antd";
import { FC, Fragment, useEffect, useMemo, useState } from "react";

import { Giscus } from "@/components";
import { useI18n } from "@/utils";

interface ICategoryConfig {
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

const CATEGORIES: ICategoryConfig[] = [
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

const CommunityPage: FC = () => {
  const { t, locale } = useI18n();
  const [activeKey, setActiveKey] = useState<string>("general");

  useEffect(() => {
    document.title = `${t("communityTitle")} - ${t("siteTitle")}`;
  }, [t]);

  const activeCategory = useMemo(() => CATEGORIES.find((c) => c.key === activeKey) || CATEGORIES[0], [activeKey]);

  const giscusHost = process.env.NEXT_PUBLIC_GISCUS_HOST || "https://giscus.app";
  const giscusRepo = (process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`) || "silverogic/pokowiki";
  const giscusRepoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOU5hVEA";
  const giscusLang = locale === "zh" ? "zh-CN" : locale === "ko" ? "ko" : locale === "ja" ? "ja" : "en";

  const tabItems = CATEGORIES.map((cat) => ({
    key: cat.key,
    label: (
      <span className="flex items-center gap-1.5 text-sm font-medium sm:text-base">
        <span>{cat.emoji}</span>
        <span>{t(cat.labelKey)}</span>
      </span>
    ),
  }));

  return (
    <Fragment key="community">
      <section className="py-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <GithubOutlined className="text-4xl text-gray-800" />
          <h1 className="my-0 text-3xl font-bold sm:text-4xl">{t("communityTitle")}</h1>
        </div>
        <p className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-gray-600">{t("communityIntro")}</p>
        <p className="mb-6 text-sm text-gray-500">{t("communityGiscusTip")}</p>

        <Alert
          type="info"
          showIcon
          icon={<GithubOutlined />}
          message={t("communityInstallGiscusNotice")}
          action={
            <Button
              size="small"
              type="primary"
              href="https://github.com/apps/giscus"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("communityInstallGiscusBtn")}
            </Button>
          }
          closable
          className="mx-auto mb-6 max-w-3xl rounded-xl text-left"
        />
      </section>

      <section className="mt-2">
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabItems}
          size="large"
          className="community-tabs"
        />

        <div className="my-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">{activeCategory.emoji}</span>
            <span>{t(activeCategory.descKey)}</span>
          </div>
          <a
            href={`https://github.com/silverogic/pokowiki/discussions/categories/${activeCategory.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex shrink-0 items-center gap-1 hover:underline"
          >
            <span>GitHub Discussions</span>
            <ExportOutlined />
          </a>
        </div>

        <div className="giscus mt-4 min-h-[480px]">
          <Giscus
            key={activeCategory.key}
            id="giscus-board"
            host={giscusHost}
            repo={giscusRepo}
            repoId={giscusRepoId}
            category={activeCategory.name}
            categoryId={activeCategory.id}
            mapping="specific"
            term={activeCategory.term}
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="preferred_color_scheme"
            lang={giscusLang}
            loading="eager"
          />
        </div>
      </section>
    </Fragment>
  );
};

export default CommunityPage;
