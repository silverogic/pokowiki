"use client";

import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { IPokopiaUserData, IUserBadge, SyncStatus } from "@/types";
import { useGitHubAuth } from "@/utils/auth";

import { calculateExp, calculateLevelInfo, evaluateBadges } from "./badges";
import { createPokowikiGist, findPokowikiGist, updatePokowikiGist } from "./gistSync";

const USER_DATA_STORAGE_KEY = "pokowiki_userdata";
const GIST_ID_STORAGE_KEY = "pokowiki_gist_id";
const GIST_URL_STORAGE_KEY = "pokowiki_gist_url";

const defaultUserData: IPokopiaUserData = {
  version: 1,
  updatedAt: new Date().toISOString(),
  trainer: {
    level: 1,
    exp: 0,
  },
  caughtPokemon: [],
  collectedItems: [],
  badges: [],
};

const getStoredLocalData = (): IPokopiaUserData => {
  if (typeof window === "undefined") return defaultUserData;
  try {
    const raw = localStorage.getItem(USER_DATA_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultUserData,
        ...parsed,
        caughtPokemon: parsed.caughtPokemon || [],
        collectedItems: parsed.collectedItems || [],
        badges: parsed.badges || [],
      };
    }
  } catch {}
  return defaultUserData;
};

interface IUserContextType {
  userData: IPokopiaUserData;
  caughtSet: Set<string>;
  collectedSet: Set<string>;
  isCaught: (pokemonId: string) => boolean;
  toggleCaught: (pokemonId: string) => void;
  isCollected: (itemId: string) => boolean;
  toggleCollected: (itemId: string) => void;
  levelInfo: ReturnType<typeof calculateLevelInfo>;
  badges: IUserBadge[];
  syncStatus: SyncStatus;
  syncError: string | null;
  gistUrl: string | null;
  manualSync: () => Promise<void>;
}

const UserContext = createContext<IUserContextType | null>(null);

