"use client";

import { useCallback, useEffect, useState } from "react";

import { IGitHubUser } from "./types";

const AUTH_STORAGE_KEY = "pokowiki_github_user";
const AUTH_EVENT_KEY = "pokowiki_auth_change";

export const getStoredGitHubUser = (): IGitHubUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredGitHubUser = (user: IGitHubUser | null) => {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(AUTH_EVENT_KEY));
  } catch {
    // Ignore storage errors
  }
};

export const useGitHubAuth = () => {
  const [user, setUser] = useState<IGitHubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setUser(getStoredGitHubUser());
    setLoading(false);

    const onAuthChange = () => {
      setUser(getStoredGitHubUser());
    };

    window.addEventListener(AUTH_EVENT_KEY, onAuthChange);
    window.addEventListener("storage", onAuthChange);

    // Giscus emitMetadata bridge
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://giscus.app") return;
      const giscusData = event.data?.giscus;
      if (giscusData && "discussion" in giscusData) {
        const viewer = giscusData.viewer;
        if (viewer && viewer.login) {
          const newUser: IGitHubUser = {
            login: viewer.login,
            avatarUrl: viewer.avatarUrl,
            url: viewer.url,
          };
          setStoredGitHubUser(newUser);
        }
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener(AUTH_EVENT_KEY, onAuthChange);
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const loginWithUser = useCallback((newUser: IGitHubUser) => {
    setStoredGitHubUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setStoredGitHubUser(null);
  }, []);

  const fetchUserById = useCallback(async (username: string): Promise<IGitHubUser | null> => {
    const trimmed = username.trim();
    if (!trimmed) return null;
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}`);
      if (!res.ok) return null;
      const data = await res.json();
      const fetched: IGitHubUser = {
        login: data.login,
        avatarUrl: data.avatar_url,
        url: data.html_url,
        name: data.name || data.login,
        bio: data.bio || undefined,
      };
      setStoredGitHubUser(fetched);
      return fetched;
    } catch {
      return null;
    }
  }, []);

  return {
    user,
    loading,
    loginWithUser,
    logout,
    fetchUserById,
  };
};
