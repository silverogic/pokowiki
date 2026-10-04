"use client";

import Head from "next/head";
import { Fragment, useEffect } from "react";

import { PokemonIcon } from "@/components";
import { PokemonDataByName } from "@/data";
import { Link, useI18n } from "@/utils";

const NotFoundPage = () => {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t("notFoundTitle")} - ${t("siteTitle")}`;

    document.querySelector(".giscus")?.classList.add("hidden");

    return () => {
      document.querySelector(".giscus")?.classList.remove("hidden");
    };
  }, [t]);

  return (
    <Fragment key="not-found">
      <Head>
        <title>
          {t("notFoundTitle")} - {t("siteTitle")}
        </title>
      </Head>
      <section
        key="not-found"
        className="not-found-block"
      >
        <div className="not-found-icon">
          <PokemonIcon pokemon={PokemonDataByName["梦幻"]} />
        </div>
        <h1>{t("notFoundTitle")}</h1>
        <p>{t("notFoundDescription")}</p>
        <div className="not-found-actions">
          <Link
            href="/"
            className="not-found-button"
          >
            {t("goHome")}
          </Link>
          <Link
            href="/"
            onClick={() => window.history.back()}
            className="not-found-button"
          >
            {t("goBack")}
          </Link>
        </div>
      </section>
    </Fragment>
  );
};

export default NotFoundPage;
