"use client";

import { AppstoreOutlined } from "@ant-design/icons";
import { Drawer, Tabs } from "antd";
import cn from "classnames";
import { usePathname } from "next/navigation";
import { FC, useContext, useMemo, useState } from "react";

import { Icon, Link, useI18n } from "@/utils";

import { LanguageSwitch } from "./LanguageSwitch";
import { Navigation } from "./Navigation";
import { TableOfContents } from "./TableOfContents";
import { TocContext } from "./TocObserver";
import { isNavActive } from "./TopNavigation";
import { GitHubAuthWidget } from "./auth";
import { SearchBar } from "./search";

export const BottomNavigation: FC = () => {
  const pathname = usePathname();
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { tocItems = [] } = useContext(TocContext) || {};

  const isMoreActive = useMemo(
    () =>
      isNavActive(pathname, "/event-list") || isNavActive(pathname, "/walkthrough") || isNavActive(pathname, "/about"),
    [pathname],
  );

  const primaryItems = useMemo(
    () => [
      {
        path: "/",
        label: t("home"),
        icon: "home",
        active: isNavActive(pathname, "/"),
      },
      {
        path: "/pokemon-list",
        label: t("pokemonShort"),
        icon: "pokemon",
        active: isNavActive(pathname, "/pokemon-list"),
      },
      {
        path: "/habitat-list",
        label: t("habitatShort"),
        icon: "habitat",
        active: isNavActive(pathname, "/habitat-list"),
      },
      {
        path: "/item-list",
        label: t("itemShort"),
        icon: "collection",
        active: isNavActive(pathname, "/item-list"),
      },
      {
        path: "/community",
        label: t("communityShort"),
        icon: "github",
        active: isNavActive(pathname, "/community"),
      },
    ],
    [pathname, t],
  );

  return (
    <>
      <nav
        className="bottom-nav-dock fixed right-0 bottom-0 left-0 z-40 block border-t border-gray-200/90 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
        aria-label="Mobile Navigation"
      >
        <div className="flex h-14 items-center justify-around px-1">
          {primaryItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1 transition-transform active:scale-95",
                item.active ? "text-primary-dark font-bold" : "text-gray-500 hover:text-gray-800",
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <span className="text-xl leading-none">
                <Icon name={item.icon} />
              </span>
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
              {item.active ? <span className="bg-primary-dark mt-0.5 h-1 w-1 rounded-full" /> : null}
            </Link>
          ))}

          {/* More Menu Tab */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex flex-1 cursor-pointer flex-col items-center justify-center py-1 transition-transform active:scale-95",
              isMoreActive ? "text-primary-dark font-bold" : "text-gray-500 hover:text-gray-800",
            )}
            aria-label={t("navMore")}
          >
            <AppstoreOutlined className="text-lg leading-none" />
            <span className="mt-0.5 text-[10px] tracking-tight">{t("navMore")}</span>
            {isMoreActive ? <span className="bg-primary-dark mt-0.5 h-1 w-1 rounded-full" /> : null}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        destroyOnHidden
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="bottom"
        classNames={{
          body: "flex flex-col gap-4 p-4 max-h-[85vh] overflow-y-auto",
        }}
        styles={{
          wrapper: {
            maxHeight: "85vh",
            borderTopLeftRadius: "1.25rem",
            borderTopRightRadius: "1.25rem",
            overflow: "hidden",
          },
        }}
      >
        {/* Drawer Header Controls */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="logo shrink-0" />
            <span className="font-bold text-gray-900">{t("siteTitle")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitch size="small" />
            <GitHubAuthWidget size="small" />
          </div>
        </div>

        {/* Search */}
        <SearchBar onClick={() => setDrawerOpen(false)} />

        {/* Contents */}
        {tocItems.length > 0 ? (
          <Tabs
            defaultActiveKey="nav-site"
            items={[
              {
                key: "nav-site",
                label: t("siteNav"),
                children: <Navigation onClick={() => setDrawerOpen(false)} />,
              },
              {
                key: "nav-toc",
                label: t("tableOfContents"),
                children: <TableOfContents onClick={() => setDrawerOpen(false)} />,
              },
            ]}
          />
        ) : (
          <div>
            <div className="nav-title mb-2 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {t("siteNav")}
            </div>
            <Navigation onClick={() => setDrawerOpen(false)} />
          </div>
        )}
      </Drawer>
    </>
  );
};
