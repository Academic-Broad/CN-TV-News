import { NextResponse } from "next/server";
import { trackVisitor } from "@/lib/mockDb";

export async function POST(request: Request) {
  try {
    const { path, ip } = await request.json();

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Create a simple hash from IP to track unique visitors
    const rawIp = ip || request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = Buffer.from(rawIp).toString("base64url").slice(0, 16);

    trackVisitor(ipHash, path);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
