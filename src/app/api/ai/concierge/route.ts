import { NextRequest, NextResponse } from "next/server";
import { askNextFlightConcierge } from "@/lib/groq";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, badRequest } from "@/lib/api-error";
import { z } from "zod";

const MsgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const Schema = z.object({
  messages: z.array(MsgSchema).min(1).max(20),
});

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(getClientKey(req, "concierge"), 20, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success)
      return badRequest("Messages array (max 20, 2000 chars each) is required");

    const reply = await askNextFlightConcierge(parsed.data.messages);
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    return serverError("AI Concierge error", error);
  }
}
