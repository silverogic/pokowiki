"use client";

import React from "react";

import { OFFICIAL_LINKS } from "@/data";
import { Link, useI18n } from "@/utils";

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
        <span className="font-semibold text-gray-500">{t("officialWebsites")}:</span>
        {OFFICIAL_LINKS.map((link, index) => (
          <React.Fragment key={link.path}>
            {index > 0 && <span>·</span>}
            <a
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              {t(link.labelKey)}
            </a>
          </React.Fragment>
        ))}
      </div>
      <p className="font-medium text-gray-600">
        <Link
          href="/"
          className="hover:text-primary"
        >
          {t("siteTitle")}
        </Link>
        {" · "}
        <span>Pokémon Pokopia Fan Database</span>
        {" · "}
        <Link
          href="/about"
          className="hover:text-primary"
        >
          {t("about")}
        </Link>
      </p>
      <p className="text-xs text-gray-400">{t("footerDisclaimer")}</p>
      <p className="text-xs text-gray-400">{t("footerNotice")}</p>
      <p className="text-xs text-gray-400">{t("footerLicense")}</p>
      <p className="text-xs text-gray-400">
        <a
          href="https://github.com/silverogic/pokowiki"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub (silverogic/pokowiki)
        </a>
        {" · "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          CC BY-NC-SA 4.0
        </a>
      </p>
    </footer>
  );
};
