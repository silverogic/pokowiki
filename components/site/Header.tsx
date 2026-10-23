"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { FC, useContext, useState } from "react";

import { Link, useI18n } from "@/utils";

import { LanguageSwitch } from "./LanguageSwitch";
import { TableOfContents } from "./TableOfContents";
import { TocContext } from "./TocObserver";
import { TopNavigation } from "./TopNavigation";
import { GitHubAuthWidget } from "./auth";
import { SearchBar } from "./search";

export const Header: FC = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { tocItems = [] } = useContext(TocContext) || {};
  const { t } = useI18n();

  return (
    <>
      <header className="header-dock border-primary/40 fixed top-0 left-0 z-30 w-full border-b-2 bg-white/95 shadow-xs backdrop-blur-md transition-shadow">
        {/* Tier 1: Brand & Tools */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4 md:h-15">
            {/* Logo */}
            <div className="flex min-w-0 shrink-0 items-center">
              <Link
                href="/"
                className="flex min-w-0 items-center gap-2 text-lg font-bold text-gray-900 transition-opacity hover:opacity-90 sm:text-xl"
              >
                <span
                  className="logo shrink-0"
                  aria-label="Pokowiki Logo"
                />
                <span className="truncate">{t("siteTitle")}</span>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="mx-4 hidden max-w-md flex-1 md:block">
              <SearchBar />
            </div>

            {/* Desktop Controls */}
            <div className="hidden shrink-0 items-center gap-3 md:flex">
              <LanguageSwitch />
              <GitHubAuthWidget />
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100"
                aria-label={t("searchPlaceholder")}
              >
                <SearchOutlined className="text-lg" />
              </button>
              <LanguageSwitch size="small" />
              <GitHubAuthWidget size="small" />
            </div>
          </div>
        </div>

        {/* Tier 2: Desktop Top Navigation Bar */}
        <div className="hidden border-t border-gray-100 bg-white/90 md:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TopNavigation />
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from jumping beneath fixed header */}
      <div
        className="header-fake border-b-4 border-transparent"
        aria-hidden="true"
      >
        <div className="h-14 md:h-[108px]" />
      </div>

      {/* Mobile Search & Quick Nav Drawer */}
      <Drawer
        destroyOnHidden
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        placement="top"
        classNames={{
          body: "flex flex-col gap-4 p-4 max-h-[85vh] overflow-y-auto",
        }}
        styles={{
          wrapper: { maxHeight: "85vh" },
        }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="text-sm font-semibold text-gray-500">{t("searchPlaceholder")}</span>
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <SearchBar onClick={() => setMobileSearchOpen(false)} />

        {tocItems.length > 0 && (
          <div className="mt-2 border-t border-gray-100 pt-3">
            <div className="nav-title mb-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {t("tableOfContents")}
            </div>
            <TableOfContents onClick={() => setMobileSearchOpen(false)} />
          </div>
        )}
      </Drawer>
    </>
  );
};
