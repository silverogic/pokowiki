"use client";

import {
  CheckCircleOutlined,
  CommentOutlined,
  DownOutlined,
  ExportOutlined,
  GithubOutlined,
  KeyOutlined,
  LogoutOutlined,
  TrophyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { FC, useState } from "react";

import { TrainerCardModal } from "@/components/user";
import { useGitHubAuth, useI18n, usePokopiaUser } from "@/utils";

import { GitHubAuthModal } from "./GitHubAuthModal";

interface IGitHubAuthWidgetProps {
  size?: "small" | "middle";
  className?: string;
}

export const GitHubAuthWidget: FC<IGitHubAuthWidgetProps> = ({ size = "middle", className = "" }) => {
  const { user, logout } = useGitHubAuth();
  const { levelInfo, syncStatus } = usePokopiaUser();
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);

  if (!user) {
    return (
      <>
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <Button
            type="text"
            size="small"
            icon={<TrophyOutlined className="text-lg text-yellow-500" />}
            onClick={() => setTrainerModalOpen(true)}
            aria-label={t("myTrainerCard")}
            title={t("myTrainerCard")}
          />
          {size === "small" ? (
            <Button
              type="text"
              size="small"
              icon={<GithubOutlined className="text-xl" />}
              onClick={() => setModalOpen(true)}
              aria-label={t("githubLogin")}
            />
          ) : (
            <Button
              type="default"
              icon={<GithubOutlined />}
              onClick={() => setModalOpen(true)}
              className="flex items-center rounded-lg text-xs font-medium sm:text-sm"
            >
              <span>{t("githubLogin")}</span>
            </Button>
          )}
        </div>

        <GitHubAuthModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
        <TrainerCardModal
          open={trainerModalOpen}
          onClose={() => setTrainerModalOpen(false)}
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
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{user.name || user.login}</span>
            <span className="bg-primary/20 text-primary-dark rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              Lv.{levelInfo.level}
            </span>
          </div>
          <div className="text-xs text-gray-400">@{user.login}</div>
          {user.token ? (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-green-600">
              <CheckCircleOutlined />
              <span>{syncStatus === "synced" ? t("syncDescSynced") : t("activePostModeDirect")}</span>
            </div>
          ) : (
            <div className="mt-1 text-[11px] text-gray-400">
              <span>(읽기 모드)</span>
            </div>
          )}
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "trainer-card",
      icon: <TrophyOutlined className="text-yellow-500" />,
      label: (
        <div className="flex items-center justify-between font-semibold text-gray-800">
          <span>{t("myTrainerCard")}</span>
          <span className="py-0.2 rounded-full bg-yellow-400 px-1.5 text-[10px] font-black text-purple-950">
            Lv.{levelInfo.level}
          </span>
        </div>
      ),
      onClick: () => setTrainerModalOpen(true),
    },
    ...(!user.token
      ? [
          {
            key: "connect-token",
            icon: <KeyOutlined className="text-blue-500" />,
            label: <span className="text-xs font-medium text-blue-600">{t("githubTokenConnectTitle")}</span>,
            onClick: () => setModalOpen(true),
          },
        ]
      : []),
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
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="h-7 w-7 rounded-full border border-gray-200 object-cover shadow-xs sm:h-8 sm:w-8"
            />
            <span className="bg-primary-dark absolute -right-1 -bottom-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white ring-1 ring-white">
              {levelInfo.level}
            </span>
          </div>
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

      <GitHubAuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <TrainerCardModal
        open={trainerModalOpen}
        onClose={() => setTrainerModalOpen(false)}
      />
    </div>
  );
};
