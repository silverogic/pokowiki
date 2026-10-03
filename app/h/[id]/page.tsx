import Head from "next/head";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { HabitatDetail, HabitatHeader, HabitatIcon, HabitatName, PrevNext } from "@/components";
import { HabitatData, HabitatDataById } from "@/data";
import { DEFAULT_TITLE } from "@/utils";

interface IProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: IProps) => {
  const { id } = await params;

  const habitat = HabitatDataById[+id];

  if (!habitat) {
    return {
      title: `서식지를 찾을 수 없습니다 - ${DEFAULT_TITLE}`,
    };
  }

  const displayName = habitat.korean || habitat.name;
  return {
    title: `${displayName} - ${DEFAULT_TITLE}`,
    description: `"${displayName}"은(는) 《포켓몬 포코피아》의 서식지 중 하나입니다.`,
  };
};

export async function generateStaticParams() {
  return HabitatData.map((h) => ({ id: h.index.toString().padStart(3, "0") }));
}

const HabitatDetailPage = async ({ params }: IProps) => {
  const { id } = await params;

  const habitat = HabitatDataById[+id];

  if (!habitat) notFound();

  const prevHabitat = HabitatData.find((h) => h.id === habitat.id - 1) || HabitatData[HabitatData.length - 1];
  const nextHabitat = HabitatData.find((h) => h.id === habitat.id + 1) || HabitatData[0];

  return (
    <Fragment key="habitat">
      <Head>
        <title>
          {habitat.name} - {DEFAULT_TITLE}
        </title>
      </Head>

      <HabitatHeader habitat={habitat} />

      <HabitatDetail habitat={habitat} />

      <PrevNext
        prev={
          prevHabitat
            ? {
                id: (prevHabitat.index % 10000).toString().padStart(3, "0"),
                isEvent: prevHabitat.isEvent,
                name: <HabitatName habitat={prevHabitat} />,
                icon: (
                  <HabitatIcon
                    habitat={prevHabitat}
                    size={24}
                  />
                ),
                link: `/h/${prevHabitat.index.toString().padStart(3, "0")}`,
              }
            : null
        }
        next={
          nextHabitat
            ? {
                id: (nextHabitat.index % 10000).toString().padStart(3, "0"),
                isEvent: nextHabitat.isEvent,
                name: <HabitatName habitat={nextHabitat} />,
                icon: (
                  <HabitatIcon
                    habitat={nextHabitat}
                    size={24}
                  />
                ),
                link: `/h/${nextHabitat.index.toString().padStart(3, "0")}`,
              }
            : null
        }
      />
    </Fragment>
  );
};

export default HabitatDetailPage;
