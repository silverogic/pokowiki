"use client";

import { FC, useEffect } from "react";

import { Item } from "@/types";
import { useI18n } from "@/utils";

import { ItemIcon } from "./ItemIcon";

interface IProps {
  item: Item;
}

export const ItemHeader: FC<IProps> = ({ item }) => {
  const { getItemDisplayName, t } = useI18n();

  const displayName = getItemDisplayName(item);

  useEffect(() => {
    document.title = `${displayName} - ${t("siteTitle")}`;
  }, [displayName, t]);

  return (
    <section>
      <div className="header-icon">
        <ItemIcon
          item={item}
          size={48}
        />
      </div>
      <h1>{displayName}</h1>
    </section>
  );
};
