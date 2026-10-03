"use client";

import { Descriptions, DescriptionsProps } from "antd";
import { FC, Fragment } from "react";

import { EventData, HabitatDataById, PokemonData, PokemonDataBySlug } from "@/data";
import { Pokemon } from "@/types";
import {
  DescriptionsCommonProps2,
  Link,
  TimeIcons,
  TranslationKey,
  TypeIcons,
  WeatherIcons,
  getPokemonFullId,
  getPokemonFullName,
  renderId,
  useI18n,
} from "@/utils";

import { POKEMON_COMMENTARY } from "../commentary";
import { EventTable } from "../event/EventTable";
import { HabitatCell, HabitatLink } from "../habitat";
import { ItemLink } from "../item/ItemLink";
import { SpecialityLink } from "../speciality";
import { PokemonIcon } from "./PokemonIcon";

const getDescriptions = (
  pokemon: Pokemon,
  t: (k: TranslationKey) => string,
  category: string,
): DescriptionsProps["items"] => [
  {
    key: "dex",
    label: t("dexNumber"),
    children: renderId(pokemon.index),
  },
  {
    key: "category",
    label: t("category"),
    children: category || "—",
  },
  {
    key: "height",
    label: t("height"),
    children: `${pokemon.height || "??.?"}m`,
  },
  {
    key: "weight",
    label: t("weight"),
    children: `${pokemon.weight || "??.?"}kg`,
  },
  {
    key: "types",
    label: t("types"),
    children: <TypeIcons types={pokemon.types} />,
  },
  {
    key: "specialties",
    label: t("specialties"),
    children: (
      <div className="flex flex-col">
        {pokemon.specialties.map((s) => (
          <SpecialityLink
            key={s}
            name={s}
          />
        ))}
      </div>
    ),
  },
  {
    key: "time",
    label: t("time"),
    children: <TimeIcons time={pokemon.time} />,
  },
  {
    key: "weather",
    label: t("weather"),
    children: <WeatherIcons weather={pokemon.weather} />,
  },
  {
    key: "favorites",
    label: t("favorites"),
    children: pokemon.favorites.length > 0 ? pokemon.favorites.join(" / ") : t("none"),
  },
  {
    key: "environment",
    label: t("environment"),
    children: pokemon.environment || t("none"),
  },
  {
    key: "habitats",
    label: t("habitats"),
    children:
      pokemon.habitats.length > 0
        ? pokemon.habitats.map((l) => (
            <div
              className="icon-wrapper flex-wrap"
              key={l}
            >
              <HabitatCell habitat={HabitatDataById[l]} />
              <div className="whitespace-normal">
                （{HabitatDataById[l]?.pokemon?.find((p) => p.form === getPokemonFullName(pokemon))?.rarity || "普通"}，
                {HabitatDataById[l]?.detail?.map((d, i) => (
                  <Fragment key={i}>
                    {i === 0 ? null : "、"}
                    <ItemLink
                      name={d.name}
                      count={d.count}
                    />
                  </Fragment>
                ))}
                ）
              </div>
            </div>
          ))
        : t("none"),
    span: 2,
  },
  ...(pokemon.spawnZones && pokemon.spawnZones.length > 0
    ? [
        {
          key: "spawnZones",
          label: t("spawnZones"),
          children: pokemon.spawnZones.join("、"),
          span: 2,
        },
      ]
    : []),
  ...(pokemon.contentSource && pokemon.contentSource !== "base"
    ? [
        {
          key: "contentSource",
          label: t("contentSource"),
          children:
            pokemon.contentSource === "expansion-pass"
              ? t("dlcBasin")
              : pokemon.contentSource === "event"
                ? t("eventSource")
                : t("freeUpdate"),
        },
      ]
    : []),
];

interface IProps {
  pokemon: Pokemon;
}

