"use client";

import { Table, TableColumnsType } from "antd";
import { useMemo } from "react";

import { HabitatDataById } from "@/data";
import { EPokemonType, ESpecialities, Pokemon, PokemonType, Speciality } from "@/types";
import {
  PokemonTypeFilters,
  TableCommonProps,
  TableTitle,
  TimeIcons,
  TypeIcons,
  WeatherIcons,
  compareNumeric,
  renderId,
  useI18n,
} from "@/utils";

import { PokemonCell } from "./PokemonCell";
import { HabitatCell } from "../habitat/HabitatCell";
import { SpecialityLink } from "../speciality";

export const PokemonTableColumns: TableColumnsType<Pokemon> = [
  {
    title: <TableTitle k="pokemon" />,
    dataIndex: "name",
    fixed: "left",
    width: 140,
    render: (_, row) => <PokemonCell pokemon={row} />,
  },
  {
    title: <TableTitle k="index" />,
    dataIndex: "index",
    fixed: "left",
    width: 90,
    sorter: (a, b) => compareNumeric(a.index, b.index),
    render: (index: number) => renderId(index),
  },
  {
    title: <TableTitle k="types" />,
    dataIndex: "types",
    width: 120,
    render: (types: Pokemon["types"]) => <TypeIcons types={types} />,
    filters: PokemonTypeFilters,
    onFilter: (value, record) => record.types.includes(value as PokemonType),
  },
  {
    title: <TableTitle k="specialties" />,
    dataIndex: "specialties",
    width: 140,
    filters: ESpecialities.map((s) => ({ text: s, value: s })),
    onFilter: (value, record) => record.specialties.includes(value as Speciality),
    filterSearch: true,
    render: (specialties: Pokemon["specialties"]) => (
      <div className="flex flex-col">
        {specialties.map((s) => (
          <SpecialityLink
            key={s}
            name={s}
          />
        ))}
      </div>
    ),
  },
  {
    title: <TableTitle k="habitats" />,
    dataIndex: "habitats",
    width: 220,
    render: (habitats: Pokemon["habitats"]) =>
      habitats.map((l) => (
        <HabitatCell
          key={l}
          habitat={HabitatDataById[l]}
        />
      )),
  },
  {
    title: <TableTitle k="time" />,
    dataIndex: "time",
    width: 140,
    render: (time: string) => <TimeIcons time={time} />,
  },
  {
    title: <TableTitle k="weather" />,
    dataIndex: "weather",
    width: 120,
    render: (weather: string) => <WeatherIcons weather={weather} />,
  },
];

interface IPokemonTableProps {
  data?: Pokemon[];
}

export const PokemonTable = ({ data }: IPokemonTableProps) => {
  const { getSpecialityDisplayName, getTypeDisplayName } = useI18n();

  const columns = useMemo(
    () =>
      PokemonTableColumns.map((col) => {
        if ("dataIndex" in col && col.dataIndex === "specialties") {
          return {
            ...col,
            filters: ESpecialities.map((s) => ({ text: getSpecialityDisplayName(s), value: s })),
          };
        }
        if ("dataIndex" in col && col.dataIndex === "types") {
          return {
            ...col,
            filters: EPokemonType.map((t) => ({ text: getTypeDisplayName(t), value: t })),
          };
        }
        return col;
      }),
    [getSpecialityDisplayName, getTypeDisplayName],
  );

  return (
    <Table<Pokemon>
      {...TableCommonProps}
      rowKey={(row) => row.id}
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
};
