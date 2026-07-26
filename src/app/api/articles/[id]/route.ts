import { NextResponse } from "next/server";
import { getArticleById, deleteArticle } from "@/lib/mockDb";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) {
      update.title = body.title;
      update.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") + "-" + Date.now();
    }
    if (body.summary !== undefined) update.summary = body.summary;
    if (body.content !== undefined) update.content = body.content;
    if (body.image !== undefined) update.image = body.image;
    if (body.category !== undefined) update.category = body.category;
    if (body.status !== undefined) update.status = body.status;
    if (body.tags !== undefined) update.tags = body.tags;

    const { data, error } = await supabase
      .from("articles")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected Update Error:", err);
    const message = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteArticle(id);
  if (!deleted) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
