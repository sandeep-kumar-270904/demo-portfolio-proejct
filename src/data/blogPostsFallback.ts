// Fallback for the new external-link blog_posts table.
// (The original DB-backed long-form blog `posts` table is unrelated and stays.)
export type DbBlogPost = {
  id: string;
  title: string;
  excerpt: string | null;
  published_date: string | null;
  read_time: string | null;
  tags: string[];
  external_url: string | null;
  is_published: boolean;
  sort_order: number;
};

export const blogPostsFallback: DbBlogPost[] = [];
