"use client";

import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import cn from "classnames";
import React, { FC } from "react";

import { useI18n, usePokopiaUser } from "@/utils";

interface IItemCollectButtonProps {
  itemId: string | number;
  className?: string;
}

export const ItemCollectButton: FC<IItemCollectButtonProps> = ({ itemId, className }) => {
  const { isCollected, toggleCollected } = usePokopiaUser();
  const { t } = useI18n();

  const collected = isCollected(String(itemId));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCollected(String(itemId));
  };

  return (
    <Tooltip
      title={collected ? t("itemCollected") : t("itemNotCollected")}
      placement="top"
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full p-1 text-base transition-all duration-200 active:scale-90",
          collected ? "scale-105 text-emerald-500 hover:text-emerald-600" : "text-gray-300 hover:text-gray-500",
          className,
        )}
        aria-label={collected ? t("itemCollected") : t("itemNotCollected")}
        aria-pressed={collected}
      >
        {collected ? <CheckCircleFilled /> : <CheckCircleOutlined />}
      </button>
    </Tooltip>
  );
};
