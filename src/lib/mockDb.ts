import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { articles as seedArticles, type Article } from "@/data/articles";
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

const DB_DIR = join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "articles-db.json");

function articleToAdmin(a: Article): AdminArticle {
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
    status: "published",
    viewCount: a.viewCount,
    tags: a.tags,
    createdAt: a.publishedAt,
    updatedAt: a.publishedAt,
    isBreaking: a.isBreaking,
    isFeatured: a.isFeatured,
  };
}

function loadDb(): AdminArticle[] {
  try {
    if (existsSync(DB_PATH)) {
      const raw = readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw) as AdminArticle[];
    }
  } catch {
    // fall through to seed
  }
  const seeded = seedArticles.map(articleToAdmin);
  saveDb(seeded);
  return seeded;
}

function saveDb(data: AdminArticle[]): void {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
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

// --- Admin functions ---

export function getAllArticles(): AdminArticle[] {
  return loadDb();
}

export function getArticleById(id: string): AdminArticle | undefined {
  return loadDb().find((a) => a.id === id);
}

export function getArticleBySlugAdmin(slug: string): AdminArticle | undefined {
  return loadDb().find((a) => a.slug === slug);
}

export function createArticle(
  data: Omit<AdminArticle, "id" | "slug" | "createdAt" | "updatedAt" | "viewCount">
): AdminArticle {
  const articles = loadDb();
  const nextId = articles.length > 0
    ? Math.max(...articles.map((a) => Number(a.id))) + 1
    : 1;
  const now = new Date().toISOString();
  const article: AdminArticle = {
    ...data,
    id: String(nextId),
    slug: generateSlug(data.title),
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  articles.unshift(article);
  saveDb(articles);
  return article;
}

export function updateArticle(
  id: string,
  data: Partial<Omit<AdminArticle, "id" | "createdAt">>
): AdminArticle | null {
  const articles = loadDb();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const updated = {
    ...articles[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  if (data.title && data.title !== articles[index].title) {
    updated.slug = generateSlug(data.title);
  }
  articles[index] = updated;
  saveDb(articles);
  return updated;
}

export function deleteArticle(id: string): boolean {
  const articles = loadDb();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return false;
  articles.splice(index, 1);
  saveDb(articles);
  return true;
}

export function searchArticlesAdmin(query: string): AdminArticle[] {
  const q = query.toLowerCase();
  return loadDb().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getArticleStats() {
  const articles = loadDb();
  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");
  const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);
  return {
    total: articles.length,
    published: published.length,
    drafts: drafts.length,
    totalViews,
  };
}

// --- Public functions (returns only published articles as Article type) ---

function getPublishedArticles(): Article[] {
  return loadDb()
    .filter((a) => a.status === "published")
    .map(adminToArticle);
}

export function getAllPublishedArticles(): Article[] {
  return getPublishedArticles();
}

export function getArticleBySlug(slug: string): Article | undefined {
  const a = loadDb().find((a) => a.slug === slug);
  if (!a || a.status !== "published") return undefined;
  return adminToArticle(a);
}

export function getArticlesByCategory(category: string): Article[] {
  return getPublishedArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(): Article[] {
  return getPublishedArticles().filter((a) => a.isFeatured);
}

export function getBreakingNews(): Article[] {
  return getPublishedArticles().filter((a) => a.isBreaking);
}

export function getMostReadArticles(): Article[] {
  return [...getPublishedArticles()]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase();
  return getPublishedArticles().filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function getRelatedArticles(articleId: string, category: string): Article[] {
  return getPublishedArticles()
    .filter((a) => a.id !== articleId && a.category === category)
    .slice(0, 4);
}

// --- Visitor Tracking ---

interface VisitorEntry {
  ipHash: string;
  path: string;
  timestamp: string;
  date: string;
}

interface DailyCount {
  date: string;
  visitors: number;
  pageviews: number;
}

interface VisitorsDb {
  totalUniqueVisitors: number;
  totalPageviews: number;
  daily: DailyCount[];
  recent: VisitorEntry[];
  knownIps: string[];
}

const VISITORS_PATH = join(DB_DIR, "visitors-db.json");

function loadVisitorsDb(): VisitorsDb {
  try {
    if (existsSync(VISITORS_PATH)) {
      const raw = readFileSync(VISITORS_PATH, "utf-8");
      return JSON.parse(raw) as VisitorsDb;
    }
  } catch {
    // fall through
  }
  return {
    totalUniqueVisitors: 0,
    totalPageviews: 0,
    daily: [],
    recent: [],
    knownIps: [],
  };
}

function saveVisitorsDb(data: VisitorsDb): void {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
  writeFileSync(VISITORS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function trackVisitor(ipHash: string, path: string): void {
  const db = loadVisitorsDb();
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  const isNewVisitor = !db.knownIps.includes(ipHash);

  if (isNewVisitor) {
    db.knownIps.push(ipHash);
    db.totalUniqueVisitors++;
  }

  db.totalPageviews++;

  let dayEntry = db.daily.find((d) => d.date === today);
  if (!dayEntry) {
    dayEntry = { date: today, visitors: 0, pageviews: 0 };
    db.daily.push(dayEntry);
  }
  if (isNewVisitor) dayEntry.visitors++;
  dayEntry.pageviews++;

  // Keep only last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  db.daily = db.daily.filter((d) => d.date >= cutoffStr);

  // Add to recent (keep last 100)
  db.recent.unshift({ ipHash: ipHash.slice(0, 8), path, timestamp: now, date: today });
  if (db.recent.length > 100) db.recent = db.recent.slice(0, 100);

  saveVisitorsDb(db);
}

export interface VisitorStats {
  totalUniqueVisitors: number;
  totalPageviews: number;
  todayVisitors: number;
  todayPageviews: number;
  yesterdayVisitors: number;
  yesterdayPageviews: number;
  daily: DailyCount[];
  recent: VisitorEntry[];
}

export function getVisitorStats(): VisitorStats {
  const db = loadVisitorsDb();
  const today = new Date().toISOString().slice(0, 10);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const todayEntry = db.daily.find((d) => d.date === today);
  const yesterdayEntry = db.daily.find((d) => d.date === yesterdayStr);

  return {
    totalUniqueVisitors: db.totalUniqueVisitors,
    totalPageviews: db.totalPageviews,
    todayVisitors: todayEntry?.visitors || 0,
    todayPageviews: todayEntry?.pageviews || 0,
    yesterdayVisitors: yesterdayEntry?.visitors || 0,
    yesterdayPageviews: yesterdayEntry?.pageviews || 0,
    daily: db.daily.slice(-14),
    recent: db.recent.slice(0, 20),
  };
}
