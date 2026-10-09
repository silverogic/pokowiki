"use client";

import {
  CheckCircleOutlined,
  EditOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Modal, Select, message } from "antd";
import { FC, useEffect, useState } from "react";

import { createDiscussionGraphQL, useGitHubAuth, useI18n } from "@/utils";

import { COMMUNITY_CATEGORIES, DEFAULT_REPO, DEFAULT_REPO_ID } from "./constants";

interface ICreateDiscussionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultCategoryKey?: string;
  repo?: string;
  repoId?: string;
}

export const CreateDiscussionModal: FC<ICreateDiscussionModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultCategoryKey = "general",
  repo = DEFAULT_REPO,
  repoId = DEFAULT_REPO_ID,
}) => {
  const { t } = useI18n();
  const { user, token, loginWithToken, logout } = useGitHubAuth();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Quick token input state for unauthenticated users
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [connectingToken, setConnectingToken] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        category: defaultCategoryKey,
        title: "",
        body: "",
      });
      setShowTokenInput(false);
      setTokenInput("");
    }
  }, [open, defaultCategoryKey, form]);

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

  // Direct In-Site GraphQL Submission (Zero window switch!)
  const handleDirectSubmit = async () => {
    if (!token) return;
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const targetCategory = COMMUNITY_CATEGORIES.find((c) => c.key === values.category) || COMMUNITY_CATEGORIES[0];

      await createDiscussionGraphQL({
        repositoryId: repoId,
        categoryId: targetCategory.id,
        title: values.title.trim(),
        body: values.body.trim(),
        token,
      });

      message.success(t("writeModalDirectSuccess"));
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      message.error(errMsg || "Failed to create discussion");
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback: Opens prefilled GitHub discussions page in a new window
  const handleFallbackSubmit = async () => {
    try {
      const values = await form.validateFields();
      const targetCategory = COMMUNITY_CATEGORIES.find((c) => c.key === values.category) || COMMUNITY_CATEGORIES[0];

      const url = `https://github.com/${repo}/discussions/new?category=${encodeURIComponent(
        targetCategory.slug,
      )}&title=${encodeURIComponent(values.title.trim())}&body=${encodeURIComponent(values.body.trim())}`;

      window.open(url, "_blank", "noopener,noreferrer");
      message.success(t("writeModalSuccess"), 6);

      form.resetFields();
      onSuccess?.();
      onClose();
    } catch {
      // Form validation failed
    }
  };

  // Only allow user-creatable categories (exclude Announcements for standard posts)
  const selectableCategories = COMMUNITY_CATEGORIES.filter((c) => c.key !== "announcements");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center gap-2 text-base font-bold sm:text-lg">
          <EditOutlined className="text-primary" />
          <span>{t("writeModalTitle")}</span>
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
        token ? (
          <Button
            key="direct-submit"
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={handleDirectSubmit}
          >
            {t("writeModalDirectSubmit")}
          </Button>
        ) : (
          <Button
            key="fallback-submit"
            type="primary"
            icon={<SendOutlined />}
            onClick={handleFallbackSubmit}
          >
            {t("writeModalSubmit")}
          </Button>
        ),
      ]}
      width={700}
      centered
      destroyOnClose
      styles={{
        body: {
          maxHeight: "calc(80vh - 120px)",
          overflowY: "auto",
        },
      }}
    >
      <div className="py-2">
        {/* Auth Status & Zero-switch Helper */}
        {token && user ? (
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
                <div className="text-[11px] text-green-700">{t("writeModalDirectNotice")}</div>
              </div>
            </div>
            <Button
              size="small"
              type="link"
              onClick={logout}
              className="px-1 text-xs text-gray-500 hover:text-red-500"
            >
              {t("changeAccount")}
            </Button>
          </div>
        ) : (
          <div className="mb-4 space-y-2">
            <Alert
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              message={
                <div className="space-y-1 text-xs leading-relaxed">
                  <div>{t("writeModalNotice")}</div>
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
                <div className="flex items-center justify-between text-[11px]">
                  <a
                    href="https://github.com/settings/tokens/new?scopes=public_repo&description=pokowiki-community"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    <span>{t("githubGenerateTokenHelper")}</span>
                    <ExportOutlined className="text-[10px]" />
                  </a>
                  <span className="text-gray-400">{t("githubTokenNotice")}</span>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
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
