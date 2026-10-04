"use client";

import cn from "classnames";
import { usePathname } from "next/navigation";
import { FC, useContext } from "react";

import { useI18n } from "@/utils";

import { Navigation } from "./Navigation";
import { TableOfContents } from "./TableOfContents";
import { TocContext } from "./TocObserver";

export const Sidebar: FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "" || pathname === "/pokowiki" || pathname === "/pokowiki/";
  const { tocItems = [] } = useContext(TocContext) || {};
  const { t } = useI18n();

  if (isHome) {
    return (
      <aside className="hidden md:block">
        <nav className="nav-site sticky top-24">
          <div className="nav-title mb-2">{t("siteNav")}</div>
          <Navigation />
          {tocItems.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="nav-title mb-2">{t("tableOfContents")}</div>
              <TableOfContents />
            </div>
          )}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="hidden md:block">
      <nav className="nav-site">
        <div className="nav-title mb-2">{t("siteNav")}</div>
        <Navigation />
      </nav>
      <nav className={cn("nav-toc", tocItems.length > 0 ? "" : "hidden")}>
        <div className="nav-title mb-2">{t("tableOfContents")}</div>
        <TableOfContents />
      </nav>
    </aside>
  );
};
