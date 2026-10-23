"use client";

import { Tooltip } from "antd";
import cn from "classnames";
import React, { FC } from "react";

import { PokeBallIcon, useI18n, usePokopiaUser } from "@/utils";

interface ICatchToggleButtonProps {
  pokemonId: string | number;
  size?: number | string;
  className?: string;
}

export const CatchToggleButton: FC<ICatchToggleButtonProps> = ({ pokemonId, size = 20, className }) => {
  const { isCaught, toggleCaught } = usePokopiaUser();
  const { t } = useI18n();

  const caught = isCaught(String(pokemonId));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCaught(String(pokemonId));
  };

  return (
    <Tooltip
      title={caught ? t("caughtMarked") : t("caughtUnmarked")}
      placement="top"
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full p-1 transition-all duration-200 active:scale-90",
          caught
            ? "scale-105 opacity-100 drop-shadow-sm hover:scale-110"
            : "opacity-35 grayscale hover:opacity-75 hover:grayscale-0",
          className,
        )}
        aria-label={caught ? t("caughtMarked") : t("caughtUnmarked")}
        aria-pressed={caught}
      >
        <PokeBallIcon size={size} />
      </button>
    </Tooltip>
  );
};
