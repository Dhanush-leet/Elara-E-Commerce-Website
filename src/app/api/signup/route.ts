import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim();
  const password = body?.password;

  if (!name || !email || !email.includes("@") || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Provide a name, valid email, and a password of at least 6 characters." },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(name, email, password);
    return NextResponse.json({ ok: true, email: user.email });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not create account." },
      { status: 409 }
    );
  }
}
