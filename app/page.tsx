"use client";

import { Fragment, useEffect } from "react";

import { PokemonListTitle, PokemonTable } from "@/components";
import { PokemonData } from "@/data";
import { useI18n } from "@/utils";

export default function Home() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("pokemonList")} - ${t("siteTitle")}`;
  }, [t]);

  return (
    <Fragment key="home">
      <section>
        <PokemonListTitle />
      </section>

      <section>
        <PokemonTable data={PokemonData} />
      </section>
    </Fragment>
  );
}
