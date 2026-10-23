export interface IUserBadge {
  id: string;
  unlockedAt: string;
}

export interface IBadgeDefinition {
  id: string;
  icon: string;
  nameKey: string;
  descKey: string;
  check: (data: IPokopiaUserData, isSynced: boolean) => boolean;
}

export interface IPokopiaUserData {
  version: 1;
  updatedAt: string;
  trainer: {
    login?: string;
    level: number;
    exp: number;
  };
  caughtPokemon: string[]; // List of pokemon IDs (e.g. "001", "004")
  collectedItems: string[]; // List of item IDs or hashes
  badges: IUserBadge[];
}

export type SyncStatus = "idle" | "syncing" | "synced" | "error" | "offline";
