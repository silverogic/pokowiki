"use client";

import React, { FC } from "react";

import { TranslationKey, useI18n } from "@/utils";

interface IProps {
  titleKey: TranslationKey;
  fallback?: string;
}

export const PageTitle: FC<IProps> = ({ titleKey, fallback }) => {
  const { t } = useI18n();
  return <h1>{t(titleKey) || fallback}</h1>;
};
