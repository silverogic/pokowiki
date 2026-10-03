"use client";

import cn from "classnames";
import { FC, useContext } from "react";

import { useI18n } from "@/utils";

import { Navigation } from "./Navigation";
import { TableOfContents } from "./TableOfContents";
import { TocContext } from "./TocObserver";

export const Sidebar: FC = () => {
  const { tocItems = [] } = useContext(TocContext) || {};
  const { t } = useI18n();

  return (
    <aside className="hidden md:block">
      <nav className="nav-site">
        <div className="nav-title">{t("siteNav")}</div>
        <Navigation />
      </nav>
      <nav className={cn("nav-toc", tocItems.length > 0 ? "" : "hidden")}>
        <div className="nav-title">{t("tableOfContents")}</div>
        <TableOfContents />
      </nav>
    </aside>
  );
};
