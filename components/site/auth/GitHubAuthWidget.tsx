"use client";

import {
  CommentOutlined,
  DownOutlined,
  ExportOutlined,
  GithubOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { FC, useState } from "react";

import { useGitHubAuth, useI18n } from "@/utils";

import { GitHubAuthModal } from "./GitHubAuthModal";

interface IGitHubAuthWidgetProps {
  size?: "small" | "middle";
  className?: string;
}

export const GitHubAuthWidget: FC<IGitHubAuthWidgetProps> = ({ size = "middle", className = "" }) => {
  const { user, logout } = useGitHubAuth();
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);

  if (!user) {
    return (
      <>
        {size === "small" ? (
          <Button
            type="text"
            size="small"
            icon={<GithubOutlined className="text-xl" />}
            onClick={() => setModalOpen(true)}
            aria-label={t("githubLogin")}
            className={className}
          />
        ) : (
          <Button
            type="default"
            icon={<GithubOutlined />}
            onClick={() => setModalOpen(true)}
            className={`flex items-center rounded-lg text-xs font-medium sm:text-sm ${className}`}
          >
            <span>{t("githubLogin")}</span>
          </Button>
        )}

        <GitHubAuthModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    );
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "user-header",
      disabled: true,
      label: (
        <div className="cursor-default px-1 py-1 text-gray-800">
          <div className="text-sm font-semibold">{user.name || user.login}</div>
          <div className="text-xs text-gray-400">@{user.login}</div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <a
          href={user.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between"
        >
          <span>{t("githubMyProfile")}</span>
          <ExportOutlined className="ml-2 text-xs text-gray-400" />
        </a>
      ),
    },
    {
      key: "discussions",
      icon: <CommentOutlined />,
      label: (
        <a
          href={`https://github.com/silverogic/pokowiki/discussions?discussions_q=author%3A${encodeURIComponent(user.login)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between"
        >
          <span>{t("githubMyDiscussions")}</span>
          <ExportOutlined className="ml-2 text-xs text-gray-400" />
        </a>
      ),
    },
    {
      key: "community",
      icon: <GithubOutlined />,
      label: <Link href="/community">{t("community")}</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: t("githubLogout"),
      onClick: logout,
    },
  ];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <button
          className="flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent p-1 transition-colors hover:bg-gray-100"
          aria-label={user.login}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.login}
            className="h-7 w-7 rounded-full border border-gray-200 object-cover shadow-xs sm:h-8 sm:w-8"
          />
          {size !== "small" && (
            <>
              <span className="hidden max-w-[90px] truncate text-xs font-medium text-gray-700 lg:inline-block">
                {user.name || user.login}
              </span>
              <DownOutlined className="hidden text-[10px] text-gray-400 sm:inline-block" />
            </>
          )}
        </button>
      </Dropdown>
    </div>
  );
};
