import Head from "next/head";
import { FC, Fragment } from "react";

import { PokemonListTitle, PokemonTable } from "@/components";
import { PokemonData } from "@/data";
import { DEFAULT_TITLE } from "@/utils";

export const metadata = {
  title: `Pokemon - ${DEFAULT_TITLE}`,
  description: "Pokemon list for Pokemon Pokopia.",
};

const PokemonListPage: FC = () => (
  <Fragment key="pokemon-list">
    <Head>
      <title>Pokemon</title>
    </Head>

    <section>
      <PokemonListTitle />
    </section>

    <section>
      <PokemonTable data={PokemonData} />
    </section>
  </Fragment>
);

export default PokemonListPage;
