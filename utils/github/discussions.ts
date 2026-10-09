export interface ICreateDiscussionParams {
  repositoryId: string;
  categoryId: string;
  title: string;
  body: string;
  token: string;
}

export interface ICreatedDiscussionResult {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
}

export interface IAddCommentParams {
  owner?: string;
  repo?: string;
  discussionNumber: number;
  discussionId?: string;
  body: string;
  token: string;
}

export interface IAddedCommentResult {
  id: string;
  body: string;
  createdAt: string;
  url: string;
  author: {
    login: string;
    avatarUrl: string;
  };
}

export const createDiscussionGraphQL = async ({
  repositoryId,
  categoryId,
  title,
  body,
  token,
}: ICreateDiscussionParams): Promise<ICreatedDiscussionResult> => {
  const query = `
    mutation CreateDiscussion($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
      createDiscussion(input: {
        repositoryId: $repositoryId,
        categoryId: $categoryId,
        title: $title,
        body: $body
      }) {
        discussion {
          id
          number
          title
          url
          createdAt
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
      "User-Agent": "pokowiki-community",
    },
    body: JSON.stringify({
      query,
      variables: {
        repositoryId,
        categoryId,
        title: title.trim(),
        body: body.trim(),
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub API Error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message || "Failed to create discussion on GitHub");
  }

  const discussion = json.data?.createDiscussion?.discussion;
  if (!discussion) {
    throw new Error("No discussion returned from GitHub API");
  }

  return discussion;
};

export const addDiscussionCommentGraphQL = async ({
  owner = "silverogic",
  repo = "pokowiki",
  discussionNumber,
  discussionId: explicitDiscussionId,
  body,
  token,
}: IAddCommentParams): Promise<IAddedCommentResult> => {
  let targetDiscussionId = explicitDiscussionId;

  // If node ID is not provided, fetch it by discussion number
  if (!targetDiscussionId) {
    const getIdQuery = `
      query GetDiscussionId($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          discussion(number: $number) {
            id
          }
        }
      }
    `;

    const idRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
        "User-Agent": "pokowiki-community",
      },
      body: JSON.stringify({
        query: getIdQuery,
        variables: {
          owner,
          name: repo,
          number: discussionNumber,
        },
      }),
    });

    if (!idRes.ok) {
      const errorText = await idRes.text();
      throw new Error(`GitHub API Error (${idRes.status}): ${errorText}`);
    }

    const idJson = await idRes.json();
    if (idJson.errors && idJson.errors.length > 0) {
      throw new Error(idJson.errors[0].message || "Failed to resolve discussion on GitHub");
    }

    targetDiscussionId = idJson.data?.repository?.discussion?.id;
    if (!targetDiscussionId) {
      throw new Error("Discussion not found on GitHub");
    }
  }

  // Mutate addDiscussionComment
  const mutation = `
    mutation AddDiscussionComment($discussionId: ID!, $body: String!) {
      addDiscussionComment(input: {
        discussionId: $discussionId,
        body: $body
      }) {
        comment {
          id
          body
          createdAt
          url
          author {
            login
            avatarUrl
          }
        }
      }
    }
  `;

  const mutRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
      "User-Agent": "pokowiki-community",
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        discussionId: targetDiscussionId,
        body: body.trim(),
      },
    }),
  });

  if (!mutRes.ok) {
    const errorText = await mutRes.text();
    throw new Error(`GitHub API Error (${mutRes.status}): ${errorText}`);
  }

  const mutJson = await mutRes.json();
  if (mutJson.errors && mutJson.errors.length > 0) {
    throw new Error(mutJson.errors[0].message || "Failed to post comment on GitHub");
  }

  const comment = mutJson.data?.addDiscussionComment?.comment;
  if (!comment) {
    throw new Error("No comment returned from GitHub API");
  }

  return comment;
};

export interface IUpdateDiscussionParams {
  owner?: string;
  repo?: string;
  discussionNumber: number;
  discussionId?: string;
  categoryId?: string;
  title: string;
  body: string;
  token: string;
}

export interface IUpdatedDiscussionResult {
  id: string;
  number: number;
  title: string;
  body: string;
  url: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const updateDiscussionGraphQL = async ({
  owner = "silverogic",
  repo = "pokowiki",
  discussionNumber,
  discussionId: explicitDiscussionId,
  categoryId,
  title,
  body,
  token,
}: IUpdateDiscussionParams): Promise<IUpdatedDiscussionResult> => {
  let targetDiscussionId = explicitDiscussionId;

  // If node ID is not provided, fetch it by discussion number
  if (!targetDiscussionId) {
    const getIdQuery = `
      query GetDiscussionId($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          discussion(number: $number) {
            id
          }
        }
      }
    `;

    const idRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
        "User-Agent": "pokowiki-community",
      },
      body: JSON.stringify({
        query: getIdQuery,
        variables: {
          owner,
          name: repo,
          number: discussionNumber,
        },
      }),
    });

    if (!idRes.ok) {
      const errorText = await idRes.text();
      throw new Error(`GitHub API Error (${idRes.status}): ${errorText}`);
    }

    const idJson = await idRes.json();
    if (idJson.errors && idJson.errors.length > 0) {
      throw new Error(idJson.errors[0].message || "Failed to resolve discussion on GitHub");
    }

    targetDiscussionId = idJson.data?.repository?.discussion?.id;
    if (!targetDiscussionId) {
      throw new Error("Discussion not found on GitHub");
    }
  }

  // Mutate updateDiscussion
  const mutation = `
    mutation UpdateDiscussion($discussionId: ID!, $title: String, $body: String, $categoryId: ID) {
      updateDiscussion(input: {
        discussionId: $discussionId,
        title: $title,
        body: $body,
        categoryId: $categoryId
      }) {
        discussion {
          id
          number
          title
          body
          url
          updatedAt
          category {
            id
            name
            slug
          }
        }
      }
    }
  `;

  const variables: Record<string, unknown> = {
    discussionId: targetDiscussionId,
    title: title.trim(),
    body: body.trim(),
  };

  if (categoryId) {
    variables.categoryId = categoryId;
  }

  const mutRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      "Content-Type": "application/json",
      "User-Agent": "pokowiki-community",
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  if (!mutRes.ok) {
    const errorText = await mutRes.text();
    throw new Error(`GitHub API Error (${mutRes.status}): ${errorText}`);
  }

  const mutJson = await mutRes.json();
  if (mutJson.errors && mutJson.errors.length > 0) {
    throw new Error(mutJson.errors[0].message || "Failed to update discussion on GitHub");
  }

  const updated = mutJson.data?.updateDiscussion?.discussion;
  if (!updated) {
    throw new Error("No discussion returned from GitHub API");
  }

  return updated;
};
