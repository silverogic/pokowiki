"use client";

import { useEffect } from "react";

import walkthroughData from "@/data/walkthrough.json";
import { WalkthroughChapter } from "@/types";
import { Link, useI18n } from "@/utils";

const chapters = (walkthroughData as WalkthroughChapter[]).sort((a, b) => a.order - b.order);

export default function WalkthroughPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("walkthrough")} - ${t("siteTitle")}`;
  }, [t]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-1 text-3xl font-bold">{t("walkthroughTitle")}</h1>
        <p className="text-gray-500">{t("walkthroughSubtitle").replace("{0}", String(chapters.length))}</p>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/walkthrough/${chapter.id}`}
            className="block rounded-2xl border border-gray-100 bg-white p-6 shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                {chapter.order}
              </div>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-bold group-hover:text-red-600">{chapter.title}</h2>
                <p className="text-sm leading-relaxed text-gray-500">{chapter.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    📄 {chapter.sections.length} {t("sections")}
                  </span>
                  <span>·</span>
                  <span className="font-medium text-red-500">{t("viewDetails")}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
