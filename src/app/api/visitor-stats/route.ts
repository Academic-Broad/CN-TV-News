import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getVisitorStats } from "@/lib/mockDb";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = getVisitorStats();
  return NextResponse.json(stats);
}
