import { notFound } from "next/navigation";
import { Fragment } from "react";

import { ItemDetail, ItemHeader, ItemIcon, PrevNext } from "@/components";
import { ItemData, ItemDataById, ItemDataBySlug } from "@/data";
import { DEFAULT_TITLE } from "@/utils";

interface IProps {
  params: Promise<{ hash: string }>;
}

export const generateMetadata = async ({ params }: IProps) => {
  const { hash } = await params;

  const item = ItemDataById[hash] || ItemDataBySlug[hash];

  if (!item) {
    return {
      title: `道具不存在 - ${DEFAULT_TITLE}`,
    };
  }

  return {
    title: `${item.name} - ${DEFAULT_TITLE}`,
    description: `道具“${item.name}”在《宝可梦 Pokopia》中的详细信息。`,
  };
};

export async function generateStaticParams() {
  const keys = new Set<string>();
  ItemData.forEach((item) => {
    if (item.hash) keys.add(item.hash);
    if (item.slug) keys.add(item.slug);
  });
  return Array.from(keys).map((hash) => ({ hash }));
}

const ItemDetailPage = async ({ params }: IProps) => {
  const { hash } = await params;

  const item = ItemDataById[hash] || ItemDataBySlug[hash];

  if (!item) notFound();

  const prevItem = ItemData.find((i) => i.id === item.id - 1) || ItemData[ItemData.length - 1];
  const nextItem = ItemData.find((i) => i.id === item.id + 1) || ItemData[0];

  return (
    <Fragment key="item">
      <ItemHeader item={item} />

      <ItemDetail item={item} />

      <PrevNext
        prev={
          prevItem
            ? {
                id: prevItem.id.toString().padStart(3, "0"),
                name: prevItem.name,
                icon: (
                  <ItemIcon
                    item={prevItem}
                    size={24}
                  />
                ),
                link: `/i/${prevItem.hash}`,
              }
            : null
        }
        next={
          nextItem
            ? {
                id: nextItem.id.toString().padStart(3, "0"),
                name: nextItem.name,
                icon: (
                  <ItemIcon
                    item={nextItem}
                    size={24}
                  />
                ),
                link: `/i/${nextItem.hash}`,
              }
            : null
        }
      />
    </Fragment>
  );
};

export default ItemDetailPage;
