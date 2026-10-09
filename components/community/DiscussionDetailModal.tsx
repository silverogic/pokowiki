"use client";

import {
  CommentOutlined,
  EditOutlined,
  ExportOutlined,
  HeartOutlined,
  KeyOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Modal, Skeleton, Tag, message } from "antd";
import { FC, useCallback, useEffect, useState } from "react";

import { GitHubAuthModal } from "@/components/site/auth";
import { IGitHubDiscussion, IGitHubDiscussionComment } from "@/types";
import { IUpdatedDiscussionResult, addDiscussionCommentGraphQL, useGitHubAuth, useI18n } from "@/utils";

import { EditDiscussionModal } from "./EditDiscussionModal";
import { COMMUNITY_CATEGORIES } from "./constants";

interface IDiscussionDetailModalProps {
  discussion: IGitHubDiscussion | null;
  open: boolean;
  onClose: () => void;
  onDiscussionUpdated?: (updated: IGitHubDiscussion) => void;
  repo?: string;
  repoId?: string;
}

export const DiscussionDetailModal: FC<IDiscussionDetailModalProps> = ({
  discussion,
  open,
  onClose,
  onDiscussionUpdated,
  repo = "silverogic/pokowiki",
}) => {
  const { t, locale } = useI18n();
  const { user, token } = useGitHubAuth();

  const [currentDiscussion, setCurrentDiscussion] = useState<IGitHubDiscussion | null>(discussion);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    setCurrentDiscussion(discussion);
  }, [discussion]);

  const [comments, setComments] = useState<IGitHubDiscussionComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // In-site comment form state
  const [commentBody, setCommentBody] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!discussion) return;
    setLoadingComments(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/discussions/${discussion.number}/comments`, {
        headers: { "User-Agent": "pokowiki-community" },
      });
      if (!res.ok) {
        setComments([]);
      } else {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }, [discussion, repo]);

  useEffect(() => {
    if (open && discussion) {
      fetchComments();
      setCommentBody("");
    } else {
      setComments([]);
    }
  }, [open, discussion, fetchComments]);

  const handlePostComment = async () => {
    if (!token || !commentBody.trim() || !discussion) return;
    setSubmittingComment(true);
    try {
      const [owner, name] = repo.split("/");
      await addDiscussionCommentGraphQL({
        owner: owner || "silverogic",
        repo: name || "pokowiki",
        discussionNumber: discussion.number,
        body: commentBody.trim(),
        token,
      });

      message.success(t("commentSuccess"));
      setCommentBody("");
      await fetchComments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      message.error(msg || "Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const activeDiscussion = currentDiscussion || discussion;
  if (!activeDiscussion) return null;

  const isAuthorOrAdmin = Boolean(
    user &&
    (user.login.toLowerCase() === activeDiscussion.user?.login?.toLowerCase() ||
      user.login.toLowerCase() === "silverogic"),
  );

  const handleDiscussionUpdated = (updated: IUpdatedDiscussionResult) => {
    if (!activeDiscussion) return;
    const matchedCategory =
      COMMUNITY_CATEGORIES.find((c) => c.slug === updated.category?.slug || c.name === updated.category?.name) ||
      activeDiscussion.category;

    const newDiscussion: IGitHubDiscussion = {
      ...activeDiscussion,
      title: updated.title,
      body: updated.body,
      updated_at: updated.updatedAt || new Date().toISOString(),
      category: {
        ...activeDiscussion.category,
        name: matchedCategory.name,
        slug: matchedCategory.slug,
      },
    };

    setCurrentDiscussion(newDiscussion);
    onDiscussionUpdated?.(newDiscussion);
  };

  const category =
    COMMUNITY_CATEGORIES.find(
      (c) => c.slug === activeDiscussion.category?.slug || c.name === activeDiscussion.category?.name,
    ) || COMMUNITY_CATEGORIES[0];

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
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={onClose}
          >
            {t("backToList")}
          </Button>,
        ]}
        width={780}
        centered
        destroyOnClose
        className="discussion-detail-modal"
        styles={{
          body: {
            maxHeight: "calc(80vh - 120px)",
            overflowY: "auto",
          },
        }}
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
              <span className="font-mono text-xs font-semibold text-gray-400">#{activeDiscussion.number}</span>
            </div>

            <div className="flex items-center gap-2">
              {isAuthorOrAdmin ? (
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => setEditModalOpen(true)}
                  className="text-xs font-medium"
                >
                  {t("editPost")}
                </Button>
              ) : null}
              <a
                href={activeDiscussion.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
                title="GitHub"
              >
                <ExportOutlined />
              </a>
            </div>
          </div>

          {/* Title */}
          <h2 className="my-1 text-xl font-bold text-gray-900 sm:text-2xl">{activeDiscussion.title}</h2>

          {/* Author & Date */}
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3 text-xs text-gray-500">
            <a
              href={activeDiscussion.user?.html_url || `https://github.com/${activeDiscussion.user?.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-2 text-gray-700"
            >
              <Avatar
                src={activeDiscussion.user?.avatar_url}
                icon={<UserOutlined />}
                size={24}
              />
              <span className="font-semibold">{activeDiscussion.user?.login || "anonymous"}</span>
            </a>
            <span>•</span>
            <span>{formatDate(activeDiscussion.created_at)}</span>
            {activeDiscussion.comments > 0 ? (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CommentOutlined />
                  <span>{activeDiscussion.comments}</span>
                </span>
              </>
            ) : null}
            {activeDiscussion.reactions && activeDiscussion.reactions.total_count > 0 ? (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-rose-500">
                  <HeartOutlined />
                  <span>{activeDiscussion.reactions.total_count}</span>
                </span>
              </>
            ) : null}
          </div>

          {/* Main Body */}
          <div className="min-h-[120px] rounded-xl bg-gray-50/70 p-4 leading-relaxed text-gray-800">
            <div className="font-sans text-sm break-words whitespace-pre-wrap sm:text-base">
              {activeDiscussion.body || "(No description provided.)"}
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="my-0 flex items-center gap-2 text-base font-bold text-gray-800">
                <CommentOutlined className="text-primary" />
                <span>{t("commentsCount").replace("{0}", String(comments.length || activeDiscussion.comments))}</span>
              </h3>
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

            {/* In-Site Native Comment Writing Form */}
            {token && user ? (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/80 p-3.5 sm:p-4">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={user.avatarUrl}
                      size={22}
                    />
                    <span className="font-semibold text-gray-800">@{user.login}</span>
                    <span className="text-[11px] font-medium text-green-600">✓ {t("activePostModeDirect")}</span>
                  </div>
                </div>
                <Input.TextArea
                  rows={3}
                  placeholder={t("commentPlaceholder")}
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  disabled={submittingComment}
                  className="mb-2.5 text-sm"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Markdown 지원</span>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    loading={submittingComment}
                    disabled={!commentBody.trim()}
                    onClick={handlePostComment}
                  >
                    {t("commentSubmit")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-xs text-gray-600 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="font-medium text-gray-800">💬 {t("commentTokenHint")}</div>
                  <div className="text-[11px] text-gray-400">
                    토큰 연결 시 창 전환 없이 이 모달에서 바로 댓글을 등록할 수 있습니다.
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="primary"
                    icon={<KeyOutlined />}
                    size="small"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    {t("connect")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <EditDiscussionModal
        discussion={activeDiscussion}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleDiscussionUpdated}
        repo={repo}
      />

      <GitHubAuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
