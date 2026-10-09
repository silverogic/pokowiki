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

  // 1. Popup callback self-close listener
  useEffect(() => {
    if (typeof window !== "undefined" && window.opener && window.location.search.includes("code=")) {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          window.opener.postMessage({ type: "POKOWIKI_GITHUB_OAUTH_CODE", code }, "*");
          window.close();
        }
      } catch {
        // Ignore popup communication errors
      }
    }
  }, []);

  // 2. Main window state sync & message listener
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
          const prev = getStoredGitHubUser();
          const newUser: IGitHubUser = {
            login: viewer.login,
            avatarUrl: viewer.avatarUrl,
            url: viewer.url,
            token: prev?.token,
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

  const loginWithToken = useCallback(async (token: string): Promise<IGitHubUser | null> => {
    const trimmed = token.trim();
    if (!trimmed) return null;
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${trimmed}`,
          "User-Agent": "pokowiki-community",
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const fetched: IGitHubUser = {
        login: data.login,
        avatarUrl: data.avatar_url,
        url: data.html_url,
        name: data.name || data.login,
        bio: data.bio || undefined,
        token: trimmed,
      };
      setStoredGitHubUser(fetched);
      return fetched;
    } catch {
      return null;
    }
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

  const startOAuthLogin = useCallback(
    async (clientId: string, proxyUrl?: string): Promise<IGitHubUser | null> => {
      if (typeof window === "undefined" || !clientId) return null;

      const callbackUrl = window.location.href.split("#")[0].split("?")[0];
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=public_repo&redirect_uri=${encodeURIComponent(callbackUrl)}`,
        "pokowiki_oauth_popup",
        `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0`,
      );

      if (!popup) {
        throw new Error("Popup blocked by browser. Please allow popups for this site.");
      }

      return new Promise<IGitHubUser | null>((resolve, reject) => {
        let resolved = false;

        const cleanup = () => {
          window.removeEventListener("message", onMessage);
          clearInterval(pollTimer);
        };

        const onMessage = async (event: MessageEvent) => {
          if (event.data?.type === "POKOWIKI_GITHUB_OAUTH_CODE") {
            const code = event.data.code;
            cleanup();
            resolved = true;

            try {
              if (!proxyUrl) {
                // If proxy is not configured, we cannot exchange token on client
                throw new Error("OAuth token proxy URL is not configured.");
              }

              // Exchange code for token via proxy
              const tokenRes = await fetch(
                proxyUrl.includes("{code}")
                  ? proxyUrl.replace("{code}", encodeURIComponent(code))
                  : `${proxyUrl.replace(/\/+$/, "")}/authenticate/${encodeURIComponent(code)}`,
              );

              if (!tokenRes.ok) {
                throw new Error("Token exchange failed");
              }

              const tokenData = await tokenRes.json();
              const accessToken = tokenData.token || tokenData.access_token;
              if (!accessToken) {
                throw new Error("No token returned by proxy");
              }

              const user = await loginWithToken(accessToken);
              resolve(user);
            } catch (err) {
              reject(err);
            }
          }
        };

        window.addEventListener("message", onMessage);

        const pollTimer = setInterval(() => {
          if (popup.closed) {
            cleanup();
            if (!resolved) {
              resolve(null);
            }
          }
        }, 500);
      });
    },
    [loginWithToken],
  );

  return {
    user,
    token: user?.token,
    loading,
    loginWithUser,
    loginWithToken,
    logout,
    fetchUserById,
    startOAuthLogin,
  };
};
