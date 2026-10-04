"use client";

import { FC } from "react";

import { ItemDataByName } from "@/data";
import { Item } from "@/types";
import { Link, useI18n } from "@/utils";

import { ItemIcon } from "./ItemIcon";

interface IProps {
  name?: string;
  item?: Item;
  count?: number;
  showIcon?: boolean;
}

export const ItemLink: FC<IProps> = ({ name, item: itemProp, count, showIcon = true }) => {
  const { getItemDisplayName } = useI18n();
  const item = itemProp || (name ? ItemDataByName[name] : undefined);
  const displayName = item ? getItemDisplayName(item) : name || "";

  return (
    <>
      <span className="icon-wrapper-inline">
        {showIcon && item?.imageUrl ? (
          <ItemIcon
            item={item}
            size={24}
          />
        ) : null}
        {item ? <Link href={`/i/${item.hash}`}>{displayName}</Link> : <span>{name}</span>}
      </span>
      {count !== undefined ? ` × ${count}` : null}
    </>
  );
};

export const ItemName: FC<{ item?: Item | null }> = ({ item }) => {
  const { getItemDisplayName } = useI18n();
  return <>{getItemDisplayName(item)}</>;
};
