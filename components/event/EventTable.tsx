"use client";

import { Table, TableColumnsType } from "antd";
import Image from "next/image";

import { PokemonDataByName } from "@/data";
import { Event } from "@/types";
import { Link, TableCommonProps, TableTitle } from "@/utils";

import { PokemonIconWithName } from "../pokemon";

const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map((x) => parseInt(x, 10));
  const date = new Date(year, month - 1, day);
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
};

export const EventTableColumns: TableColumnsType<Event> = [
  {
    title: <TableTitle k="name" />,
    dataIndex: "name",
    fixed: "left",
    width: 160,
    render: (name: string, row) =>
      row.newsUrl ? (
        <Link
          href={row.newsUrl}
          target="_blank"
        >
          {name}
        </Link>
      ) : (
        name
      ),
  },
  {
    title: <TableTitle k="image" />,
    dataIndex: "imageUrl",
    fixed: "left",
    width: 180,
    render: (imageUrl: string, row) =>
      imageUrl ? (
        <Image
          src={imageUrl}
          alt={row.name}
          width={160}
          height={90}
        />
      ) : null,
  },
  {
    title: <TableTitle k="eventDates" />,
    dataIndex: "dates",
    width: 220,
    render: (dates: Event["dates"]) => (
      <div className="flex flex-wrap gap-4 text-center">
        {dates.map(([start, end], i) => (
          <div key={i}>
            {parseDate(start)}～{parseDate(end)}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: <TableTitle k="pokemon" />,
    dataIndex: "pokemon",
    width: 280,
    render: (pokemon: Event["pokemon"]) => (
      <div className="flex flex-wrap gap-4 text-center">
        {pokemon.map((p) => {
          const pk = PokemonDataByName[p];
          return pk ? (
            <PokemonIconWithName
              key={p}
              pokemon={pk}
              link
            />
          ) : (
            <div
              key={p}
              className="flex w-[72px] flex-col items-center text-center text-xs text-gray-500"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">?</div>
              <div className="mt-1 max-w-full truncate">{p}</div>
            </div>
          );
        })}
      </div>
    ),
  },
];

interface IEventTableProps {
  data?: Event[];
}

export const EventTable = ({ data }: IEventTableProps) => (
  <Table<Event>
    {...TableCommonProps}
    rowKey={(row) => row.id}
    columns={EventTableColumns}
    dataSource={data}
    pagination={false}
  />
);
