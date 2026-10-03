"use client";

import { Descriptions, DescriptionsProps } from "antd";
import { FC } from "react";

import { HabitatData, ItemData, ItemDataByName, ItemDataBySlug } from "@/data";
import { Item } from "@/types";
import { DescriptionsCommonProps2, Link, TranslationKey, useI18n } from "@/utils";

import { ItemIcon } from "./ItemIcon";
import { ItemLink } from "./ItemLink";
import { HabitatTable } from "../habitat/HabitatTable";

const getDescriptions = (item: Item, t: (k: TranslationKey) => string): DescriptionsProps["items"] => [
  {
    key: "category",
    label: t("category"),
    children: item.category || "—",
  },
  {
    key: "tag",
    label: t("tag"),
    children: item.tag || item.label || "—",
  },
  {
    key: "value",
    label: t("tradeValue"),
    children: item.value ? (
      <>
        <div>
          {t("regular")}：{item.value}
        </div>
        <div>
          {t("favoriteValue")}：{Math.floor(item.value * 1.5)}
        </div>
      </>
    ) : (
      "—"
    ),
  },
  ...(item.contentSource && item.contentSource !== "base"
    ? [
        {
          key: "contentSource",
          label: t("contentSource"),
          children:
            item.contentSource === "expansion-pass"
              ? t("dlcBasin")
              : item.contentSource === "event"
                ? t("eventSource")
                : t("freeUpdate"),
        },
      ]
    : []),
  ...(item.locations && item.locations.length > 0
    ? [
        {
          key: "locations",
          label: t("locations"),
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
          label: t("favorites"),
          children: item.favorites.map((f, i) => <div key={i}>{f}</div>),
        },
      ]
    : []),
];

interface IProps {
  item: Item;
}

export const ItemDetail: FC<IProps> = ({ item }) => {
  const { t, getItemDisplayName, locale } = useI18n();
  const displayName = getItemDisplayName(item);

  const availableHabitats = HabitatData.filter((h) => h.detail.some((d) => d.name === item.name));

  const canCraft = ItemData.filter((i) =>
    i.craftingRecipe?.some((m) => m.slug === item.slug || m.name.toLowerCase() === item.english?.toLowerCase()),
  );

  const introText =
    locale === "ko"
      ? `${displayName}은(는) 《포켓몬 포코피아》의 도구 중 하나입니다.`
      : locale === "en"
        ? `${displayName} is one of the items featured in Pokémon Pokopia.`
        : locale === "ja"
          ? `${displayName}は『ポケモン ポコピア』に登場する道具の一つです。`
          : `${item.name}是《宝可梦 Pokopia》中的道具之一${item.category ? `，它是一种${item.category}` : ""}。`;

  return (
    <>
      <section>
        <p>
          <strong>{displayName}</strong> {introText}
          {item.description ? ` ${item.description}` : null}
        </p>
      </section>

      <section>
        <h2>{t("basicInfo")}</h2>
        <Descriptions
          {...DescriptionsCommonProps2}
          items={getDescriptions(item, t)}
        />
      </section>

      {item.craftingRecipe && item.craftingRecipe.length > 0 ? (
        <section>
          <h2>{t("craftingRecipe")}</h2>
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
            <div className="mt-2 text-sm text-gray-500">
              {t("recipeLocation")}: {item.recipeLocation}
            </div>
          ) : null}
        </section>
      ) : null}

      {canCraft.length > 0 && (
        <section>
          <h2>{t("canCraft")}</h2>
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
                <span className="text-sm font-medium">{getItemDisplayName(crafted)}</span>
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
          <h2>{t("availableHabitats")}</h2>
          <HabitatTable data={availableHabitats} />
        </section>
      ) : null}
    </>
  );
};