export const PokopiaUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useGitHubAuth();
  const [userData, setUserData] = useState<IPokopiaUserData>(defaultUserData);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [gistId, setGistId] = useState<string | null>(null);
  const [gistUrl, setGistUrl] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestDataRef = useRef<IPokopiaUserData>(userData);

  useEffect(() => {
    latestDataRef.current = userData;
  }, [userData]);

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    const local = getStoredLocalData();
    setUserData(local);

    try {
      const savedGistId = localStorage.getItem(GIST_ID_STORAGE_KEY);
      const savedGistUrl = localStorage.getItem(GIST_URL_STORAGE_KEY);
      if (savedGistId) setGistId(savedGistId);
      if (savedGistUrl) setGistUrl(savedGistUrl);
    } catch {}
  }, []);

  // Quick lookup sets
  const caughtSet = useMemo(() => new Set(userData.caughtPokemon || []), [userData.caughtPokemon]);
  const collectedSet = useMemo(() => new Set(userData.collectedItems || []), [userData.collectedItems]);

  const isSynced = Boolean(user?.token && (syncStatus === "synced" || gistId));

  // Level & Badges calculation
  const totalExp = useMemo(
    () => calculateExp(caughtSet.size, collectedSet.size, isSynced),
    [caughtSet.size, collectedSet.size, isSynced],
  );

  const levelInfo = useMemo(() => calculateLevelInfo(totalExp), [totalExp]);

  const activeBadges = useMemo(() => evaluateBadges(userData, isSynced, userData.badges), [userData, isSynced]);

  // 2. Cloud Sync: When GitHub Token is available, find or create Gist
  useEffect(() => {
    if (!user?.token) {
      setSyncStatus("offline");
      return;
    }

    let isMounted = true;

    const initCloudSync = async () => {
      setSyncStatus("syncing");
      setSyncError(null);

      try {
        const found = await findPokowikiGist(user.token!);

        if (found) {
          if (!isMounted) return;

          // Merge local and remote
          const remoteData = found.data;
          const mergedCaught = Array.from(
            new Set([...(latestDataRef.current.caughtPokemon || []), ...(remoteData.caughtPokemon || [])]),
          );
          const mergedItems = Array.from(
            new Set([...(latestDataRef.current.collectedItems || []), ...(remoteData.collectedItems || [])]),
          );
          const mergedBadges = evaluateBadges(
            { ...remoteData, caughtPokemon: mergedCaught, collectedItems: mergedItems },
            true,
            [...(remoteData.badges || []), ...(latestDataRef.current.badges || [])],
          );

          const merged: IPokopiaUserData = {
            version: 1,
            updatedAt: new Date().toISOString(),
            trainer: {
              login: user.login,
              level: calculateLevelInfo(calculateExp(mergedCaught.length, mergedItems.length, true)).level,
              exp: calculateExp(mergedCaught.length, mergedItems.length, true),
            },
            caughtPokemon: mergedCaught,
            collectedItems: mergedItems,
            badges: mergedBadges,
          };

          setUserData(merged);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(merged));
          setGistId(found.gistId);
          setGistUrl(found.gistUrl);
          localStorage.setItem(GIST_ID_STORAGE_KEY, found.gistId);
          localStorage.setItem(GIST_URL_STORAGE_KEY, found.gistUrl);

          // If local had additions not in remote, update remote Gist
          if (
            mergedCaught.length !== remoteData.caughtPokemon?.length ||
            mergedItems.length !== remoteData.collectedItems?.length
          ) {
            await updatePokowikiGist(user.token!, found.gistId, merged);
          }

          setSyncStatus("synced");
        } else {
          // No Gist exists yet -> Create new secret Gist with current local progress
          const currentLocal = latestDataRef.current;
          const initialExp = calculateExp(
            (currentLocal.caughtPokemon || []).length,
            (currentLocal.collectedItems || []).length,
            true,
          );
          const initialCloud: IPokopiaUserData = {
            ...currentLocal,
            trainer: {
              login: user.login,
              level: calculateLevelInfo(initialExp).level,
              exp: initialExp,
            },
            updatedAt: new Date().toISOString(),
            badges: evaluateBadges(currentLocal, true, currentLocal.badges),
          };

          const created = await createPokowikiGist(user.token!, initialCloud);
          if (!isMounted) return;

          setUserData(initialCloud);
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(initialCloud));
          setGistId(created.gistId);
          setGistUrl(created.gistUrl);
          localStorage.setItem(GIST_ID_STORAGE_KEY, created.gistId);
          localStorage.setItem(GIST_URL_STORAGE_KEY, created.gistUrl);
          setSyncStatus("synced");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setSyncStatus("error");
        setSyncError(err?.message || "Sync error");
      }
    };

    initCloudSync();

    return () => {
      isMounted = false;
    };
  }, [user?.token, user?.login]);

  // Push to Gist helper with debounce
  const schedulePushToGist = useCallback(
    (updated: IPokopiaUserData) => {
      if (!user?.token || !gistId) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setSyncStatus("syncing");

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const res = await updatePokowikiGist(user.token!, gistId, updated);
          setSyncStatus("synced");
          if (res.gistUrl) setGistUrl(res.gistUrl);
        } catch (err: any) {
          setSyncStatus("error");
          setSyncError(err?.message || "Sync update failed");
        }
      }, 1200);
    },
    [user, gistId],
  );

  // Toggle Pokémon Caught
  const toggleCaught = useCallback(
    (pokemonId: string) => {
      const cleanId = String(pokemonId).trim();
      if (!cleanId) return;

      setUserData((prev) => {
        const set = new Set(prev.caughtPokemon || []);
        if (set.has(cleanId)) {
          set.delete(cleanId);
        } else {
          set.add(cleanId);
        }
        const updatedList = Array.from(set);
        const exp = calculateExp(updatedList.length, (prev.collectedItems || []).length, isSynced);
        const nextBadges = evaluateBadges({ ...prev, caughtPokemon: updatedList }, isSynced, prev.badges);

        const next: IPokopiaUserData = {
          ...prev,
          updatedAt: new Date().toISOString(),
          caughtPokemon: updatedList,
          trainer: {
            ...prev.trainer,
            exp,
            level: calculateLevelInfo(exp).level,
          },
          badges: nextBadges,
        };

        try {
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(next));
        } catch {}

        schedulePushToGist(next);
        return next;
      });
    },
    [isSynced, schedulePushToGist],
  );

  // Toggle Item Collected
  const toggleCollected = useCallback(
    (itemId: string) => {
      const cleanId = String(itemId).trim();
      if (!cleanId) return;

      setUserData((prev) => {
        const set = new Set(prev.collectedItems || []);
        if (set.has(cleanId)) {
          set.delete(cleanId);
        } else {
          set.add(cleanId);
        }
        const updatedList = Array.from(set);
        const exp = calculateExp((prev.caughtPokemon || []).length, updatedList.length, isSynced);
        const nextBadges = evaluateBadges({ ...prev, collectedItems: updatedList }, isSynced, prev.badges);

        const next: IPokopiaUserData = {
          ...prev,
          updatedAt: new Date().toISOString(),
          collectedItems: updatedList,
          trainer: {
            ...prev.trainer,
            exp,
            level: calculateLevelInfo(exp).level,
          },
          badges: nextBadges,
        };

        try {
          localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(next));
        } catch {}

        schedulePushToGist(next);
        return next;
      });
    },
    [isSynced, schedulePushToGist],
  );

  const isCaught = useCallback((id: string) => caughtSet.has(String(id).trim()), [caughtSet]);
  const isCollected = useCallback((id: string) => collectedSet.has(String(id).trim()), [collectedSet]);

  const manualSync = useCallback(async () => {
    if (!user?.token) return;
    setSyncStatus("syncing");
    try {
      const targetGistId = gistId || (await findPokowikiGist(user.token))?.gistId;
      if (targetGistId) {
        await updatePokowikiGist(user.token, targetGistId, latestDataRef.current);
        setSyncStatus("synced");
      } else {
        const created = await createPokowikiGist(user.token, latestDataRef.current);
        setGistId(created.gistId);
        setGistUrl(created.gistUrl);
        setSyncStatus("synced");
      }
    } catch (err: any) {
      setSyncStatus("error");
      setSyncError(err?.message || "Manual sync failed");
    }
  }, [user, gistId]);

  const contextValue = useMemo(
    () => ({
      userData,
      caughtSet,
      collectedSet,
      isCaught,
      toggleCaught,
      isCollected,
      toggleCollected,
      levelInfo,
      badges: activeBadges,
      syncStatus,
      syncError,
      gistUrl,
      manualSync,
    }),
    [
      userData,
      caughtSet,
      collectedSet,
      isCaught,
      toggleCaught,
      isCollected,
      toggleCollected,
      levelInfo,
      activeBadges,
      syncStatus,
      syncError,
      gistUrl,
      manualSync,
    ],
  );

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const usePokopiaUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("usePokopiaUser must be used within a PokopiaUserProvider");
  }
  return ctx;
};
