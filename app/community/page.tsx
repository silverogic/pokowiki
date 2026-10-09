"use client";

import {
  CommentOutlined,
  EditOutlined,
  ExportOutlined,
  GithubOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Empty, Input, Table, TableColumnsType, Tabs, Tag } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import {
  COMMUNITY_CATEGORIES,
  CreateDiscussionModal,
  DiscussionDetailModal,
  ICategoryConfig,
} from "@/components/community";
import { IGitHubDiscussion } from "@/types";
import { useI18n } from "@/utils";

const CommunityPage: FC = () => {
  const { t, locale } = useI18n();
  const [activeKey, setActiveKey] = useState<string>("all");
  const [discussions, setDiscussions] = useState<IGitHubDiscussion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<IGitHubDiscussion | null>(null);

  const giscusRepo = (process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`) || "silverogic/pokowiki";
  const giscusRepoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOU5hVEA";

  useEffect(() => {
    document.title = `${t("communityTitle")} - ${t("siteTitle")}`;
  }, [t]);

  const fetchDiscussions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${giscusRepo}/discussions?per_page=100`, {
        headers: { "User-Agent": "pokowiki-community" },
      });
      if (!res.ok) {
        setDiscussions([]);
      } else {
        const data = await res.json();
        setDiscussions(Array.isArray(data) ? data : []);
      }
    } catch {
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  }, [giscusRepo]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const activeCategory = useMemo<ICategoryConfig | null>(() => {
    if (activeKey === "all") return null;
    return COMMUNITY_CATEGORIES.find((c) => c.key === activeKey) || null;
  }, [activeKey]);

  // Filtered discussions by active category and search query
  const filteredDiscussions = useMemo(
    () =>
      discussions.filter((item) => {
        // Category filter
        if (activeKey !== "all") {
          const itemCatSlug = item.category?.slug?.toLowerCase();
          const itemCatName = item.category?.name?.toLowerCase();
          const targetSlug = activeCategory?.slug?.toLowerCase();
          const targetName = activeCategory?.name?.toLowerCase();
          const matchesCategory = itemCatSlug === targetSlug || itemCatName === targetName;
          if (!matchesCategory) return false;
        }

        // Search keyword filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title?.toLowerCase().includes(q);
          const matchesAuthor = item.user?.login?.toLowerCase().includes(q);
          const matchesBody = item.body?.toLowerCase().includes(q);
          return matchesTitle || matchesAuthor || matchesBody;
        }

        return true;
      }),
    [discussions, activeKey, activeCategory, searchQuery],
  );

  const tabItems = [
    {
      key: "all",
      label: (
        <span className="flex items-center gap-1.5 text-sm font-medium sm:text-base">
          <span>🌟</span>
          <span>{t("allCategories")}</span>
        </span>
      ),
    },
    ...COMMUNITY_CATEGORIES.map((cat) => ({
      key: cat.key,
      label: (
        <span className="flex items-center gap-1.5 text-sm font-medium sm:text-base">
          <span>{cat.emoji}</span>
          <span>{t(cat.labelKey)}</span>
        </span>
      ),
    })),
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const columns: TableColumnsType<IGitHubDiscussion> = [
    {
      title: "#",
      dataIndex: "number",
      key: "number",
      width: 65,
      align: "center",
      render: (num: number) => <span className="font-mono text-xs text-gray-400">#{num}</span>,
    },
    {
      title: t("postCategory"),
      dataIndex: "category",
      key: "category",
      width: 140,
      render: (cat: IGitHubDiscussion["category"]) => {
        const matched =
          COMMUNITY_CATEGORIES.find((c) => c.slug === cat?.slug || c.name === cat?.name) || COMMUNITY_CATEGORIES[0];
        return (
          <Tag
            color="blue"
            className="px-2 py-0.5 text-xs font-medium"
          >
            <span className="mr-1">{matched.emoji}</span>
            {t(matched.labelKey)}
          </Tag>
        );
      },
    },
    {
      title: t("postTitle"),
      dataIndex: "title",
      key: "title",
      render: (title: string, record: IGitHubDiscussion) => (
        <div className="flex flex-col py-0.5">
          <button
            type="button"
            onClick={() => {
              setSelectedDiscussion(record);
              setDetailModalOpen(true);
            }}
            className="hover:text-primary cursor-pointer text-left font-semibold text-gray-800 transition-colors sm:text-base"
          >
            {title}
          </button>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400 sm:hidden">
            <span className="flex items-center gap-1">
              <Avatar
                src={record.user?.avatar_url}
                size={16}
                icon={<UserOutlined />}
              />
              <span>{record.user?.login}</span>
            </span>
            <span>•</span>
            <span>{formatDate(record.created_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <CommentOutlined />
              <span>{record.comments}</span>
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t("postAuthor"),
      dataIndex: "user",
      key: "author",
      width: 150,
      responsive: ["sm"],
      render: (user: IGitHubDiscussion["user"]) => (
        <a
          href={user?.html_url || `https://github.com/${user?.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary flex items-center gap-1.5 text-xs text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar
            src={user?.avatar_url}
            size={20}
            icon={<UserOutlined />}
          />
          <span className="truncate">{user?.login || "anonymous"}</span>
        </a>
      ),
    },
    {
      title: t("postComments"),
      dataIndex: "comments",
      key: "comments",
      width: 80,
      align: "center",
      responsive: ["sm"],
      render: (count: number) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
          <CommentOutlined />
          <span>{count}</span>
        </span>
      ),
    },
    {
      title: t("postDate"),
      dataIndex: "created_at",
      key: "date",
      width: 110,
      align: "center",
      responsive: ["md"],
      render: (date: string) => <span className="text-xs text-gray-500">{formatDate(date)}</span>,
    },
    {
      title: "",
      key: "actions",
      width: 48,
      align: "center",
      render: (_: unknown, record: IGitHubDiscussion) => (
        <a
          href={record.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary text-gray-400"
          title={t("viewOnGitHub")}
          onClick={(e) => e.stopPropagation()}
        >
          <ExportOutlined />
        </a>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl py-4 sm:py-6">
      {/* Header section */}
      <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <GithubOutlined className="text-3xl text-gray-800 sm:text-4xl" />
              <h1 className="my-0 text-2xl font-bold text-gray-900 sm:text-3xl">{t("communityTitle")}</h1>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{t("communityIntro")}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button
              type="primary"
              size="large"
              icon={<EditOutlined />}
              onClick={() => setCreateModalOpen(true)}
              className="font-medium shadow-xs"
            >
              {t("communityNewDiscussionBtn")}
            </Button>
            <Button
              size="large"
              icon={<ExportOutlined />}
              href={`https://github.com/${giscusRepo}/discussions`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("communityDiscussionsBtn")}
            </Button>
            <Button
              size="large"
              icon={<ReloadOutlined spin={loading} />}
              onClick={fetchDiscussions}
              aria-label={t("refreshBoard")}
            />
          </div>
        </div>
      </section>

      {/* Main Board Section */}
      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:p-6">
        <Tabs
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key);
            setSearchQuery("");
          }}
          items={tabItems}
          size="large"
          className="community-tabs"
        />

        {/* Category Description Banner */}
        {activeCategory ? (
          <div className="my-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-2.5 text-xs text-gray-600 sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">{activeCategory.emoji}</span>
              <span>{t(activeCategory.descKey)}</span>
            </div>
            <a
              href={`https://github.com/${giscusRepo}/discussions/categories/${activeCategory.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex shrink-0 items-center gap-1 text-xs hover:underline"
            >
              <span>GitHub Discussions</span>
              <ExportOutlined />
            </a>
          </div>
        ) : null}

        {/* Filter and Search Bar */}
        <div className="my-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-gray-500">
            {filteredDiscussions.length > 0 ? <span>총 {filteredDiscussions.length}개의 게시글</span> : null}
          </div>

          <div className="flex items-center gap-2">
            <Input
              allowClear
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder={t("postSearchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg"
            />
          </div>
        </div>

        {/* Post Table */}
        <Table<IGitHubDiscussion>
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={filteredDiscussions}
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: false,
            hideOnSinglePage: true,
          }}
          locale={{
            emptyText: (
              <div className="py-12 text-center">
                <Empty
                  description={
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-700">{t("postEmpty")}</p>
                      <p className="text-xs text-gray-400">{t("postEmptyDesc")}</p>
                    </div>
                  }
                >
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setCreateModalOpen(true)}
                    className="mt-2"
                  >
                    {t("communityNewDiscussionBtn")}
                  </Button>
                </Empty>
              </div>
            ),
          }}
          className="community-table"
        />
      </section>

      {/* Modals */}
      <CreateDiscussionModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchDiscussions}
        defaultCategoryKey={activeKey !== "all" ? activeKey : "general"}
        repo={giscusRepo}
        repoId={giscusRepoId}
      />

      <DiscussionDetailModal
        discussion={selectedDiscussion}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedDiscussion(null);
        }}
        repo={giscusRepo}
        repoId={giscusRepoId}
      />
    </div>
  );
};

export default CommunityPage;
