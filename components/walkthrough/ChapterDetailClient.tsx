"use client";

import { FC, useEffect } from "react";

import { WalkthroughChapter } from "@/types";
import {
  Link,
  getChapterDescription,
  getChapterTitle,
  getSectionContent,
  getSectionTips,
  getSectionTitle,
  useI18n,
} from "@/utils";

interface IChapterDetailClientProps {
  chapter: WalkthroughChapter;
  prevChapter: WalkthroughChapter | null;
  nextChapter: WalkthroughChapter | null;
}

export const ChapterDetailClient: FC<IChapterDetailClientProps> = ({ chapter, prevChapter, nextChapter }) => {
  const { t, locale } = useI18n();

  const title = getChapterTitle(chapter, locale);
  const description = getChapterDescription(chapter, locale);

  useEffect(() => {
    document.title = `${title} - ${t("walkthrough")} - ${t("siteTitle")}`;
  }, [title, t]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/walkthrough"
          className="text-sm font-medium text-red-600 hover:underline"
        >
          {t("walkthroughBackToList")}
        </Link>
      </div>

      {/* Chapter Header */}
      <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-8 text-white shadow">
        <div className="mb-1 text-sm font-medium text-red-200">{t("chapterNumber", { count: chapter.order })}</div>
        <h1 className="mb-3 text-3xl font-bold">{title}</h1>
        <p className="leading-relaxed text-red-100">{description}</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {chapter.sections.map((section, idx) => {
          const secTitle = getSectionTitle(section, locale);
          const secContent = getSectionContent(section, locale);
          const secTips = getSectionTips(section, locale);

          return (
            <div
              key={idx}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow"
            >
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  {idx + 1}
                </span>
                {secTitle}
              </h2>
              <p className="leading-relaxed text-gray-600">{secContent}</p>

              {secTips && secTips.length > 0 ? (
                <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <h3 className="mb-2 flex items-center gap-1 text-sm font-bold text-yellow-800">
                    {t("practicalTips")}
                  </h3>
                  <ul className="space-y-1">
                    {secTips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-yellow-900"
                      >
                        <span className="shrink-0 text-yellow-500">▸</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Chapter Navigation */}
      <div className="prev-next pt-2">
        {prevChapter ? (
          <Link
            href={`/walkthrough/${prevChapter.id}`}
            className="prev-next-link prev-link"
          >
            <div className="prev-next-arrow">{t("prevChapter")}</div>
            <div className="prev-next-name">{getChapterTitle(prevChapter, locale)}</div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextChapter ? (
          <Link
            href={`/walkthrough/${nextChapter.id}`}
            className="prev-next-link next-link"
          >
            <div className="prev-next-arrow">{t("nextChapter")}</div>
            <div className="prev-next-name">{getChapterTitle(nextChapter, locale)}</div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
};
