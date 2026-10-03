"use client";

import { FC, Fragment, useEffect } from "react";

import { useI18n } from "@/utils";

const AboutPage: FC = () => {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("about")} - ${t("siteTitle")}`;
  }, [t]);

  return (
    <Fragment key="about">
      <section>
        <h1>{t("about")}</h1>
      </section>

      <section className="space-y-4">
        <p className="text-base leading-relaxed">
          {t("aboutIntro")}
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          {t("aboutDisclaimer")}
        </p>
        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
          <a
            href="https://github.com/silverogic/pokowiki"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:underline"
          >
            GitHub Repository
          </a>
          <span>·</span>
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:underline"
          >
            CC BY-NC-SA 4.0
          </a>
        </div>
      </section>
    </Fragment>
  );
};

export default AboutPage;
