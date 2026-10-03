"use client";

import { FC } from "react";

import { ItemDataByName } from "@/data";
import { Link, useI18n } from "@/utils";

import { ItemIcon } from "./ItemIcon";

interface IProps {
  name: string;
  count?: number;
}

export const ItemLink: FC<IProps> = ({ name, count }) => {
  const { getItemDisplayName } = useI18n();
  const item = ItemDataByName[name];
  const displayName = item ? getItemDisplayName(item) : name;

  return (
    <>
      <span className="icon-wrapper-inline">
        {item?.imageUrl ? (
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
