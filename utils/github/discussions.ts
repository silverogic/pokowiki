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
