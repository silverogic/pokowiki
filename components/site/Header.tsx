"use client";

import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Tabs, TabsProps } from "antd";
import { usePathname } from "next/navigation";
import { FC, useContext, useMemo, useState } from "react";

import { Link, useI18n } from "@/utils";

import { LanguageSwitch } from "./LanguageSwitch";
import { Navigation } from "./Navigation";
import { TableOfContents } from "./TableOfContents";
import { TocContext } from "./TocObserver";
import { GitHubAuthWidget } from "./auth";
import { SearchBar } from "./search";

export const Header: FC = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "" || pathname === "/pokowiki" || pathname === "/pokowiki/";
  const { tocItems = [] } = useContext(TocContext) || {};
  const { t } = useI18n();

  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "nav-site",
        label: t("siteNav"),
        children: <Navigation onClick={() => setShow(false)} />,
      },
      ...(tocItems.length > 0
        ? [
            {
              key: "nav-toc",
              label: t("tableOfContents"),
              children: <TableOfContents onClick={() => setShow(false)} />,
            },
          ]
        : []),
    ],
    [tocItems.length, t],
  );

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex min-w-0 items-center">
              <Link
                href="/"
                className="text-primary flex min-w-0 items-center text-xl font-bold sm:text-2xl"
              >
                <span className="logo shrink-0" />
                <span className="truncate">{t("siteTitle")}</span>
              </Link>
            </div>

            <div className="mx-8 hidden max-w-lg flex-1 md:block">
              <SearchBar />
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <LanguageSwitch />
              <GitHubAuthWidget />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <GitHubAuthWidget size="small" />
              <LanguageSwitch size="small" />
              <button
                className="p-2 transition-colors hover:bg-gray-50"
                aria-label="切换菜单"
                onClick={() => setShow((prev) => !prev)}
              >
                <MenuOutlined className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="header-fake">
        <div />
      </div>
      <Drawer
        destroyOnHidden={true}
        open={show}
        onClose={() => setShow(false)}
        placement="top"
        classNames={{
          body: "flex flex-col gap-4",
        }}
        styles={{
          wrapper: { height: "100%" },
        }}
      >
        <SearchBar onClick={() => setShow(false)} />
        {isHome ? (
          <div className="flex flex-col gap-4 overflow-y-auto">
            <div>
              <div className="nav-title mb-2">{t("siteNav")}</div>
              <Navigation onClick={() => setShow(false)} />
            </div>
            {tocItems.length > 0 && (
              <div className="border-t border-gray-100 pt-3">
                <div className="nav-title mb-2">{t("tableOfContents")}</div>
                <TableOfContents onClick={() => setShow(false)} />
              </div>
            )}
          </div>
        ) : tocItems.length > 0 ? (
          <Tabs items={items} />
        ) : (
          <div className="overflow-y-auto">
            <div className="nav-title mb-2">{t("siteNav")}</div>
            <Navigation onClick={() => setShow(false)} />
          </div>
        )}
      </Drawer>
    </>
  );
};
