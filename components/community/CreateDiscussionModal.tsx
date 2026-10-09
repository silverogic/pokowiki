"use client";

import { EditOutlined, GithubOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Modal, Select, message } from "antd";
import { FC, useEffect, useState } from "react";

import { useI18n } from "@/utils";

import { COMMUNITY_CATEGORIES } from "./constants";

interface ICreateDiscussionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultCategoryKey?: string;
  repo?: string;
}

export const CreateDiscussionModal: FC<ICreateDiscussionModalProps> = ({
  open,
  onClose,
  onSuccess,
  defaultCategoryKey = "general",
  repo = "silverogic/pokowiki",
}) => {
  const { t } = useI18n();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        category: defaultCategoryKey,
        title: "",
        body: "",
      });
    }
  }, [open, defaultCategoryKey, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const targetCategory = COMMUNITY_CATEGORIES.find((c) => c.key === values.category) || COMMUNITY_CATEGORIES[0];

      const url = `https://github.com/${repo}/discussions/new?category=${encodeURIComponent(
        targetCategory.slug,
      )}&title=${encodeURIComponent(values.title.trim())}&body=${encodeURIComponent(values.body.trim())}`;

      window.open(url, "_blank", "noopener,noreferrer");

      message.success(t("writeModalSuccess"), 6);

      setSubmitting(false);
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch {
      setSubmitting(false);
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
        >
          {t("none") === "None" ? "Cancel" : "취소"}
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<GithubOutlined />}
          loading={submitting}
          onClick={handleSubmit}
        >
          {t("writeModalSubmit")}
        </Button>,
      ]}
      width={680}
      centered
      destroyOnClose
    >
      <div className="py-2">
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          message={t("writeModalNotice")}
          className="mb-4 rounded-lg text-xs leading-relaxed sm:text-sm"
        />

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
