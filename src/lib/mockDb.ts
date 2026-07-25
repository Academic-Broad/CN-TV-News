import { supabase } from "@/lib/supabase";
import type { Article } from "@/data/articles";
export type { Article } from "@/data/articles";

export interface AdminArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  authorId: string;
  publishedAt: string;
  status: "draft" | "published";
  viewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isBreaking: boolean;
  isFeatured: boolean;
}

interface DbRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  author_id: string;
  published_at: string;
  status: "draft" | "published";
  view_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_breaking: boolean;
  is_featured: boolean;
}

function rowToAdmin(row: DbRow): AdminArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    image: row.image,
    category: row.category,
    authorId: row.author_id,
    publishedAt: row.published_at,
    status: row.status,
    viewCount: row.view_count,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isBreaking: row.is_breaking,
    isFeatured: row.is_featured,
  };
}

function adminToArticle(a: AdminArticle): Article {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    content: a.content,
    image: a.image,
    category: a.category,
    authorId: a.authorId,
    publishedAt: a.publishedAt,
    isBreaking: a.isBreaking,
    isFeatured: a.isFeatured,
    viewCount: a.viewCount,
    tags: a.tags,
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// --- Admin functions ---

export async function getAllArticles(): Promise<AdminArticle[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin);
}

export async function getArticleById(id: string): Promise<AdminArticle | undefined> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return rowToAdmin(data as DbRow);
}

export async function getArticleBySlugAdmin(slug: string): Promise<AdminArticle | undefined> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;
  return rowToAdmin(data as DbRow);
}

export async function createArticle(
  data: Omit<AdminArticle, "id" | "slug" | "createdAt" | "updatedAt" | "viewCount">
): Promise<AdminArticle> {
  const now = new Date().toISOString();
  const row = {
    title: data.title,
    slug: generateSlug(data.title),
    summary: data.summary,
    content: data.content,
    image: data.image,
    category: data.category,
    author_id: data.authorId,
    published_at: data.publishedAt,
    status: data.status,
    tags: data.tags,
    view_count: 0,
    is_breaking: data.isBreaking,
    is_featured: data.isFeatured,
    created_at: now,
    updated_at: now,
  };

  const { data: inserted, error } = await supabase
    .from("articles")
    .insert(row)
    .select()
    .single();

  if (error) throw error;
  return rowToAdmin(inserted as DbRow);
}

export async function updateArticle(
  id: string,
  data: Partial<Omit<AdminArticle, "id" | "createdAt">>
): Promise<AdminArticle | null> {
  const update: Record<string, unknown> = {};

  if (data.title !== undefined) {
    update.title = data.title;
    update.slug = generateSlug(data.title);
  }
  if (data.summary !== undefined) update.summary = data.summary;
  if (data.content !== undefined) update.content = data.content;
  if (data.image !== undefined) update.image = data.image;
  if (data.category !== undefined) update.category = data.category;
  if (data.status !== undefined) update.status = data.status;
  if (data.tags !== undefined) update.tags = data.tags;
  if (data.isBreaking !== undefined) update.is_breaking = data.isBreaking;
  if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
  if (data.publishedAt !== undefined) update.published_at = data.publishedAt;
  if (data.authorId !== undefined) update.author_id = data.authorId;
  if (data.viewCount !== undefined) update.view_count = data.viewCount;

  const { data: updated, error } = await supabase
    .from("articles")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) return null;
  return rowToAdmin(updated as DbRow);
}

export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);

  return !error;
}

export async function searchArticlesAdmin(query: string): Promise<AdminArticle[]> {
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .or(`title.ilike.${q},summary.ilike.${q}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin);
}

export async function getArticleStats() {
  const { data: all, error } = await supabase
    .from("articles")
    .select("status, view_count");

  if (error) throw error;

  const rows = all as { status: string; view_count: number }[];
  const published = rows.filter((r) => r.status === "published");
  const drafts = rows.filter((r) => r.status === "draft");
  const totalViews = rows.reduce((sum, r) => sum + (r.view_count ?? 0), 0);

  return {
    total: rows.length,
    published: published.length,
    drafts: drafts.length,
    totalViews,
  };
}

// --- Public functions (returns only published articles as Article type) ---

export async function getAllPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;
  return adminToArticle(rowToAdmin(data as DbRow));
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}

export async function getBreakingNews(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_breaking", true)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}

export async function getMostReadArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(5);

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .or(`title.ilike.${q},summary.ilike.${q}`)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}

export async function getRelatedArticles(
  articleId: string,
  category: string
): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .neq("id", articleId)
    .order("published_at", { ascending: false })
    .limit(4);

  if (error) throw error;
  return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
}
