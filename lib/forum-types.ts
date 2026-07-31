export type ForumReply = {
  id: string;
  author: string;
  content: string;
  date: string;
  isExample?: boolean;
  userId?: string | null;
};

export type ForumPost = {
  id: string;
  author: string;
  title: string;
  content: string;
  agent: string;
  date: string;
  replies: ForumReply[];
  userId?: string | null;
  isSeed?: boolean;
};

export type DbForumPost = {
  id: string;
  user_id: string | null;
  author_name: string;
  title: string;
  content: string;
  agent: string;
  is_seed: boolean;
  created_at: string;
};

export type DbForumReply = {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string;
  content: string;
  is_seed: boolean;
  created_at: string;
};

export function formatForumDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function mapDbPost(
  post: DbForumPost,
  replies: DbForumReply[] = []
): ForumPost {
  return {
    id: post.id,
    author: post.author_name,
    title: post.title,
    content: post.content,
    agent: post.agent,
    date: formatForumDate(post.created_at),
    userId: post.user_id,
    isSeed: post.is_seed,
    replies: replies
      .filter((r) => r.post_id === post.id)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((r) => ({
        id: r.id,
        author: r.author_name,
        content: r.content,
        date: formatForumDate(r.created_at),
        isExample: r.is_seed,
        userId: r.user_id,
      })),
  };
}
