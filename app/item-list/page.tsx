import { FC, Fragment } from "react";

import { ItemTable, PageTitle } from "@/components";
import { ItemData } from "@/data";
import { DEFAULT_TITLE } from "@/utils";

export const metadata = {
  title: `도구 도감 - ${DEFAULT_TITLE}`,
  description: "포켓몬 포코피아의 도구 도감 목록입니다.",
};

const ItemListPage: FC = () => (
  <Fragment key="item-list">
    <section>
      <PageTitle titleKey="itemList" />
    </section>

    <section>
      <ItemTable data={ItemData} />
    </section>
  </Fragment>
);

export default ItemListPage;
