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
        {pokemon.map((p) => {
          const pk = PokemonDataByName[p.form];
          return pk ? (
            <PokemonIconWithName
              key={p.form}
              pokemon={pk}
              link
            />
          ) : (
            <div
              key={p.form}
              className="flex w-[72px] flex-col items-center text-center text-xs text-gray-500"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">?</div>
              <div className="mt-1 max-w-full truncate">{p.form}</div>
            </div>
          );
        })}
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
