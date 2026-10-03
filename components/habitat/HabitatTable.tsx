"use client";

import { Table, TableColumnsType } from "antd";

import { PokemonDataByName } from "@/data";
import { Habitat } from "@/types";
import { TableCommonProps, TableTitle, compareNumeric, renderId } from "@/utils";

import { HabitatCell } from "./HabitatCell";
import { ItemLink } from "../item";
import { PokemonIconWithName } from "../pokemon";

export const HabitatTableColumns: TableColumnsType<Habitat> = [
  {
    title: <TableTitle k="index" />,
    dataIndex: "index",
    fixed: "left",
    width: 90,
    sorter: (a, b) => compareNumeric(a.index, b.index),
    render: (index: number) => renderId(index),
  },
  {
    title: <TableTitle k="name" />,
    dataIndex: "name",
    fixed: "left",
    width: 140,
    render: (_, row) => <HabitatCell habitat={row} />,
  },
  {
    title: <TableTitle k="pokemon" />,
    dataIndex: "pokemon",
    width: 340,
    render: (pokemon: Habitat["pokemon"]) => (
      <div className="flex flex-wrap gap-4 text-center">
        {pokemon.map((p) => (
          <PokemonIconWithName
            key={p.form}
            pokemon={PokemonDataByName[p.form]}
            link
          />
        ))}
      </div>
    ),
  },
  {
    title: <TableTitle k="details" />,
    dataIndex: "detail",
    width: 240,
    render: (detail: Habitat["detail"]) =>
      detail.map((d, i) => (
        <div key={i}>
          <ItemLink
            name={d.name}
            count={d.count}
          />
        </div>
      )),
  },
];

interface IHabitatTableProps {
  data?: Habitat[];
}

export const HabitatTable = ({ data }: IHabitatTableProps) => (
  <Table<Habitat>
    {...TableCommonProps}
    rowKey={(row) => row.id}
    columns={HabitatTableColumns}
    dataSource={data}
    pagination={false}
  />
);
