"use client";

import { GlobalOutlined } from "@ant-design/icons";
import { Select } from "antd";
import React, { FC } from "react";

import { SUPPORTED_LOCALES, SupportedLocale, useI18n } from "@/utils";

interface IProps {
  className?: string;
  size?: "small" | "middle" | "large";
}

export const LanguageSwitch: FC<IProps> = ({ className, size = "small" }) => {
  const { locale, setLocale } = useI18n();

  return (
    <div className={`inline-flex items-center gap-1.5 ${className || ""}`}>
      <GlobalOutlined className="text-gray-500" />
      <Select
        size={size}
        value={locale}
        onChange={(val) => setLocale(val as SupportedLocale)}
        className="w-28 text-xs"
        aria-label="Select Language"
        options={SUPPORTED_LOCALES.map((item) => ({
          value: item.value,
          label: (
            <span>
              <span className="mr-1">{item.flag}</span>
              {item.label}
            </span>
          ),
        }))}
      />
    </div>
  );
};
