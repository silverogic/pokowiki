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
      title: `栖息地不存在 - ${DEFAULT_TITLE}`,
    };
  }

  return {
    title: `${habitat.name} - ${DEFAULT_TITLE}`,
    description: `“${habitat.name}”是《宝可梦 Pokopia》中的栖息地之一，它由${habitat.detail.map((d) => `${d.name} × ${d.count}`).join("、")} 组成。${habitat.pokemon.map((p) => p.form.split("-")[0]).join("、")}可能会在这里出现。`,
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
                isEvent: prevHabitat.isEvent,
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
