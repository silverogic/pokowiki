import "@/assets/css/styles.css";

import { Analytics } from "@vercel/analytics/next";
import { ThemeConfig } from "antd";
import { Metadata } from "next";
import { ReactNode } from "react";

import { AppClientLayout } from "@/components";
import { BREAKPOINTS, DEFAULT_TITLE, SITE_URL } from "@/utils";

const { xs, sm, md, lg, xl, xxl } = BREAKPOINTS;

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#c28cd9",
    colorLink: "#007fff",
    borderRadius: 8,
    screenXS: xs,
    screenXSMin: xs,
    screenXSMax: sm - 1,
    screenSM: sm,
    screenSMMin: sm,
    screenSMMax: md - 1,
    screenMD: md,
    screenMDMin: md,
    screenMDMax: lg - 1,
    screenLG: lg,
    screenLGMin: lg,
    screenLGMax: xl - 1,
    screenXL: xl,
    screenXLMin: xl,
    screenXLMax: xxl - 1,
    screenXXL: xxl,
    screenXXLMin: xxl,
  },
  components: {
    Spin: {
      colorPrimary: "#c28cd9",
    },
    Select: {
      colorPrimary: "#c28cd9",
      colorPrimaryHover: "#c28cd9",
    },
    Table: {
      headerBg: "#fafafa",
      headerSplitColor: "transparent",
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: "포코위키 - 포켓몬 포코피아 도감 및 데이터베이스",
  keywords: ["포코위키", "포켓몬", "포코피아", "Pokopia", "Pokowiki", "도감", "공략"],
  openGraph: {
    title: DEFAULT_TITLE,
    description: "포코위키 - 포켓몬 포코피아 도감 및 데이터베이스",
    url: SITE_URL,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en">
    <body>
      <div id="root">
        <AppClientLayout theme={theme}>{children}</AppClientLayout>
        <Analytics />
        <script
          src="https://hm.baidu.com/hm.js?3ba4ff308bcec03a61b76097f5b792d8"
          referrerPolicy="no-referrer-when-downgrade"
          async
        />
      </div>
    </body>
  </html>
);
export default RootLayout;
