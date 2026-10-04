"use client";

import { Input, Table, TableColumnsType, Tag } from "antd";
import { FC, useMemo, useState } from "react";

import { Item } from "@/types";
import { Link, TableCommonProps, TableTitle, compareNumeric, renderId, useI18n } from "@/utils";
import { ITEM_CATEGORY_TRANSLATIONS } from "@/utils/i18n/translations";

import { ItemIcon } from "./ItemIcon";
import { ItemLink } from "./ItemLink";

interface IItemTableProps {
  data: Item[];
}

export const ItemTable: FC<IItemTableProps> = ({ data }) => {
  const { t, getItemCategoryDisplayName, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      const matchName =
        item.name.toLowerCase().includes(q) ||
        (item.korean && item.korean.toLowerCase().includes(q)) ||
        (item.english && item.english.toLowerCase().includes(q)) ||
        (item.japanese && item.japanese.toLowerCase().includes(q)) ||
        (item.slug && item.slug.toLowerCase().includes(q));
      const categoryName = getItemCategoryDisplayName(item.category).toLowerCase();
      const matchCategory = categoryName.includes(q) || item.category.toLowerCase().includes(q);
      return matchName || matchCategory;
    });
  }, [data, searchQuery, getItemCategoryDisplayName]);

  const categoryFilters = useMemo(() => {
    const keys = Object.keys(ITEM_CATEGORY_TRANSLATIONS);
    return keys.map((key) => ({
      text: ITEM_CATEGORY_TRANSLATIONS[key][locale] || ITEM_CATEGORY_TRANSLATIONS[key].en,
      value: key,
    }));
  }, [locale]);

  const columns: TableColumnsType<Item> = useMemo(
    () => [
      {
        title: <TableTitle k="index" />,
        dataIndex: "id",
        fixed: "left",
        width: 80,
        sorter: (a, b) => compareNumeric(a.id, b.id),
        render: (id: number) => renderId(id),
      },
      {
        title: <TableTitle k="name" />,
        dataIndex: "name",
        fixed: "left",
        width: 220,
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Link
              href={`/i/${row.hash}`}
              className="flex shrink-0 items-center"
            >
              <ItemIcon
                item={row}
                size={36}
              />
            </Link>
            <ItemLink
              item={row}
              showIcon={false}
            />
          </div>
        ),
      },
      {
        title: <TableTitle k="category" />,
        dataIndex: "category",
        width: 140,
        filters: categoryFilters,
        onFilter: (value, record) => record.category.toLowerCase() === (value as string).toLowerCase(),
        render: (cat: string) => <Tag color="blue">{getItemCategoryDisplayName(cat)}</Tag>,
      },
      {
        title: <TableTitle k="tradeValue" />,
        dataIndex: "value",
        width: 110,
        sorter: (a, b) => compareNumeric(a.value ?? 0, b.value ?? 0),
        render: (val: number) => (val > 0 ? `${val}` : "—"),
      },
      {
        title: <TableTitle k="contentSource" />,
        dataIndex: "contentSource",
        width: 140,
        filters: [
          { text: t("baseGame"), value: "base" },
          { text: t("dlcBasin"), value: "expansion-pass" },
          { text: t("eventSource"), value: "event" },
          { text: t("freeUpdate"), value: "free-update" },
        ],
        onFilter: (value, record) => record.contentSource === value,
        render: (src: string) => {
          if (src === "expansion-pass") return <Tag color="cyan">{t("dlcBasin")}</Tag>;
          if (src === "event") return <Tag color="gold">{t("eventSource")}</Tag>;
          if (src === "free-update") return <Tag color="purple">{t("freeUpdate")}</Tag>;
          return <Tag color="default">{t("baseGame")}</Tag>;
        },
      },
    ],
    [categoryFilters, getItemCategoryDisplayName, t],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input.Search
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          className="max-w-md"
        />
        <div className="text-sm text-gray-500">
          {t("totalCount")}: {filteredData.length} {t("itemsUnit")}
        </div>
      </div>
      <Table<Item>
        {...TableCommonProps}
        rowKey={(row) => row.slug || row.hash || String(row.id)}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["20", "50", "100", "200"],
          showTotal: (total, range) =>
            locale === "ko" ? `${total}개 중 ${range[0]}-${range[1]}` : `${range[0]}-${range[1]} / ${total}`,
        }}
      />
    </div>
  );
};
