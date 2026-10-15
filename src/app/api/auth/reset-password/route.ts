import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPasswordResetToken, hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited } from "@/lib/api-error";
import { z } from "zod";

const Schema = z.object({
  token: z.string().min(10, "Reset token is required"),
  password: z.string().min(4, "Password must be at least 4 characters").max(128),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "reset"), 5, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const decoded = verifyPasswordResetToken(parsed.data.token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired. Request a new one." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.sub);
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    user.passwordHash = await hashPassword(parsed.data.password);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated. You can now sign in." });
  } catch (error: unknown) {
    return serverError("Reset password error", error);
  }
}
