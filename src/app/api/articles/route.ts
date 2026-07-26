import { NextResponse } from "next/server";
import { getAllArticles, createArticle } from "@/lib/mockDb";

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Submitting Payload:", JSON.stringify(body, null, 2));

    const { title, summary, content, image, category, authorId, publishedAt, status, tags, isBreaking, isFeatured } = body;

    if (!title || !category) {
      console.error("Validation Error: Missing required fields", { title: !!title, category: !!category });
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    const article = await createArticle({
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
  } catch (err) {
    console.error("Supabase Database Error:", err);
    const message = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
