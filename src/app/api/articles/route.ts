import { NextResponse } from "next/server";
import { getAllArticles, createArticle } from "@/lib/mockDb";

export async function GET() {
  const articles = getAllArticles();
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, summary, content, image, category, authorId, publishedAt, status, tags, isBreaking, isFeatured } = body;

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    const article = createArticle({
      title,
      summary: summary || "",
      content: content || "",
      image: image || "",
      category,
      authorId: authorId || "admin",
      publishedAt: publishedAt || new Date().toISOString(),
      status: status || "draft",
      tags: tags || [],
      isBreaking: isBreaking || false,
      isFeatured: isFeatured || false,
    });

    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
