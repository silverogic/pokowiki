import { notFound } from "next/navigation";

import { ChapterDetailClient } from "@/components";
import walkthroughData from "@/data/walkthrough.json";
import { WalkthroughChapter } from "@/types";

const chapters = (walkthroughData as WalkthroughChapter[]).sort((a, b) => a.order - b.order);

export async function generateStaticParams() {
  return chapters.map((c) => ({ id: c.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChapterPage({ params }: Props) {
  const { id } = await params;
  const chapter = chapters.find((c) => c.id === id);

  if (!chapter) notFound();

  const currentIndex = chapters.findIndex((c) => c.id === id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <ChapterDetailClient
      chapter={chapter}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
