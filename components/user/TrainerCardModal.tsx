"use client";

import {
  CheckCircleOutlined,
  CloudSyncOutlined,
  ExportOutlined,
  LockOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Modal, Progress, Tag } from "antd";
import React, { FC, useState } from "react";

import { GitHubAuthModal } from "@/components/site/auth/GitHubAuthModal";
import { BADGE_DEFINITIONS, TranslationKey, useGitHubAuth, useI18n, usePokopiaUser } from "@/utils";

interface ITrainerCardModalProps {
  open: boolean;
  onClose: () => void;
}

export const TrainerCardModal: FC<ITrainerCardModalProps> = ({ open, onClose }) => {
  const { user } = useGitHubAuth();
  const { caughtSet, collectedSet, levelInfo, badges, syncStatus, gistUrl, manualSync } = usePokopiaUser();
  const { t } = useI18n();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [syncingManual, setSyncingManual] = useState(false);

  const unlockedBadgeMap = new Map(badges.map((b) => [b.id, b]));

  const handleManualSync = async () => {
    setSyncingManual(true);
    try {
      await manualSync();
    } finally {
      setSyncingManual(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={580}
        centered
        className="trainer-card-modal"
        destroyOnHidden
      >
        <div className="space-y-6 pt-2">
          {/* Trainer Profile Card Header */}
          <div className="via-primary-dark relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Avatar
                  src={user?.avatarUrl}
                  size={58}
                  className="border-2 border-white/80 shadow-sm"
                >
                  {user?.login?.[0]?.toUpperCase() || "P"}
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{user?.name || user?.login || t("trainerGuest")}</span>
                    <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-extrabold text-purple-950 shadow-xs">
                      Lv.{levelInfo.level}
                    </span>
                  </div>
                  <div className="text-xs text-purple-200">
                    {user?.login ? `@${user.login}` : t("trainerGuestDesc")}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black tracking-tight text-yellow-300">
                  {levelInfo.exp} <span className="text-xs font-semibold text-purple-200">EXP</span>
                </div>
                <div className="text-[11px] text-purple-200">
                  {t("nextLevelExp", { count: levelInfo.expNeeded - levelInfo.expProgress })}
                </div>
              </div>
            </div>

            {/* EXP Progress bar */}
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[11px] text-purple-200">
                <span>{t("trainerExpProgress")}</span>
                <span>{levelInfo.progressPercent}%</span>
              </div>
              <Progress
                percent={levelInfo.progressPercent}
                showInfo={false}
                strokeColor={{
                  "0%": "#fde047",
                  "100%": "#a855f7",
                }}
                trailColor="rgba(255,255,255,0.2)"
                size={["100%", 8]}
              />
            </div>
          </div>

          {/* Quick Collection Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              <div className="text-xs text-gray-500">{t("caughtPokemonCount")}</div>
              <div className="mt-1 text-lg font-bold text-gray-800">
                {caughtSet.size} <span className="text-xs font-normal text-gray-400">/ 365</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              <div className="text-xs text-gray-500">{t("collectedItemCount")}</div>
              <div className="mt-1 text-lg font-bold text-gray-800">
                {collectedSet.size} <span className="text-xs font-normal text-gray-400">{t("itemsUnit")}</span>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              <div className="text-xs text-gray-500">{t("badgesCount")}</div>
              <div className="mt-1 text-lg font-bold text-purple-700">
                {badges.length} <span className="text-xs font-normal text-gray-400">/ {BADGE_DEFINITIONS.length}</span>
              </div>
            </div>
          </div>

          {/* Cloud Sync Status Banner */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {syncStatus === "synced" ? (
                  <Tag
                    color="success"
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium"
                  >
                    <CheckCircleOutlined />
                    <span>{t("syncStatusSynced")}</span>
                  </Tag>
                ) : syncStatus === "syncing" ? (
                  <Tag
                    color="processing"
                    className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium"
                  >
                    <CloudSyncOutlined spin />
                    <span>{t("syncStatusSyncing")}</span>
                  </Tag>
                ) : syncStatus === "error" ? (
                  <Tag
                    color="error"
                    className="px-2 py-0.5 text-xs font-medium"
                  >
                    {t("syncStatusError")}
                  </Tag>
                ) : (
                  <Tag
                    color="default"
                    className="px-2 py-0.5 text-xs font-medium"
                  >
                    {t("syncStatusOffline")}
                  </Tag>
                )}

                <span className="text-xs text-gray-500">
                  {syncStatus === "synced"
                    ? t("syncDescSynced")
                    : syncStatus === "offline"
                      ? t("syncDescOffline")
                      : syncStatus === "error"
                        ? t("syncDescError")
                        : t("syncDescProgress")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {user?.token ? (
                  <>
                    <Button
                      size="small"
                      icon={<ReloadOutlined spin={syncingManual} />}
                      onClick={handleManualSync}
                      disabled={syncingManual}
                    >
                      {t("manualSyncBtn")}
                    </Button>
                    {gistUrl ? (
                      <a
                        href={gistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                      >
                        <span>{t("viewGistLink")}</span>
                        <ExportOutlined className="text-[10px]" />
                      </a>
                    ) : null}
                  </>
                ) : (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setAuthModalOpen(true)}
                  >
                    {t("connectGitHubSyncBtn")}
                  </Button>
                )}
              </div>
            </div>

            {/* Error Guidance Box */}
            {syncStatus === "error" ? (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none">⚠️</span>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-red-900">
                      {t("gistScopeRequiredTitle")}
                    </div>
                    <p className="m-0 leading-relaxed text-red-700">
                      {t("gistScopeRequiredDesc")}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1.5">
                      <Button
                        size="small"
                        type="primary"
                        danger
                        href="https://github.com/settings/tokens/new?scopes=gist,public_repo&description=pokowiki-sync"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon={<ExportOutlined />}
                      >
                        {t("generateGistTokenBtn")}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setAuthModalOpen(true)}
                      >
                        {t("reconnectTokenBtn")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Badges Gallery */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="my-0 flex items-center gap-1.5 text-sm font-bold text-gray-800">
                <TrophyOutlined className="text-yellow-500" />
                <span>{t("trainerBadgesTitle")}</span>
              </h3>
              <span className="text-xs text-gray-400">
                {t("badgesUnlockedRatio", { unlocked: badges.length, total: BADGE_DEFINITIONS.length })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2">
              {BADGE_DEFINITIONS.map((def) => {
                const unlocked = unlockedBadgeMap.get(def.id);
                return (
                  <div
                    key={def.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
                      unlocked
                        ? "border-yellow-200 bg-gradient-to-br from-yellow-50/60 to-white shadow-2xs"
                        : "border-gray-100 bg-gray-50/50 opacity-60"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-xs">
                      {unlocked ? def.icon : <LockOutlined className="text-sm text-gray-400" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`truncate text-xs font-bold ${unlocked ? "text-gray-900" : "text-gray-500"}`}>
                          {t(def.nameKey as TranslationKey)}
                        </span>
                        {unlocked ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> : null}
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-gray-500">
                        {t(def.descKey as TranslationKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      <GitHubAuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
