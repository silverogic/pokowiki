"use client";

import { FC, useEffect } from "react";

import { Habitat } from "@/types";
import { useI18n } from "@/utils";

import { HabitatIcon } from "./HabitatIcon";

interface IProps {
  habitat: Habitat;
}

export const HabitatHeader: FC<IProps> = ({ habitat }) => {
  const { getHabitatDisplayName, t, locale } = useI18n();

  const displayName = getHabitatDisplayName(habitat);

  useEffect(() => {
    document.title = `${displayName} - ${t("siteTitle")}`;
  }, [displayName, t]);

  const otherNames = [
    locale !== "ko" && habitat.korean ? { lang: "ko", text: habitat.korean } : null,
    locale !== "zh" && habitat.name ? { lang: "zh", text: habitat.name } : null,
    locale !== "ja" && habitat.japanese ? { lang: "ja", text: habitat.japanese } : null,
    locale !== "en" && habitat.english ? { lang: "en", text: habitat.english } : null,
  ].filter(Boolean) as { lang: string; text: string }[];

  return (
    <section>
      <div className="header-icon">
        <HabitatIcon
          habitat={habitat}
          size={128}
        />
      </div>
      <h1>{displayName}</h1>
      <div className="names">
        {otherNames.map((n, i) => (
          <div
            key={i}
            lang={n.lang}
          >
            {n.text}
          </div>
        ))}
      </div>
      <div className="description">{habitat.description || "—"}</div>
    </section>
  );
};
