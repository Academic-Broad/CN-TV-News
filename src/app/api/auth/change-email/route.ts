import { NextResponse } from "next/server";
import { getSession, changeAdminEmail, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newEmail } = await request.json();

    if (!currentPassword || !newEmail) {
      return NextResponse.json(
        { error: "Current password and new email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (newEmail === session.email) {
      return NextResponse.json(
        { error: "New email must be different from current email" },
        { status: 400 }
      );
    }

    const result = await changeAdminEmail(currentPassword, newEmail, session.email);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update email" },
        { status: 400 }
      );
    }

    const newToken = await createSession(newEmail);
    await setSessionCookie(newToken);

    return NextResponse.json({ success: true, message: "Email updated successfully", email: newEmail });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
