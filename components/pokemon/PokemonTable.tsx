"use client";

import { Table, TableColumnsType } from "antd";

import { HabitatDataById } from "@/data";
import { ESpecialities, Pokemon, PokemonType, Speciality } from "@/types";
import {
  PokemonTypeFilters,
  TableCommonProps,
  TimeIcons,
  TypeIcons,
  WeatherIcons,
  compareNumeric,
  renderId,
} from "@/utils";

import { PokemonCell } from "./PokemonCell";
import { HabitatCell } from "../habitat/HabitatCell";
import { SpecialityLink } from "../speciality";

export const PokemonTableColumns: TableColumnsType<Pokemon> = [
  {
    title: "宝可梦",
    dataIndex: "name",
    fixed: "left",
    width: 140,
    render: (_, row) => <PokemonCell pokemon={row} />,
  },
  {
    title: "编号",
    dataIndex: "index",
    fixed: "left",
    width: 90,
    sorter: (a, b) => compareNumeric(a.index, b.index),
    render: (index: number) => renderId(index),
  },
  {
    title: "属性",
    dataIndex: "types",
    width: 120,
    render: (types: Pokemon["types"]) => <TypeIcons types={types} />,
    filters: PokemonTypeFilters,
    onFilter: (value, record) => record.types.includes(value as PokemonType),
  },
  {
    title: "特长",
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
    title: "栖息地",
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
    title: "时间",
    dataIndex: "time",
    width: 140,
    render: (time: string) => <TimeIcons time={time} />,
  },
  {
    title: "天气",
    dataIndex: "weather",
    width: 120,
    render: (weather: string) => <WeatherIcons weather={weather} />,
  },
];

interface IPokemonTableProps {
  data?: Pokemon[];
}

export const PokemonTable = ({ data }: IPokemonTableProps) => (
  <Table<Pokemon>
    {...TableCommonProps}
    rowKey={(row) => row.id}
    columns={PokemonTableColumns}
    dataSource={data}
    pagination={false}
  />
);
