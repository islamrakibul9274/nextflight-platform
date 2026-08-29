import { NextResponse } from "next/server";
import { askAetheriaConcierge } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const reply = await askAetheriaConcierge(messages);
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("AI Concierge error:", err);
    return NextResponse.json({ error: err.message || "Concierge temporary offline" }, { status: 500 });
  }
}
