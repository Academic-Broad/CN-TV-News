/**
 * Seed script — populates the Supabase `articles` table with the 20 seed articles.
 *
 * Usage:
 *   1. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local
 *   2. Run:  npx tsx scripts/seed-supabase.ts
 */
import { createClient } from "@supabase/supabase-js";
import { articles } from "../src/data/articles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function seed() {
  console.log(`Seeding ${articles.length} articles into Supabase...`);

  const rows = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug || generateSlug(a.title),
    category: a.category,
    content: a.content,
    summary: a.summary,
    image: a.image,
    status: "published" as const,
    author_id: a.authorId,
    tags: a.tags,
    view_count: a.viewCount,
    is_breaking: a.isBreaking,
    is_featured: a.isFeatured,
    published_at: a.publishedAt,
    created_at: a.publishedAt,
    updated_at: a.publishedAt,
  }));

  const { error } = await supabase.from("articles").upsert(rows, {
    onConflict: "slug",
  });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log("Seed complete! Inserted/upserted", rows.length, "articles.");
}

seed();
