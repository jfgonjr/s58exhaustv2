import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data?.email || !data?.name) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  // Connect your CRM / email service here (Resend, Formspree, etc.).
  console.log("Divina inquiry:", data);
  return NextResponse.json({ ok: true });
}
