import { NextRequest, NextResponse } from "next/server";
import { askNextFlightConcierge } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const reply = await askNextFlightConcierge(messages);
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("AI Concierge error:", err);
    return NextResponse.json({ error: err.message || "Concierge temporary offline" }, { status: 500 });
  }
}
