"use client";

import { FC } from "react";

import { Habitat } from "@/types";
import { Link, useI18n } from "@/utils";

import { HabitatIcon } from "./HabitatIcon";

interface IProps {
  habitat?: Habitat;
}

export const HabitatCell: FC<IProps> = ({ habitat }) => {
  const { getHabitatDisplayName } = useI18n();

  return habitat ? (
    <Link
      href={`/h/${habitat.index.toString().padStart(3, "0")}`}
      className="cell-habitat"
    >
      <HabitatIcon habitat={habitat} />
      {getHabitatDisplayName(habitat)}
    </Link>
  ) : null;
};

export const HabitatName: FC<{ habitat?: Habitat }> = ({ habitat }) => {
  const { getHabitatDisplayName } = useI18n();
  return <>{getHabitatDisplayName(habitat)}</>;
};
