import Head from "next/head";
import { FC, Fragment } from "react";

import { HabitatTable, PageTitle } from "@/components";
import { HabitatData } from "@/data";
import { DEFAULT_TITLE } from "@/utils";

export const metadata = {
  title: `Habitats - ${DEFAULT_TITLE}`,
  description: "Habitat list for Pokemon Pokopia.",
};

const HabitatListPage: FC = () => (
  <Fragment key="habitat-list">
    <Head>
      <title>Habitats</title>
    </Head>

    <section>
      <PageTitle titleKey="habitatList" />
    </section>

    <section>
      <HabitatTable data={HabitatData} />
    </section>
  </Fragment>
);

export default HabitatListPage;
