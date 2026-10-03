import Head from "next/head";
import { FC, Fragment } from "react";

import { ItemTable, PageTitle } from "@/components";
import { ItemData } from "@/data";
import { DEFAULT_TITLE } from "@/utils";

export const metadata = {
  title: `Items - ${DEFAULT_TITLE}`,
  description: "Item list for Pokemon Pokopia.",
};

const ItemListPage: FC = () => (
  <Fragment key="item-list">
    <Head>
      <title>Items</title>
    </Head>

    <section>
      <PageTitle titleKey="itemList" />
    </section>

    <section>
      <ItemTable data={ItemData} />
    </section>
  </Fragment>
);

export default ItemListPage;
