"use client";

import { ExportOutlined, GithubOutlined, KeyOutlined, ThunderboltOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Modal, Tag, message } from "antd";
import { FC, useState } from "react";

import { useGitHubAuth, useI18n } from "@/utils";

interface IGitHubAuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const GitHubAuthModal: FC<IGitHubAuthModalProps> = ({ open, onClose }) => {
  const { t } = useI18n();
  const { fetchUserById, loginWithToken } = useGitHubAuth();

  // Token login state
  const [token, setToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Username lookup state
  const [username, setUsername] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleTokenLogin = async () => {
    const trimmed = token.trim();
    if (!trimmed) return;
    setTokenLoading(true);
    setTokenError(null);
    try {
      const user = await loginWithToken(trimmed);
      if (user) {
        message.success(t("githubTokenSuccess"));
        setToken("");
        onClose();
      } else {
        setTokenError(t("invalidToken"));
      }
    } catch {
      setTokenError(t("invalidToken"));
    } finally {
      setTokenLoading(false);
    }
  };

  const handleLookup = async () => {
    if (!username.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    const user = await fetchUserById(username);
    setLookupLoading(false);
    if (user) {
      setUsername("");
      onClose();
    } else {
      setLookupError(t("userNotFound"));
    }
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
      width={560}
    >
      <div className="space-y-4 pt-2">
        <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">{t("githubLoginModalDesc")}</p>

        {/* Option 1: Direct in-site posting token (Featured / Recommended) */}
        <div className="border-primary/20 bg-primary/5 space-y-2.5 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <KeyOutlined className="text-primary" />
              <span>{t("githubTokenConnectTitle")}</span>
            </div>
            <Tag
              color="blue"
              className="m-0 flex items-center gap-1 font-medium"
            >
              <ThunderboltOutlined />
              <span>0-Window Switch</span>
            </Tag>
          </div>
          <p className="text-xs leading-relaxed text-gray-600">{t("githubTokenConnectDesc")}</p>

          <div className="flex gap-2">
            <Input.Password
              prefix={<KeyOutlined className="text-gray-400" />}
              placeholder={t("githubTokenPlaceholder")}
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (tokenError) setTokenError(null);
              }}
              onPressEnter={handleTokenLogin}
              disabled={tokenLoading}
            />
            <Button
              type="primary"
              onClick={handleTokenLogin}
              loading={tokenLoading}
              disabled={!token.trim()}
            >
              {t("connect")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
            <a
              href="https://github.com/settings/tokens/new?scopes=public_repo&description=pokowiki-community"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 font-medium hover:underline"
            >
              <span>{t("githubGenerateTokenHelper")}</span>
              <ExportOutlined className="text-[10px]" />
            </a>
            <span className="text-gray-400">{t("githubTokenNotice")}</span>
          </div>

          {tokenError ? (
            <Alert
              type="error"
              message={tokenError}
              showIcon
              className="py-1 text-xs"
            />
          ) : null}
        </div>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 uppercase">OR</span>
        </div>

        {/* Option 2: Connect by username (Read-only profile) */}
        <div className="space-y-2.5 rounded-xl border border-gray-100 bg-gray-50 p-4">
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
                if (lookupError) setLookupError(null);
              }}
              onPressEnter={handleLookup}
              disabled={lookupLoading}
            />
            <Button
              type="default"
              onClick={handleLookup}
              loading={lookupLoading}
              disabled={!username.trim()}
            >
              {t("connect")}
            </Button>
          </div>
          {lookupError ? (
            <Alert
              type="error"
              message={lookupError}
              showIcon
              className="py-1 text-xs"
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
