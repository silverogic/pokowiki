"use client";

import { Descriptions, DescriptionsProps, Table, TableColumnsType } from "antd";
import { FC, Fragment, ReactNode, useMemo } from "react";

import { HabitatDataById, PokemonDataByName } from "@/data";
import { Habitat, Pokemon } from "@/types";
import { DescriptionsCommonProps2, TableCommonProps, TranslationKey, renderId, useI18n } from "@/utils";

import { HabitatCell } from "./HabitatCell";
import { HabitatLink } from "./HabitatLink";
import { ItemLink } from "../item/ItemLink";
import { PokemonLink } from "../pokemon/PokemonLink";
import { PokemonTableColumns } from "../pokemon/PokemonTable";

const getDescriptions = (habitat: Habitat, t: (k: TranslationKey) => string): DescriptionsProps["items"] => [
  {
    key: "id",
    label: t("index"),
    children: renderId(habitat.index),
  },
  {
    key: "detail",
    label: t("details"),
    children: habitat.detail.map((d, i) => (
      <div key={i}>
        <ItemLink
          name={d.name}
          count={d.count}
        />
      </div>
    )),
  },
];

type MixedPokemon = Pokemon & {
  rarity: string;
  location: string;
};

const getColumns = (
  habitat: Habitat,
  t: (k: TranslationKey) => string,
  getLocationDisplayName: (location?: string | null) => string,
): TableColumnsType<MixedPokemon> => [
  ...(["name", "index", "specialties", "time", "weather"]
    .map((key) => PokemonTableColumns.find((c) => "dataIndex" in c && c.dataIndex === key)!)
    .filter(Boolean) as TableColumnsType<MixedPokemon>),
  {
    title: t("rarity"),
    dataIndex: "rarity",
    render: (rarity: string) =>
      rarity === "超稀有"
        ? t("ultraRare")
        : rarity === "非常稀有"
          ? t("veryRare")
          : rarity === "稀有"
            ? t("rare")
            : t("common"),
  },
  {
    title: t("location"),
    dataIndex: "location",
    render: (location: string) => getLocationDisplayName(location),
  },
  {
    title: t("otherHabitats"),
    dataIndex: "habitats",
    render: (habitats: Pokemon["habitats"]) => {
      const otherHabitats = habitats.filter((h) => h !== habitat.index);
      return otherHabitats.length > 0
        ? otherHabitats.map((h) => (
            <HabitatCell
              key={h}
              habitat={HabitatDataById[h]}
            />
          ))
        : t("none");
    },
  },
];

interface IProps {
  habitat: Habitat;
}

export const HabitatDetail: FC<IProps> = ({ habitat }) => {
  const { t, getHabitatDisplayName, getLocationDisplayName } = useI18n();
  const displayName = getHabitatDisplayName(habitat);

  const noteworthyContents: ReactNode[] = [];

  for (const p of habitat.pokemon) {
    const pokemon = PokemonDataByName[p.form];
    if (!pokemon) continue;
    const pokemonContents: ReactNode[] = [];
    if (p.rarity === "超稀有") {
      pokemonContents.push(
        <>
          {t("habitatUltraRareNotice")}
          {pokemon.habitats.length > 1 ? (
            <>
              {" "}
              {t("habitatAlsoAppearsIn")}
              {pokemon.habitats
                .filter((h) => h !== habitat.index)
                .map((h, i) => (
                  <Fragment key={i}>
                    {i === 0 ? null : ", "}
                    <HabitatLink
                      key={h}
                      id={h}
                      showDetail={false}
                    />
                  </Fragment>
                ))}
              .
            </>
          ) : null}
        </>,
      );
    }
    if (p.location !== "全部") {
      pokemonContents.push(<>{t("habitatOnlyAppearsInLocation").replace("{0}", getLocationDisplayName(p.location))}</>);
    }
    switch (pokemon.weather) {
      case "100":
        pokemonContents.push(t("sunnyOnly"));
        break;
      case "110":
        pokemonContents.push(t("noRainOnly"));
        break;
      case "001":
        pokemonContents.push(t("rainyOnly"));
        break;
    }
    switch (pokemon.time) {
      case "1110":
        pokemonContents.push(t("daytimeOnly"));
        break;
      case "0001":
        pokemonContents.push(t("nighttimeOnly"));
        break;
    }
    if (pokemonContents.length > 0) {
      noteworthyContents.push(
        <>
          <PokemonLink name={p.form} />{" "}
          {pokemonContents.map((c, i) => (
            <Fragment key={i}>
              {i === 0 ? null : ` ${t("habitatAlsoNote")}`}
              {c}
            </Fragment>
          ))}
        </>,
      );
    }
  }

  const columns = useMemo(() => getColumns(habitat, t, getLocationDisplayName), [habitat, t, getLocationDisplayName]);

  return (
    <>
      <section>
        <p>
          <strong>{displayName}</strong> {t("habitatIntro")}{" "}
          {habitat.detail.map((d, i) => (
            <Fragment key={i}>
              {i === 0 ? null : ", "}
              <ItemLink
                name={d.name}
                count={d.count}
              />
            </Fragment>
          ))}
          {habitat.pokemon.length > 1
            ? t("habitatIntroPokemonMulti").replace("{0}", String(habitat.pokemon.length))
            : t("habitatIntroPokemonSingle")}
          {habitat.pokemon.map((p, i) => (
            <Fragment key={i}>
              {i === 0 ? null : ", "}
              <PokemonLink name={p.form} />
            </Fragment>
          ))}
          .
        </p>
        {noteworthyContents.length === 1 ? (
          <p>
            {t("noteworthyNotice")} {noteworthyContents[0]}
          </p>
        ) : null}
        {noteworthyContents.length > 1 ? (
          <>
            <p>{t("noteworthyNotice")}</p>
            <ul>
              {noteworthyContents.map((content, i) => (
                <li key={i}>{content}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section>
        <h2>{t("basicInfo")}</h2>
        <Descriptions
          {...DescriptionsCommonProps2}
          items={getDescriptions(habitat, t)}
        />
      </section>

      <section>
        <h2>{t("pokemonList")}</h2>
        <Table<MixedPokemon>
          {...TableCommonProps}
          rowKey={(row) => row.id}
          columns={columns}
          dataSource={habitat.pokemon
            .map((p) => {
              const pk = PokemonDataByName[p.form];
              if (!pk) return null;
              return {
                ...pk,
                rarity: p.rarity,
                location: p.location,
              };
            })
            .filter((p): p is MixedPokemon => Boolean(p))}
          pagination={false}
        />
      </section>
    </>
  );
};
