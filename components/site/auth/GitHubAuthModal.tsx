"use client";

import { CommentOutlined, GithubOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { useGitHubAuth, useI18n } from "@/utils";

interface IGitHubAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const GitHubAuthModal: FC<IGitHubAuthModalProps> = ({ open, onClose }) => {
  const { t } = useI18n();
  const { fetchUserById } = useGitHubAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    const user = await fetchUserById(username);
    setLoading(false);
    if (user) {
      setUsername("");
      onClose();
    } else {
      setError(t("userNotFound"));
    }
  };

  const handleGoToCommunity = () => {
    onClose();
    router.push("/community");
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={
        <div className="flex items-center gap-2 text-lg">
          <GithubOutlined className="text-xl" />
          <span>{t("githubLoginModalTitle")}</span>
        </div>
      }
      className="github-auth-modal"
    >
      <div className="space-y-5 pt-2">
        <p className="text-sm leading-relaxed text-gray-600">{t("githubLoginModalDesc")}</p>

        {/* Option 1: Community Login */}
        <div className="border-primary/20 bg-primary/5 space-y-2 rounded-xl border p-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <CommentOutlined className="text-primary" />
            <span>{t("githubLoginViaCommunity")}</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-600">{t("githubLoginViaCommunityDesc")}</p>
          <div className="pt-2">
            <Button
              type="primary"
              icon={<CommentOutlined />}
              onClick={handleGoToCommunity}
              block
            >
              {t("goToCommunity")}
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 uppercase">OR</span>
        </div>

        {/* Option 2: Connect by username */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <UserOutlined />
            <span>{t("githubConnectById")}</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-600">{t("githubConnectByIdDesc")}</p>
          <div className="flex gap-2">
            <Input
              prefix={<GithubOutlined className="text-gray-400" />}
              placeholder={t("githubUsernamePlaceholder")}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              onPressEnter={handleLookup}
              disabled={loading}
            />
            <Button
              type="default"
              onClick={handleLookup}
              loading={loading}
              disabled={!username.trim()}
            >
              {t("connect")}
            </Button>
          </div>
          {error ? (
            <Alert
              type="error"
              message={error}
              showIcon
              className="py-1 text-xs"
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
