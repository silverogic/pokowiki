# Pokowiki (Pokémon Pokopia Database)

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-6.x-1890FF?style=flat-square&logo=ant-design)](https://ant.design/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222222?style=flat-square&logo=github)](https://silverogic.github.io/pokowiki/)

> **Pokowiki** is a high-performance, multilingual database and encyclopedia for ***Pokémon Pokopia*** (포켓몬 포코피아).  
> Live Website: **[https://silverogic.github.io/pokowiki/](https://silverogic.github.io/pokowiki/)**

---

## 🌟 Overview

Pokowiki is a completely static, serverless web application that delivers over 4,400+ pre-rendered pages with instantaneous load times. It provides exhaustive game information—including Pokémon attributes, habitats, crafting and cooking recipes, chapter walkthroughs, and events—along with an in-app community forum powered directly by GitHub Discussions.

---

## 🚀 Key Features

### 📖 1. Pokédex (`/pokemon-list`, `/p/[id]`)
- **365 Pokémon Entries**: Complete coverage with national and local Pokédex numbers.
- **Detailed Profiles**: Types, specialties, height, weight, preferred environments, and favorite items.
- **Encounter Conditions**: Weather conditions (clear, overcast, rainy), time availability (day, night, anytime), and spawn zones.
- **Habitats & Navigation**: Direct links to all compatible habitats and smooth sequential Pokédex navigation (`PrevNext`).

### 🏞️ 2. Habitat Dex (`/habitat-list`, `/h/[id]`)
- **250+ Habitats**: Exhaustive directory of all habitats in the game.
- **Requirements & Details**: Required items, terrain conditions, and environmental elements.
- **Encounter Rates & Pokémon**: Multi-spawn and single-spawn species lists with rarity tiers and location constraints.

### 🛠️ 3. Item & Recipe Dex (`/item-list`, `/i/[hash]`)
- **1,760+ Items**: Categorized into furniture, outdoor goods, utilities, architecture/blocks, nature, materials, and food.
- **850+ Crafting Recipes**: Detailed material requirements with bi-directional navigation (*"Can Craft Into"* / *"Required Materials"*).
- **34 Cooking Recipes (조리법)**: Comprehensive food cooking guide featuring:
  - **Cooking Utensils**: Cutting board, Cooking pot, Bread oven, Frying pan, and Blender.
  - **Taste Profiles**: Sweet, spicy, bitter, sour, astringent, and balanced.
  - **Field Move Buffs**: Meal effects that power up field abilities (*Leafage*, *Water Gun*, *Cut*, *Rock Smash*, *Surf*).
  - **Flexible Ingredient Slots**: Support for conditional/free ingredient requirements.

### 🗺️ 4. Chapter Walkthroughs (`/walkthrough`, `/walkthrough/[id]`)
- Step-by-step game walkthrough guides for each story chapter.
- Clear progression checklists, objective pointers, and key item acquisition guides.

### 🎪 5. Event Tracker (`/event-list`)
- Catalog of limited-time and in-game special events.
- Quick cross-reference of featured Pokémon and event-exclusive reward items.

### 💬 6. Serverless Community (`/community`)
- **GitHub Discussions-Powered**: Fully integrated community board without any dedicated database server.
- **Interactive In-Site Features**: Read discussions, create new threads, post comments, and edit posts directly on Pokowiki.
- **Category Filtering & Search**: Categorized by Announcements, General, Questions, Strategy/Tips, and Bugs.
- **GitHub Authentication**: Supports GitHub Personal Access Token (PAT) login with automatic session persistence and recovery.

### 🌐 7. Complete Multilingual Support (i18n)
- Seamless 4-language support across all UI elements, item names, descriptions, and categories:
  - 🇰🇷 **Korean** (`ko`)
  - 🇺🇸 **English** (`en`)
  - 🇨🇳 **Simplified Chinese** (`zh`)
  - 🇯🇵 **Japanese** (`ja`)
- Instant language switcher with `localStorage` preference persistence.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16 (Turbopack, App Router)](https://nextjs.org/) |
| **Core** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS 4](https://tailwindcss.com/), [Ant Design 6](https://ant.design/), [`@ant-design/icons`](https://ant.design/components/icon) |
| **Icons & Assets** | [Nunito Font](https://fontsource.org/fonts/nunito), Lucide Icons, PokopiAPI CDN |
| **Utilities** | [`ahooks`](https://ext-ahooks.js.org/), [`classnames`](https://github.com/JedWatson/classnames) |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via GitHub Actions |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) |

---

## 📂 Project Structure

```text
pokowiki/
├── .github/
│   └── workflows/              # GitHub Actions deployment pipelines (CI/CD)
├── app/                        # Next.js App Router pages
│   ├── about/                  # About page
│   ├── community/              # Community discussion forum
│   ├── event-list/             # Event list
│   ├── h/[id]/                 # Habitat detail pages (SSG)
│   ├── habitat-list/           # Habitat directory
│   ├── i/[hash]/               # Item detail pages (SSG)
│   ├── item-list/              # Item directory with filters
│   ├── p/[id]/                 # Pokémon detail pages (SSG)
│   ├── pokemon-list/           # Pokédex directory
│   ├── walkthrough/            # Walkthrough guides
│   ├── layout.tsx              # Root HTML & Ant Design layout wrapper
│   └── page.tsx                # Homepage
├── components/                 # Reusable UI components
│   ├── commentary/             # Specialized Pokémon commentary
│   ├── community/              # Community modals, editor, and cards
│   ├── event/                  # Event tables and badges
│   ├── habitat/                # Habitat links and tables
│   ├── item/                   # Item links, icons, and recipe blocks
│   ├── pokemon/                # Pokémon headers, cards, and detail sections
│   └── site/                   # Navigation bar, auth widgets, footer, breadcrumbs
├── data/                       # Localized static game datasets
│   ├── events.json             # Event data
│   ├── habitats.json           # Habitat definitions and requirements
│   ├── items.json              # Item dataset with crafting & cooking recipes
│   ├── locations.json          # Island zones and location metadata
│   ├── pokemon.json            # Pokémon stats and attributes
│   └── walkthrough.json        # Walkthrough steps and guides
├── types/                      # TypeScript definitions (Pokemon, Item, Habitat, Community)
├── utils/                      # Helper libraries
│   ├── auth/                   # GitHub token & OAuth hook (`useGitHubAuth`)
│   ├── i18n/                   # Multi-language dictionary and hook (`useI18n`)
│   └── graphql/                # GitHub Discussions GraphQL client
├── next.config.ts              # Next.js static export & CDN remote patterns config
└── package.json                # Project dependencies and npm scripts
```

---

## 💻 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: [`pnpm`](https://pnpm.io/) (v10+ recommended) or `npm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/silverogic/pokowiki.git
   cd pokowiki
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

### Development Server

Run the development server with Turbopack:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

To create a static export (`output: "export"`) ready for GitHub Pages:

```bash
pnpm run build
# or
npm run build
```

The static files will be exported to the `./out` directory (over 4,420+ static HTML pages).

### Code Quality & Linting

```bash
pnpm run lint
# or
npm run lint
```

---

## ⚙️ Environment Variables

For local development or custom deployments, you can configure the following environment variables in a `.env.local` file:

```env
# Base path for deployment (e.g. "/pokowiki" for GitHub Pages subfolder, or "" for root domains)
NEXT_PUBLIC_BASE_PATH=""

# GitHub repository for community discussions
NEXT_PUBLIC_GISCUS_REPO="silverogic/pokowiki"
NEXT_PUBLIC_GISCUS_REPO_ID="R_kgDON..."
```

---

## 🚢 Deployment

The project is automatically built and deployed to **GitHub Pages** whenever changes are pushed to the `master` branch via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

- Runs `pnpm install --frozen-lockfile`
- Builds static export using `pnpm run build`
- Adds `.nojekyll` to the output folder
- Uploads and deploys artifact to GitHub Pages environment

---

## 📜 Guidelines for Contributors

- **Build Artifacts**: Do not commit build artifacts generated by `npm run build` (`.next/`, `out/`).
- **UI/UX Design**: For design patterns, component styles, and guidelines, refer to the Silverogic design reference.
- **Data Integrity**: When updating data in `data/*.json`, verify that both localized strings and cross-references (slugs, numbers, keys) remain intact.

---

## ⚖️ Disclaimer

*Pokowiki* is an unofficial, non-commercial fan-made project.  
*Pokémon* and *Pokémon Pokopia* are registered trademarks of **Nintendo**, **Creatures Inc.**, and **GAME FREAK inc.**  
This site is not affiliated with, endorsed by, or sponsored by Nintendo or The Pokémon Company.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