export const PokemonDetail: FC<IProps> = ({ pokemon }) => {
  const { t, getPokemonDisplayName, getPokemonCategory, locale } = useI18n();
  const displayName = getPokemonDisplayName(pokemon);
  const categoryName = getPokemonCategory(pokemon);

  const knownHabitats = pokemon.habitats;
  const fullId = getPokemonFullId(pokemon);
  const fullName = getPokemonFullName(pokemon);
  const locations = [
    ...new Set(
      pokemon.habitats
        .map((id) => HabitatDataById[id]?.pokemon?.find((p) => p.form === fullName)?.location)
        .filter((loc) => loc && loc !== "全部") as string[],
    ),
  ];
  const relatedEvents = pokemon.isEvent ? EventData.filter((e) => e.pokemon.includes(fullName)) : [];

  const Commentary = POKEMON_COMMENTARY[fullId];

  return (
    <>
      <section>
        {locale === "zh" ? (
          <>
            <p>
              <strong>{pokemon.name}</strong>
              {pokemon.formName ? `（${pokemon.formName}）` : null}是《宝可梦 Pokopia》中登场的宝可梦之一。它的特长
              {pokemon.specialties[0] === "不明" ? (
                "不明"
              ) : (
                <>
                  是<SpecialityLink name={pokemon.specialties[0]} />
                  {pokemon.specialties.length === 2 ? (
                    <>
                      和
                      <SpecialityLink name={pokemon.specialties[1]} />
                    </>
                  ) : null}
                </>
              )}
              。它的栖息地
              {knownHabitats.length === 0 ? (
                "不明"
              ) : (
                <>
                  {knownHabitats.length === 1 ? "是" : "包括"}
                  {knownHabitats.map((id, index) => (
                    <Fragment key={index}>
                      {index === 0 ? null : "、"}
                      <HabitatLink id={id} />
                    </Fragment>
                  ))}
                </>
              )}
              。
              {(() => {
                switch (pokemon.weather) {
                  case "111":
                    return "可以在任何天气的";
                  case "110":
                    return "可以在不下雨的";
                  case "100":
                    return "可以在晴天的";
                  case "001":
                    return "可以在下雨的";
                  default:
                    return "出现天气不明、";
                }
              })()}
              {(() => {
                switch (pokemon.time) {
                  case "1111":
                    return "任何时间遇到它";
                  case "1110":
                    return "白天的任何时间遇到它";
                  case "0001":
                    return "夜晚遇到它";
                  default:
                    return "出现时间不明";
                }
              })()}
              。{locations.length > 0 ? `它只会在${locations.join("、")}出现。` : null}
            </p>
            <p>
              它喜欢{pokemon.environment}的环境
              {pokemon.favorites.length > 1
                ? `，以及${pokemon.favorites.slice(0, 5).join("、")}物品和口味为“${pokemon.favorites[5][0]}”的食物`
                : null}
              。
            </p>
          </>
        ) : (
          <p>
            <strong>{displayName}</strong> {t("pokemonIntro")}
          </p>
        )}
      </section>

      <section>
        <h2>{t("basicInfo")}</h2>
        <Descriptions
          {...DescriptionsCommonProps2}
          items={getDescriptions(pokemon, t, categoryName)}
        />
      </section>

      {pokemon.previousEvolution || pokemon.nextEvolution ? (
        <section>
          <h2>{t("evolution")}</h2>
          <div className="flex flex-wrap items-center gap-4 py-2">
            {pokemon.previousEvolution ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{t("prevEvolution")}:</span>
                {(() => {
                  const prev =
                    PokemonDataBySlug[pokemon.previousEvolution.name] ||
                    PokemonData.find((p) => String(p.index).padStart(3, "0") === pokemon.previousEvolution?.number);
                  return prev ? (
                    <Link
                      href={`/p/${getPokemonFullId(prev)}`}
                      className="hover:border-primary flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 transition-colors"
                    >
                      <PokemonIcon
                        pokemon={prev}
                        size={40}
                      />
                      <span className="font-medium">{getPokemonDisplayName(prev)}</span>
                    </Link>
                  ) : (
                    <span>{pokemon.previousEvolution.name}</span>
                  );
                })()}
              </div>
            ) : null}
            {pokemon.previousEvolution && pokemon.nextEvolution ? <span className="text-gray-400">➔</span> : null}
            <div className="border-primary bg-primary/5 flex items-center gap-2 rounded-lg border-2 p-2">
              <PokemonIcon
                pokemon={pokemon}
                size={40}
              />
              <span className="text-primary font-bold">
                {displayName}（{t("current")}）
              </span>
            </div>
            {pokemon.nextEvolution ? (
              <>
                <span className="text-gray-400">➔</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{t("nextEvolution")}:</span>
                  {(() => {
                    const next =
                      PokemonDataBySlug[pokemon.nextEvolution.name] ||
                      PokemonData.find((p) => String(p.index).padStart(3, "0") === pokemon.nextEvolution?.number);
                    return next ? (
                      <Link
                        href={`/p/${getPokemonFullId(next)}`}
                        className="hover:border-primary flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 transition-colors"
                      >
                        <PokemonIcon
                          pokemon={next}
                          size={40}
                        />
                        <span className="font-medium">{getPokemonDisplayName(next)}</span>
                      </Link>
                    ) : (
                      <span>{pokemon.nextEvolution.name}</span>
                    );
                  })()}
                </div>
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {relatedEvents.length > 0 && (
        <section>
          <h2>{t("relatedEvents")}</h2>
          <EventTable data={relatedEvents} />
        </section>
      )}

      {Commentary ? <Commentary /> : null}
    </>
  );
};
