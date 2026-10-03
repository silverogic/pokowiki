"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, ThemeConfig } from "antd";
import React, { FC, ReactNode } from "react";

import { I18nProvider, useI18n } from "@/utils";

import { Footer } from "./Footer";
import { Giscus } from "./Giscus";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TocObserver } from "./TocObserver";

interface IAppClientLayoutProps {
  children: ReactNode;
  theme: ThemeConfig;
}

const AppClientLayoutContent: FC<IAppClientLayoutProps> = ({ children, theme }) => {
  const { antdLocale, locale } = useI18n();

  const giscusLang = locale === "zh" ? "zh-CN" : locale === "ko" ? "ko" : locale === "ja" ? "ja" : "en";

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={theme}
    >
      <TocObserver>
        <Header />
        <div className="relative flex-1 md:flex">
          <Sidebar />

          <main>
            <AntdRegistry>
              <div className="bg-white sm:rounded-2xl sm:shadow-xl">
                {children}
                <section className="giscus">
                  <Giscus
                    host={process.env.NEXT_PUBLIC_GISCUS_HOST || "https://giscus.xzonn.top"}
                    repo={
                      (process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`) || "Xzonn/PokemonPokopiaDatabase"
                    }
                    repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDORmT12w"}
                    category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General"}
                    categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDORmT1284C4cEM"}
                    mapping="specific"
                    term="评论区"
                    reactions-enabled="1"
                    emit-metadata="0"
                    input-position="top"
                    theme="preferred_color_scheme"
                    lang={giscusLang}
                  />
                </section>
              </div>
            </AntdRegistry>
          </main>
        </div>
        <Footer />
      </TocObserver>
    </ConfigProvider>
  );
};

export const AppClientLayout: FC<IAppClientLayoutProps> = (props) => (
  <I18nProvider>
    <AppClientLayoutContent {...props} />
  </I18nProvider>
);
