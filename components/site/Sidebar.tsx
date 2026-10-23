"use client";

import { FC, useContext } from "react";

import { useI18n } from "@/utils";

import { TableOfContents } from "./TableOfContents";
import { TocContext } from "./TocObserver";

export const Sidebar: FC = () => {
  const { tocItems = [] } = useContext(TocContext) || {};
  const { t } = useI18n();

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside className="hidden w-64 shrink-0 px-2 py-6 md:block">
      <nav
        className="nav-toc sticky top-28 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        aria-label={t("tableOfContents")}
      >
        <div className="nav-title mb-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
          {t("tableOfContents")}
        </div>
        <TableOfContents />
      </nav>
    </aside>
  );
};
