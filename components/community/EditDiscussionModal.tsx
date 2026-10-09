"use client";

import { CheckCircleOutlined, EditOutlined, KeyOutlined, SaveOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Modal, Select, message } from "antd";
import { FC, useEffect, useState } from "react";

import { IGitHubDiscussion } from "@/types";
import { IUpdatedDiscussionResult, updateDiscussionGraphQL, useGitHubAuth, useI18n } from "@/utils";

import { COMMUNITY_CATEGORIES, DEFAULT_REPO } from "./constants";

export interface IEditDiscussionModalProps {
  discussion: IGitHubDiscussion | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: (updated: IUpdatedDiscussionResult) => void;
  repo?: string;
}

export const EditDiscussionModal: FC<IEditDiscussionModalProps> = ({
  discussion,
  open,
  onClose,
  onSuccess,
  repo = DEFAULT_REPO,
}) => {
  const { t } = useI18n();
  const { user, token, loginWithToken } = useGitHubAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Quick token input state for unauthenticated users
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [connectingToken, setConnectingToken] = useState(false);

  useEffect(() => {
    if (open && discussion) {
      const matchedCat =
        COMMUNITY_CATEGORIES.find(
          (c) => c.slug === discussion.category?.slug || c.name === discussion.category?.name,
        ) || COMMUNITY_CATEGORIES[0];

      form.setFieldsValue({
        category: matchedCat.key,
        title: discussion.title,
        body: discussion.body || "",
      });
      setShowTokenInput(false);
      setTokenInput("");
    }
  }, [open, discussion, form]);

  if (!discussion) return null;

  const isAuthorOrAdmin = Boolean(
    user &&
    (user.login.toLowerCase() === discussion.user?.login?.toLowerCase() || user.login.toLowerCase() === "silverogic"),
  );

  const handleConnectToken = async () => {
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    setConnectingToken(true);
    try {
      const loggedInUser = await loginWithToken(trimmed);
      if (loggedInUser) {
        message.success(t("githubTokenSuccess"));
        setTokenInput("");
        setShowTokenInput(false);
      } else {
        message.error(t("invalidToken"));
      }
    } catch {
      message.error(t("invalidToken"));
    } finally {
      setConnectingToken(false);
    }
  };

  const handleDirectSubmit = async () => {
    if (!token || !isAuthorOrAdmin) return;
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const targetCategory = COMMUNITY_CATEGORIES.find((c) => c.key === values.category) || COMMUNITY_CATEGORIES[0];
      const [owner, repoName] = repo.split("/");

      const updated = await updateDiscussionGraphQL({
        owner: owner || "silverogic",
        repo: repoName || "pokowiki",
        discussionNumber: discussion.number,
        discussionId: discussion.node_id,
        categoryId: targetCategory.id,
        title: values.title.trim(),
        body: values.body.trim(),
        token,
      });

      message.success(t("editModalSuccess"));
      onSuccess?.(updated);
      onClose();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      message.error(errMsg || "Failed to update discussion");
    } finally {
      setSubmitting(false);
    }
  };

  // Only allow user-creatable categories (exclude Announcements for standard posts)
  const selectableCategories =
    user?.login?.toLowerCase() === "silverogic"
      ? COMMUNITY_CATEGORIES
      : COMMUNITY_CATEGORIES.filter((c) => c.key !== "announcements");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2 text-base font-bold sm:text-lg">
          <EditOutlined className="text-primary" />
          <span>{t("editModalTitle")}</span>
          <span className="font-mono text-xs font-normal text-gray-400">#{discussion.number}</span>
        </div>
      }
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          disabled={submitting}
        >
          {t("none") === "None" ? "Cancel" : "취소"}
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SaveOutlined />}
          loading={submitting}
          disabled={!token || !isAuthorOrAdmin}
          onClick={handleDirectSubmit}
        >
          {t("editModalSubmit")}
        </Button>,
      ]}
      width={700}
      centered
      destroyOnClose
    >
      <div className="py-2">
        {/* Status / Permission Banner */}
        {token && user ? (
          isAuthorOrAdmin ? (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50/90 px-3.5 py-2.5 text-xs text-green-900 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={user.avatarUrl}
                  size={26}
                  className="border border-green-300"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircleOutlined className="text-green-600" />
                    <span>@{user.login}</span>
                    <span className="text-[11px] font-normal text-green-700">({t("activePostModeDirect")})</span>
                  </div>
                  <div className="text-[11px] text-green-700">{t("editModalNotice")}</div>
                </div>
              </div>
            </div>
          ) : (
            <Alert
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              message={<span className="text-xs">{t("editModalPermissionWarning")}</span>}
              description={
                <div className="mt-1 text-xs text-gray-500">
                  <span>작성자: </span>
                  <span className="font-semibold text-gray-700">@{discussion.user?.login}</span>
                  <span className="ml-2">/ 현재 로그인: </span>
                  <span className="font-semibold text-gray-700">@{user.login}</span>
                </div>
              }
              className="mb-4 rounded-xl"
            />
          )
        ) : (
          <div className="mb-4 space-y-2">
            <Alert
              type="info"
              showIcon
              message={
                <div className="space-y-1 text-xs leading-relaxed">
                  <div>{t("editModalPermissionWarning")}</div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-semibold text-blue-700">💡 {t("writeModalTokenHint")}</span>
                    <Button
                      size="small"
                      type="link"
                      icon={<KeyOutlined />}
                      className="h-auto p-0 text-xs font-semibold"
                      onClick={() => setShowTokenInput((prev) => !prev)}
                    >
                      {showTokenInput ? "접기" : "토큰 입력하기"}
                    </Button>
                  </div>
                </div>
              }
              className="rounded-xl text-xs"
            />

            {showTokenInput ? (
              <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-xs text-gray-700">
                <div className="font-semibold text-gray-800">{t("githubTokenConnectTitle")}</div>
                <p className="text-[11px] text-gray-600">{t("githubTokenConnectDesc")}</p>
                <div className="flex gap-2">
                  <Input.Password
                    size="middle"
                    placeholder={t("githubTokenPlaceholder")}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onPressEnter={handleConnectToken}
                    disabled={connectingToken}
                    prefix={<KeyOutlined className="text-gray-400" />}
                  />
                  <Button
                    type="primary"
                    onClick={handleConnectToken}
                    loading={connectingToken}
                    disabled={!tokenInput.trim()}
                  >
                    {t("connect")}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          disabled={!token || !isAuthorOrAdmin}
        >
          <Form.Item
            name="category"
            label={<span className="font-medium text-gray-700">{t("writeModalCategory")}</span>}
            rules={[{ required: true }]}
          >
            <Select
              size="large"
              options={selectableCategories.map((c) => ({
                value: c.key,
                label: (
                  <span className="flex items-center gap-2">
                    <span>{c.emoji}</span>
                    <span className="font-medium">{t(c.labelKey)}</span>
                    <span className="text-xs text-gray-400">({t(c.descKey)})</span>
                  </span>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label={<span className="font-medium text-gray-700">{t("postTitle")}</span>}
            rules={[
              {
                required: true,
                message: t("writeModalTitlePlaceholder"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t("writeModalTitlePlaceholder")}
              maxLength={120}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="body"
            label={<span className="font-medium text-gray-700">{t("writeModalBodyPlaceholder")}</span>}
            rules={[
              {
                required: true,
                message: t("writeModalBodyPlaceholder"),
              },
            ]}
          >
            <Input.TextArea
              rows={8}
              placeholder={t("writeModalBodyPlaceholder")}
              className="font-mono text-sm"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
