"use client";

import cn from "classnames";
import { usePathname } from "next/navigation";
import { FC } from "react";

import { NAVIGATION_ITEMS } from "@/data";
import { Icon, Link, useI18n } from "@/utils";

interface ITopNavigationProps {
  className?: string;
  onClick?: () => void;
}

export const isNavActive = (pathname: string, path: string): boolean => {
  const clean = pathname === "" ? "/" : pathname;
  if (path === "/") {
    return clean === "/" || clean === "/pokowiki" || clean === "/pokowiki/";
  }
  if (path === "/pokemon-list") {
    return clean.includes("/pokemon-list") || clean.includes("/p/");
  }
  if (path === "/habitat-list") {
    return clean.includes("/habitat-list") || clean.includes("/h/");
  }
  if (path === "/item-list") {
    return clean.includes("/item-list") || clean.includes("/i/");
  }
  if (path === "/event-list") {
    return clean.includes("/event-list");
  }
  if (path === "/community") {
    return clean.includes("/community");
  }
  if (path === "/walkthrough") {
    return clean.includes("/walkthrough");
  }
  if (path === "/about") {
    return clean.includes("/about");
  }
  return decodeURIComponent(clean).startsWith(path);
};

export const TopNavigation: FC<ITopNavigationProps> = ({ className, onClick }) => {
  const pathname = usePathname();
  const { t } = useI18n();

  const getNavLabel = (path: string, fallback: string) => {
    switch (path) {
      case "/":
        return t("home");
      case "/pokemon-list":
        return t("pokemonList");
      case "/habitat-list":
        return t("habitatList");
      case "/item-list":
        return t("itemList");
      case "/event-list":
        return t("eventList");
      case "/community":
        return t("community");
      case "/walkthrough":
        return t("walkthrough");
      case "/about":
        return t("about");
      default:
        return fallback;
    }
  };

  return (
    <nav
      className={cn("top-navigation no-scrollbar flex h-11 items-center gap-1 overflow-x-auto py-1", className)}
      aria-label={t("siteNav")}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const active = isNavActive(pathname, item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClick}
            className={cn(
              "top-nav-item flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "top-nav-item-active bg-primary/20 text-primary-dark font-bold shadow-2xs"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-item-icon text-lg leading-none">
              <Icon name={item.icon} />
            </span>
            <span className="truncate">{getNavLabel(item.path, item.label)}</span>
          </Link>
        );
      })}
    </nav>
  );
};
