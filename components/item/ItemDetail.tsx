"use client";

import { Descriptions, DescriptionsProps } from "antd";
import { FC } from "react";

import { HabitatData, ItemData, ItemDataByName, ItemDataBySlug } from "@/data";
import { Item } from "@/types";
import { DescriptionsCommonProps2, Link } from "@/utils";

import { ItemIcon } from "./ItemIcon";
import { ItemLink } from "./ItemLink";
import { HabitatTable } from "../habitat/HabitatTable";

const getDescriptions = (item: Item): DescriptionsProps["items"] => [
  {
    key: "category",
    label: "分类",
    children: item.category || "—",
  },
  {
    key: "tag",
    label: "标签",
    children: item.tag || item.label || "—",
  },
  {
    key: "value",
    label: "交易价值",
    children: item.value ? (
      <>
        <div>通常：{item.value}</div>
        <div>喜爱：{Math.floor(item.value * 1.5)}</div>
      </>
    ) : (
      "—"
    ),
  },
  ...(item.contentSource && item.contentSource !== "base"
    ? [
        {
          key: "contentSource",
          label: "内容来源",
          children:
            item.contentSource === "expansion-pass"
              ? "DLC 泡泡盆地 (Bubbly Basin)"
              : item.contentSource === "event"
                ? "限定活动"
                : "免费更新",
        },
      ]
    : []),
  ...(item.locations && item.locations.length > 0
    ? [
        {
          key: "locations",
          label: "获取途径 / 区域",
          children: (
            <div className="flex flex-col gap-1">
              {item.locations.map((loc, i) => (
                <div key={i}>{loc}</div>
              ))}
            </div>
          ),
          span: 2,
        },
      ]
    : []),
  ...(item.favorites && item.favorites.length > 0
    ? [
        {
          key: "favorites",
          label: "喜欢的类别",
          children: item.favorites.map((f, i) => <div key={i}>{f}</div>),
        },
      ]
    : []),
];

interface IProps {
  item: Item;
}

export const ItemDetail: FC<IProps> = ({ item }) => {
  const availableHabitats = HabitatData.filter((h) => h.detail.some((d) => d.name === item.name));

  const canCraft = ItemData.filter((i) =>
    i.craftingRecipe?.some((m) => m.slug === item.slug || m.name.toLowerCase() === item.english?.toLowerCase()),
  );

  return (
    <>
      <section>
        <p>
          <strong>{item.name}</strong>是《宝可梦 Pokopia》中的道具之一
          {item.category ? `，它是一种${item.category}` : null}。{item.description ? ` ${item.description}` : null}
        </p>
      </section>

      <section>
        <h2>基本信息</h2>
        <Descriptions
          {...DescriptionsCommonProps2}
          items={getDescriptions(item)}
        />
      </section>

      {item.craftingRecipe && item.craftingRecipe.length > 0 ? (
        <section>
          <h2>制作配方</h2>
          <div className="flex flex-wrap gap-3 py-2">
            {item.craftingRecipe.map((mat, i) => {
              const matItem = ItemDataBySlug[mat.slug] || ItemDataByName[mat.name];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
                >
                  {matItem ? (
                    <ItemLink
                      name={matItem.name}
                      count={mat.quantity}
                    />
                  ) : (
                    <span>
                      {mat.name} × {mat.quantity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {item.recipeLocation ? (
            <div className="mt-2 text-sm text-gray-500">配方获取途径: {item.recipeLocation}</div>
          ) : null}
        </section>
      ) : null}

      {canCraft.length > 0 && (
        <section>
          <h2>可制作的道具</h2>
          <div className="flex flex-wrap gap-3 py-2">
            {canCraft.slice(0, 30).map((crafted) => (
              <Link
                key={crafted.slug}
                href={`/i/${crafted.hash}`}
                className="hover:border-primary flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 transition-colors"
              >
                <ItemIcon
                  item={crafted}
                  size={32}
                />
                <span className="text-sm font-medium">{crafted.name}</span>
              </Link>
            ))}
            {canCraft.length > 30 ? (
              <span className="self-center text-xs text-gray-400">等共 {canCraft.length} 种</span>
            ) : null}
          </div>
        </section>
      )}

      {availableHabitats?.length ? (
        <section>
          <h2>可以组成的栖息地</h2>
          <HabitatTable data={availableHabitats} />
        </section>
      ) : null}
    </>
  );
};
