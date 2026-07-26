import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/mockDb";
import { supabase } from "@/lib/supabase";

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

    if (!body.title || !body.category) {
      console.error("Validation Error: Missing required fields", { title: !!body.title, category: !!body.category });
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      );
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-" + Date.now();

    const payload = {
      title: body.title,
      slug,
      category: body.category || "General",
      content: body.content || "",
      summary: body.summary || body.content?.replace(/<[^>]+>/g, "").substring(0, 150) || "",
      image: body.image || "",
      status: "published" as const,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("articles")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Supabase Database Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected Error:", err);
    const message = err instanceof Error ? err.message : "Invalid request body";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
