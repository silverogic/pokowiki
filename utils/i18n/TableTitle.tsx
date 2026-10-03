"use client";

import React, { FC } from "react";

import { useI18n } from "./context";
import { TranslationKey } from "./translations";

export const TableTitle: FC<{ k: TranslationKey }> = ({ k }) => {
  const { t } = useI18n();
  return <>{t(k)}</>;
};
