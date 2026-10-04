"use client";

import { Card } from "antd";
import Head from "next/head";
import Image from "next/image";
import { FC, Fragment, useEffect } from "react";

import { EventTable, ItemLink, PageTitle } from "@/components";
import { EventData } from "@/data";
import { useI18n } from "@/utils";

const EventListPage: FC = () => {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("eventList")} - ${t("siteTitle")}`;
  }, [t]);

  return (
    <Fragment key="event-list">
      <Head>
        <title>{t("eventList")}</title>
      </Head>

      <section>
        <PageTitle titleKey="eventList" />
      </section>

      <section>
        <h2>{t("eventPokemon")}</h2>
        <p>{t("eventPokemonDesc")}</p>
        <p>{t("eventTimeNote")}</p>
        <EventTable data={EventData} />
      </section>

      <section>
        <h2>{t("mysteryGift")}</h2>
        <p>{t("mysteryGiftDesc")}</p>
        <div className="activity-card-container">
          <Card title={t("preorderBonus")}>
            <div className="text-center">
              <ItemLink
                name="百变怪地垫"
                count={1}
              />
            </div>
            <div>
              <b>{t("claimCondition")}</b>：{t("claimConditionNone")}
            </div>
            <div>
              <b>{t("claimPeriod")}</b>：2026-03-05 ~ 2027-01-31
            </div>
          </Card>
          <div />
          <div />
          <div />
        </div>
      </section>

      <section>
        <h2>{t("officialCloudIslands")}</h2>
        <p>{t("officialCloudIslandsDesc")}</p>
        <div className="activity-card-container">
          <Card title="Pokemon Info Bureau Town">
            <Image
              src="https://i.imgur.com/d5cPVn2.jpg"
              alt="Pokemon Info Bureau Town"
              width={160}
              height={120}
              className="image-x aspect-4/3 w-full"
            />
            <div>
              <b>{t("passphrase")}</b>：PXQC G03S
            </div>
          </Card>
          <Card title="Kano Eiko's EIKO City">
            <Image
              src="https://i.imgur.com/YbYmJB2.jpg"
              alt="Kano Eiko's EIKO City"
              width={160}
              height={120}
              className="image-x aspect-4/3 w-full"
            />
            <div>
              <b>{t("passphrase")}</b>：QBRK 7FVM
            </div>
            <div>
              <b>{t("availableUntil")}</b>：2026-08-12
            </div>
          </Card>
          <Card title="Sashihara Rino's Sashihara Island">
            <Image
              src="https://i.imgur.com/OPxq9lN.jpg"
              alt="Sashihara Rino's Sashihara Island"
              width={160}
              height={120}
              className="image-x aspect-4/3 w-full"
            />
            <div>
              <b>{t("passphrase")}</b>：MGL4 83P4
            </div>
            <div>
              <b>{t("availableUntil")}</b>：2026-08-12
            </div>
          </Card>
          <div />
          <div />
          <div />
        </div>
      </section>
    </Fragment>
  );
};

export default EventListPage;
