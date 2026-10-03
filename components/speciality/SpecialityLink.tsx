"use client";

import { FC } from "react";

import { Icon } from "@/utils";
import { useI18n } from "@/utils/i18n";

interface IProps {
  name: string;
}

export const SpecialityLink: FC<IProps> = ({ name }) => {
  const { getSpecialityDisplayName } = useI18n();
  return (
    <span className="icon-wrapper-inline">
      <Icon name={name} />
      <span>{getSpecialityDisplayName(name)}</span>
    </span>
  );
};
