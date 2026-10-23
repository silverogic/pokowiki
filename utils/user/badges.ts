import { IBadgeDefinition, IPokopiaUserData, IUserBadge } from "@/types";

export const BADGE_DEFINITIONS: IBadgeDefinition[] = [
  {
    id: "first_catch",
    icon: "🌱",
    nameKey: "badgeFirstCatchName",
    descKey: "badgeFirstCatchDesc",
    check: (data) => (data.caughtPokemon || []).length >= 1,
  },
  {
    id: "novice_trainer",
    icon: "⭐",
    nameKey: "badgeNoviceTrainerName",
    descKey: "badgeNoviceTrainerDesc",
    check: (data) => (data.caughtPokemon || []).length >= 10,
  },
  {
    id: "pokedex_researcher",
    icon: "🔍",
    nameKey: "badgeResearcherName",
    descKey: "badgeResearcherDesc",
    check: (data) => (data.caughtPokemon || []).length >= 30,
  },
  {
    id: "veteran_trainer",
    icon: "🏆",
    nameKey: "badgeVeteranName",
    descKey: "badgeVeteranDesc",
    check: (data) => (data.caughtPokemon || []).length >= 70,
  },
  {
    id: "pokedex_master",
    icon: "👑",
    nameKey: "badgeMasterName",
    descKey: "badgeMasterDesc",
    check: (data) => (data.caughtPokemon || []).length >= 100,
  },
  {
    id: "first_item",
    icon: "🎒",
    nameKey: "badgeFirstItemName",
    descKey: "badgeFirstItemDesc",
    check: (data) => (data.collectedItems || []).length >= 1,
  },
  {
    id: "item_collector",
    icon: "💎",
    nameKey: "badgeItemCollectorName",
    descKey: "badgeItemCollectorDesc",
    check: (data) => (data.collectedItems || []).length >= 20,
  },
  {
    id: "item_master",
    icon: "🧰",
    nameKey: "badgeItemMasterName",
    descKey: "badgeItemMasterDesc",
    check: (data) => (data.collectedItems || []).length >= 50,
  },
  {
    id: "cloud_trainer",
    icon: "☁️",
    nameKey: "badgeCloudTrainerName",
    descKey: "badgeCloudTrainerDesc",
    check: (_, isSynced) => isSynced,
  },
  {
    id: "starter_trio",
    icon: "✨",
    nameKey: "badgeStarterTrioName",
    descKey: "badgeStarterTrioDesc",
    check: (data) => {
      const set = new Set(data.caughtPokemon || []);
      const hasBulbasaur = set.has("001") || set.has("bulbasaur");
      const hasCharmander = set.has("004") || set.has("charmander");
      const hasSquirtle = set.has("007") || set.has("squirtle");
      return hasBulbasaur && hasCharmander && hasSquirtle;
    },
  },
];

export const calculateExp = (caughtCount: number, collectedCount: number, isSynced: boolean): number => {
  let exp = caughtCount * 50 + collectedCount * 20;
  if (isSynced) exp += 100;
  return exp;
};

export const calculateLevelInfo = (exp: number) => {
  // Level threshold formula: level n requires (n - 1)^2 * 60 EXP
  // Level 1: 0 EXP
  // Level 2: 60 EXP
  // Level 3: 240 EXP
  // Level 4: 540 EXP
  // Level 5: 960 EXP, etc.
  const level = Math.max(1, Math.floor(Math.sqrt(exp / 60)) + 1);
  const currentLevelBaseExp = Math.pow(level - 1, 2) * 60;
  const nextLevelExp = Math.pow(level, 2) * 60;
  const expNeeded = Math.max(1, nextLevelExp - currentLevelBaseExp);
  const expProgress = Math.max(0, exp - currentLevelBaseExp);
  const progressPercent = Math.min(100, Math.floor((expProgress / expNeeded) * 100));

  return {
    level,
    exp,
    currentLevelBaseExp,
    nextLevelExp,
    expProgress,
    expNeeded,
    progressPercent,
  };
};

export const evaluateBadges = (
  data: IPokopiaUserData,
  isSynced: boolean,
  existingBadges: IUserBadge[] = [],
): IUserBadge[] => {
  const existingMap = new Map(existingBadges.map((b) => [b.id, b]));
  const now = new Date().toISOString();

  BADGE_DEFINITIONS.forEach((def) => {
    if (def.check(data, isSynced)) {
      if (!existingMap.has(def.id)) {
        existingMap.set(def.id, {
          id: def.id,
          unlockedAt: now,
        });
      }
    }
  });

  return Array.from(existingMap.values());
};
