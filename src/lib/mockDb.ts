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
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `article-${Date.now()}`;
}

// --- Admin functions ---

export async function getAllArticles(): Promise<AdminArticle[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin);
  } catch (err) {
    console.error("Failed to fetch all articles:", err);
    return [];
  }
}

export async function getArticleById(id: string): Promise<AdminArticle | undefined> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;
    return rowToAdmin(data as DbRow);
  } catch (err) {
    console.error("Failed to fetch article by id:", err);
    return undefined;
  }
}

export async function getArticleBySlugAdmin(slug: string): Promise<AdminArticle | undefined> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return undefined;
    return rowToAdmin(data as DbRow);
  } catch (err) {
    console.error("Failed to fetch article by slug:", err);
    return undefined;
  }
}

export async function createArticle(
  data: Omit<AdminArticle, "id" | "slug" | "createdAt" | "updatedAt" | "viewCount">
): Promise<AdminArticle> {
  const now = new Date().toISOString();
  let slug = generateSlug(data.title);

  try {
    const { data: existing } = await supabase
      .from("articles")
      .select("slug")
      .like("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length}`;
    }
  } catch {
    // If slug check fails, proceed with generated slug
  }

  const row = {
    title: data.title,
    slug,
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

  try {
    const { data: inserted, error } = await supabase
      .from("articles")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Error creating article:", error.message);
      throw error;
    }
    return rowToAdmin(inserted as DbRow);
  } catch (err) {
    console.error("Failed to create article:", err);
    throw err;
  }
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

  try {
    const { data: updated, error } = await supabase
      .from("articles")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) return null;
    return rowToAdmin(updated as DbRow);
  } catch (err) {
    console.error("Failed to update article:", err);
    return null;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting article:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to delete article:", err);
    return false;
  }
}

export async function searchArticlesAdmin(query: string): Promise<AdminArticle[]> {
  try {
    const q = `%${query}%`;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .or(`title.ilike.${q},summary.ilike.${q}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin);
  } catch (err) {
    console.error("Failed to search articles:", err);
    return [];
  }
}

export async function getArticleStats() {
  try {
    const { data: all, error } = await supabase
      .from("articles")
      .select("status, view_count");

    if (error) {
      console.error("Error fetching article stats:", error.message);
      return { total: 0, published: 0, drafts: 0, totalViews: 0 };
    }

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
  } catch (err) {
    console.error("Failed to fetch article stats:", err);
    return { total: 0, published: 0, drafts: 0, totalViews: 0 };
  }
}

// --- Public functions (returns only published articles as Article type) ---

export async function getAllPublishedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching published articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to fetch published articles:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) return undefined;
    return adminToArticle(rowToAdmin(data as DbRow));
  } catch (err) {
    console.error("Failed to fetch article by slug:", err);
    return undefined;
  }
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("category", category)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles by category:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to fetch articles by category:", err);
    return [];
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to fetch featured articles:", err);
    return [];
  }
}

export async function getBreakingNews(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .eq("is_breaking", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching breaking news:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to fetch breaking news:", err);
    return [];
  }
}

export async function getMostReadArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("view_count", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching most read articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to fetch most read articles:", err);
    return [];
  }
}

export async function searchArticles(query: string): Promise<Article[]> {
  try {
    const q = `%${query}%`;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .or(`title.ilike.${q},summary.ilike.${q}`)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error searching articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to search articles:", err);
    return [];
  }
}

export async function getRelatedArticles(
  articleId: string,
  category: string
): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("category", category)
      .eq("status", "published")
      .neq("id", articleId)
      .order("published_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error("Error fetching related articles:", error.message);
      return [];
    }
    return (data as DbRow[]).map(rowToAdmin).map(adminToArticle);
  } catch (err) {
    console.error("Failed to fetch related articles:", err);
    return [];
  }
}
