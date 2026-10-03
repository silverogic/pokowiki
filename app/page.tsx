"use client";

import { Card } from "antd";
import Image from "next/image";
import { Fragment, useEffect } from "react";

import logo from "@/assets/images/logo.png";
import { HOME_NAVIGATIONS } from "@/data";
import { Icon, Link, useI18n } from "@/utils";

export default function Home() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t("siteTitle");

    document.querySelector("main")?.classList.add("main-home");

    return () => {
      document.querySelector("main")?.classList.remove("main-home");
    };
  }, [t]);

  const getNavLabel = (path: string, fallback: string) => {
    switch (path) {
      case "/":
        return t("home");
      case "/pokemon-list":
        return t("pokemonList");
      case "/habitat-list":
        return t("habitatList");
      case "/event-list":
        return t("eventList");
      case "/walkthrough":
        return t("walkthrough");
      case "/about":
        return t("about");
      default:
        return fallback;
    }
  };

  return (
    <Fragment key="home">
      <section>
        <div className="home-title-block">
          <div className="mb-4">
            <Image
              src={logo}
              alt="Logo"
              width={64}
              height={64}
              className="mx-auto block"
            />
          </div>
          <h1>{t("siteTitle")}</h1>
        </div>
      </section>

      <section>
        <div className="home-navigation">
          <h2>{t("siteNav")}</h2>
          <div className="home-links">
            {HOME_NAVIGATIONS[0].contents[0].contents.map((item) => (
              <Card key={item.path}>
                <Link
                  key={item.path}
                  href={item.path}
                  className="home-link-item"
                >
                  <Icon
                    name={item.icon}
                    className="home-link-icon"
                  />
                  <div className="home-link-label">{getNavLabel(item.path, item.label)}</div>
                </Link>
              </Card>
            ))}
          </div>
          <h2>{t("externalNav")}</h2>
          <div className="home-links">
            {HOME_NAVIGATIONS[1].contents.map((section) => (
              <Card
                key={section.title}
                title={section.title}
                className="home-link-card"
              >
                {section.contents.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="home-link-item"
                  >
                    <Icon
                      name={item.icon}
                      className="home-link-icon"
                    />
                    <div className="home-link-label">{item.label}</div>
                  </Link>
                ))}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
}
