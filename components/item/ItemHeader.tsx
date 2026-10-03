"use client";

import { FC, useEffect } from "react";

import { Item } from "@/types";
import { useI18n } from "@/utils";

import { ItemIcon } from "./ItemIcon";

interface IProps {
  item: Item;
}

export const ItemHeader: FC<IProps> = ({ item }) => {
  const { getItemDisplayName, t, locale } = useI18n();

  const displayName = getItemDisplayName(item);

  useEffect(() => {
    document.title = `${displayName} - ${t("siteTitle")}`;
  }, [displayName, t]);

  const otherNames = [
    locale !== "ko" && item.korean ? { lang: "ko", text: item.korean } : null,
    locale !== "zh" && item.name ? { lang: "zh", text: item.name } : null,
    locale !== "ja" && item.japanese ? { lang: "ja", text: item.japanese } : null,
    locale !== "en" && item.english ? { lang: "en", text: item.english } : null,
  ].filter(Boolean) as { lang: string; text: string }[];

  return (
    <section>
      <div className="header-icon">
        <ItemIcon
          item={item}
          size={48}
        />
      </div>
      <h1>{displayName}</h1>
      <div className="names">
        {otherNames.map((n, i) => (
          <div
            key={i}
            lang={n.lang}
          >
            {n.text}
          </div>
        ))}
      </div>
    </section>
  );
};
