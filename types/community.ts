export interface IGitHubDiscussionUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface IGitHubDiscussionCategory {
  id: number;
  node_id?: string;
  name: string;
  slug: string;
  emoji?: string;
  description?: string;
}

export interface IGitHubDiscussionReaction {
  total_count: number;
  "+1"?: number;
  "-1"?: number;
  laugh?: number;
  hooray?: number;
  confused?: number;
  heart?: number;
  rocket?: number;
  eyes?: number;
}

export interface IGitHubDiscussion {
  id: number;
  node_id?: string;
  number: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  comments: number;
  category: IGitHubDiscussionCategory;
  user: IGitHubDiscussionUser;
  reactions?: IGitHubDiscussionReaction;
}

export interface IGitHubDiscussionComment {
  id: number;
  body: string;
  html_url: string;
  created_at: string;
  updated_at?: string;
  user: IGitHubDiscussionUser;
  reactions?: IGitHubDiscussionReaction;
}
