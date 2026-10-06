"use client";

import {
  BulbOutlined,
  CommentOutlined,
  FormOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card } from "antd";
import { FC, Fragment, useEffect } from "react";

import { Giscus } from "@/components";
import { useI18n } from "@/utils";

const CommunityPage: FC = () => {
  const { t, locale } = useI18n();

  useEffect(() => {
    document.title = `${t("communityTitle")} - ${t("siteTitle")}`;
  }, [t]);

  const giscusHost = process.env.NEXT_PUBLIC_GISCUS_HOST || "https://giscus.app";
  const giscusRepo = (process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`) || "silverogic/pokowiki";
  const giscusRepoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOU5hVEA";
  const giscusCategory = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General";
  const giscusCategoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "";
  const giscusLang = locale === "zh" ? "zh-CN" : locale === "ko" ? "ko" : locale === "ja" ? "ja" : "en";

  const categories = [
    {
      nameKey: "categoryGeneral" as const,
      descKey: "categoryGeneralDesc" as const,
      icon: <CommentOutlined className="text-2xl text-blue-500" />,
      href: "https://github.com/silverogic/pokowiki/discussions/categories/general",
    },
    {
      nameKey: "categoryQA" as const,
      descKey: "categoryQADesc" as const,
      icon: <QuestionCircleOutlined className="text-2xl text-amber-500" />,
      href: "https://github.com/silverogic/pokowiki/discussions/categories/q-a",
    },
    {
      nameKey: "categoryIdeas" as const,
      descKey: "categoryIdeasDesc" as const,
      icon: <BulbOutlined className="text-2xl text-yellow-500" />,
      href: "https://github.com/silverogic/pokowiki/discussions/categories/ideas",
    },
    {
      nameKey: "categoryShowAndTell" as const,
      descKey: "categoryShowAndTellDesc" as const,
      icon: <ShareAltOutlined className="text-2xl text-purple-500" />,
      href: "https://github.com/silverogic/pokowiki/discussions/categories/show-and-tell",
    },
    {
      nameKey: "categoryAnnouncements" as const,
      descKey: "categoryAnnouncementsDesc" as const,
      icon: <NotificationOutlined className="text-2xl text-emerald-500" />,
      href: "https://github.com/silverogic/pokowiki/discussions/categories/announcements",
    },
  ];

  return (
    <Fragment key="community">
      <section className="py-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <GithubOutlined className="text-4xl text-gray-800" />
          <h1 className="my-0 text-3xl font-bold sm:text-4xl">{t("communityTitle")}</h1>
        </div>
        <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-gray-600">{t("communityIntro")}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="primary"
            size="large"
            icon={<FormOutlined />}
            href="https://github.com/silverogic/pokowiki/discussions/new"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium shadow-sm"
          >
            {t("communityNewDiscussionBtn")}
          </Button>
          <Button
            size="large"
            icon={<GithubOutlined />}
            href="https://github.com/silverogic/pokowiki/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
          >
            {t("communityDiscussionsBtn")}
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <Alert
          message={t("communityNoticeLogin")}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="rounded-xl"
        />

        <div>
          <h2>{t("communityCategories")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block text-inherit no-underline"
              >
                <Card
                  hoverable
                  className="group-hover:border-primary/50 h-full border-gray-100 transition-all duration-200 group-hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="group-hover:bg-primary/10 shrink-0 rounded-lg bg-gray-50 p-2 transition-colors">
                      {cat.icon}
                    </div>
                    <div>
                      <div className="group-hover:text-primary text-base font-semibold text-gray-800 transition-colors">
                        {t(cat.nameKey)}
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-gray-500">{t(cat.descKey)}</div>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-gray-100 pt-6">
        <h2>{t("communityWidgetTitle")}</h2>
        {giscusCategoryId ? (
          <div className="giscus mt-4">
            <Giscus
              host={giscusHost}
              repo={giscusRepo}
              repoId={giscusRepoId}
              category={giscusCategory}
              categoryId={giscusCategoryId}
              mapping="specific"
              term="Community"
              reactions-enabled="1"
              emit-metadata="0"
              input-position="top"
              theme="preferred_color_scheme"
              lang={giscusLang}
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
            <CommentOutlined className="text-3xl text-gray-400" />
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-600">{t("communitySetupNotice")}</p>
            <div className="pt-2">
              <Button
                type="primary"
                ghost
                icon={<GithubOutlined />}
                href="https://github.com/silverogic/pokowiki/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("communityDiscussionsBtn")}
              </Button>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
};

export default CommunityPage;
