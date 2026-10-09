"use client";

import { CommentOutlined, ExportOutlined, HeartOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Modal, Skeleton, Tag } from "antd";
import { FC, useEffect, useState } from "react";

import { Giscus } from "@/components/site/Giscus";
import { IGitHubDiscussion, IGitHubDiscussionComment } from "@/types";
import { useI18n } from "@/utils";

import { COMMUNITY_CATEGORIES } from "./constants";

interface IDiscussionDetailModalProps {
  discussion: IGitHubDiscussion | null;
  open: boolean;
  onClose: () => void;
  repo?: string;
  repoId?: string;
}

export const DiscussionDetailModal: FC<IDiscussionDetailModalProps> = ({
  discussion,
  open,
  onClose,
  repo = "silverogic/pokowiki",
  repoId = "R_kgDOU5hVEA",
}) => {
  const { t, locale } = useI18n();
  const [comments, setComments] = useState<IGitHubDiscussionComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showGiscusInline, setShowGiscusInline] = useState(true);

  useEffect(() => {
    if (!open || !discussion) {
      setComments([]);
      return;
    }

    let isMounted = true;
    setLoadingComments(true);

    fetch(`https://api.github.com/repos/${repo}/discussions/${discussion.number}/comments`, {
      headers: { "User-Agent": "pokowiki-community" },
    })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data: IGitHubDiscussionComment[]) => {
        if (isMounted) {
          setComments(Array.isArray(data) ? data : []);
          setLoadingComments(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setComments([]);
          setLoadingComments(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, discussion, repo]);

  if (!discussion) return null;

  const category =
    COMMUNITY_CATEGORIES.find((c) => c.slug === discussion.category?.slug || c.name === discussion.category?.name) ||
    COMMUNITY_CATEGORIES[0];

  const giscusLang = locale === "zh" ? "zh-CN" : locale === "ko" ? "ko" : locale === "ja" ? "ja" : "en";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
        >
          {t("backToList")}
        </Button>,
        <Button
          key="github"
          type="primary"
          icon={<ExportOutlined />}
          href={discussion.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("viewOnGitHub")}
        </Button>,
      ]}
      width={780}
      centered
      destroyOnClose
      className="discussion-detail-modal"
    >
      <div className="space-y-4 pt-2">
        {/* Category & Discussion Number */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Tag
              color="blue"
              className="px-2.5 py-0.5 text-xs font-medium"
            >
              <span className="mr-1">{category.emoji}</span>
              {t(category.labelKey)}
            </Tag>
            <span className="font-mono text-xs font-semibold text-gray-400">#{discussion.number}</span>
          </div>

          <a
            href={discussion.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-1 text-xs hover:underline"
          >
            <span>{t("viewOnGitHub")}</span>
            <ExportOutlined />
          </a>
        </div>

        {/* Title */}
        <h2 className="my-1 text-xl font-bold text-gray-900 sm:text-2xl">{discussion.title}</h2>

        {/* Author & Date */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-3 text-xs text-gray-500">
          <a
            href={discussion.user?.html_url || `https://github.com/${discussion.user?.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary flex items-center gap-2 text-gray-700"
          >
            <Avatar
              src={discussion.user?.avatar_url}
              icon={<UserOutlined />}
              size={24}
            />
            <span className="font-semibold">{discussion.user?.login || "anonymous"}</span>
          </a>
          <span>•</span>
          <span>{formatDate(discussion.created_at)}</span>
          {discussion.comments > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CommentOutlined />
                <span>{discussion.comments}</span>
              </span>
            </>
          )}
          {discussion.reactions && discussion.reactions.total_count > 0 ? (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-rose-500">
                <HeartOutlined />
                <span>{discussion.reactions.total_count}</span>
              </span>
            </>
          ) : null}
        </div>

        {/* Main Body */}
        <div className="min-h-[120px] rounded-xl bg-gray-50/70 p-4 leading-relaxed text-gray-800">
          <div className="font-sans text-sm break-words whitespace-pre-wrap sm:text-base">
            {discussion.body || "(No description provided.)"}
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="my-0 flex items-center gap-2 text-base font-bold text-gray-800">
              <CommentOutlined className="text-primary" />
              <span>{t("commentsCount").replace("{0}", String(comments.length || discussion.comments))}</span>
            </h3>

            <Button
              size="small"
              icon={<ExportOutlined />}
              href={`${discussion.html_url}#new_comment_field`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("writeCommentBtn")}
            </Button>
          </div>

          {loadingComments ? (
            <div className="space-y-3 py-4">
              <Skeleton
                avatar
                active
                paragraph={{ rows: 2 }}
              />
              <Skeleton
                avatar
                active
                paragraph={{ rows: 2 }}
              />
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-xs transition-colors hover:border-gray-200"
                >
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <a
                      href={comment.user?.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary flex items-center gap-2 font-medium text-gray-700"
                    >
                      <Avatar
                        src={comment.user?.avatar_url}
                        icon={<UserOutlined />}
                        size={20}
                      />
                      <span>{comment.user?.login}</span>
                    </a>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <div className="text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-800">
                    {comment.body}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
              {t("noCommentsYet")}
            </div>
          )}

          {/* Giscus for inline replying by discussion number */}
          <Divider className="my-5" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">💬 {t("communityWidgetTitle")}</span>
              <Button
                size="small"
                type="link"
                onClick={() => setShowGiscusInline(!showGiscusInline)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                {showGiscusInline ? "댓글창 접기" : "댓글창 펼치기"}
              </Button>
            </div>

            {showGiscusInline ? (
              <div className="giscus-comment-box min-h-[280px] rounded-xl bg-gray-50/50 p-3">
                <Giscus
                  id={`giscus-disc-${discussion.number}`}
                  repo={repo as `${string}/${string}`}
                  repoId={repoId}
                  category={category.name}
                  categoryId={category.id}
                  mapping="number"
                  term={String(discussion.number)}
                  reactionsEnabled="1"
                  emitMetadata="0"
                  inputPosition="bottom"
                  theme="preferred_color_scheme"
                  lang={giscusLang}
                  loading="lazy"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};
