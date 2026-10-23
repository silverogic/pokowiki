import { IPokopiaUserData } from "@/types";

export const GIST_FILENAME = "pokowiki-userdata.json";
export const GIST_DESCRIPTION = "Pokowiki User Data (Pokémon & Item Collection Progress)";

interface IGistFile {
  filename: string;
  type: string;
  language: string;
  raw_url: string;
  size: number;
  truncated?: boolean;
  content?: string;
}

interface IGistResponse {
  id: string;
  html_url: string;
  description: string;
  files: Record<string, IGistFile>;
}

export const findPokowikiGist = async (
  token: string,
): Promise<{ gistId: string; data: IPokopiaUserData; gistUrl: string } | null> => {
  try {
    const res = await fetch("https://api.github.com/gists?per_page=100", {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (res.status === 404 || res.status === 403) {
      throw new Error("GIST_PERMISSION_REQUIRED");
    }
    if (!res.ok) return null;
    const gists: IGistResponse[] = await res.json();

    const target = gists.find((g) => g.files && g.files[GIST_FILENAME]);
    if (!target) return null;

    const file = target.files[GIST_FILENAME];
    let content = file.content;

    if (!content || file.truncated) {
      const rawRes = await fetch(file.raw_url, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });
      if (rawRes.ok) {
        content = await rawRes.text();
      }
    }

    if (!content) return null;
    const parsed: IPokopiaUserData = JSON.parse(content);

    return {
      gistId: target.id,
      data: parsed,
      gistUrl: target.html_url,
    };
  } catch (err: any) {
    if (err?.message === "GIST_PERMISSION_REQUIRED") {
      throw err;
    }
    return null;
  }
};

export const createPokowikiGist = async (
  token: string,
  data: IPokopiaUserData,
): Promise<{ gistId: string; gistUrl: string }> => {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 404 || res.status === 403) {
      throw new Error("GIST_PERMISSION_REQUIRED");
    }
    throw new Error(`Failed to create secret Gist: ${res.status} ${errText}`);
  }

  const result: IGistResponse = await res.json();
  return {
    gistId: result.id,
    gistUrl: result.html_url,
  };
};

export const updatePokowikiGist = async (
  token: string,
  gistId: string,
  data: IPokopiaUserData,
): Promise<{ gistUrl: string }> => {
  const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(gistId)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 404 || res.status === 403) {
      throw new Error("GIST_PERMISSION_REQUIRED");
    }
    throw new Error(`Failed to update secret Gist: ${res.status} ${errText}`);
  }

  const result: IGistResponse = await res.json();
  return {
    gistUrl: result.html_url,
  };
};
