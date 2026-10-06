"use client";

import { FC, useEffect } from "react";

import { Habitat } from "@/types";
import { useI18n } from "@/utils";

import { HabitatIcon } from "./HabitatIcon";

interface IProps {
  habitat: Habitat;
}

export const HabitatHeader: FC<IProps> = ({ habitat }) => {
  const { getHabitatDisplayName, getHabitatDescription, t } = useI18n();

  const displayName = getHabitatDisplayName(habitat);

  useEffect(() => {
    document.title = `${displayName} - ${t("siteTitle")}`;
  }, [displayName, t]);

  return (
    <section>
      <div className="header-icon">
        <HabitatIcon
          habitat={habitat}
          size={128}
        />
      </div>
      <h1>{displayName}</h1>
      <div className="description">{getHabitatDescription(habitat) || "—"}</div>
    </section>
  );
};
