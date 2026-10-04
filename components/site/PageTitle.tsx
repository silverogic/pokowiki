"use client";

import React, { FC, useEffect } from "react";

import { TranslationKey, useI18n } from "@/utils";

interface IProps {
  titleKey: TranslationKey;
  fallback?: string;
}

export const PageTitle: FC<IProps> = ({ titleKey, fallback }) => {
  const { t } = useI18n();
  const title = t(titleKey) || fallback || "";

  useEffect(() => {
    if (title) {
      document.title = `${title} - ${t("siteTitle")}`;
    }
  }, [title, t]);

  return <h1>{title}</h1>;
};
