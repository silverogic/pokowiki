"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, ThemeConfig } from "antd";
import React, { FC, ReactNode } from "react";

import { I18nProvider, useI18n } from "@/utils";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TocObserver } from "./TocObserver";

interface IAppClientLayoutProps {
  children: ReactNode;
  theme: ThemeConfig;
}

const AppClientLayoutContent: FC<IAppClientLayoutProps> = ({ children, theme }) => {
  const { antdLocale } = useI18n();

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
              <div className="bg-white sm:rounded-2xl sm:shadow-xl">{children}</div>
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
