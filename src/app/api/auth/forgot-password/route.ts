import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signPasswordResetToken } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited } from "@/lib/api-error";
import { z } from "zod";

const Schema = z.object({ email: z.string().trim().email("Enter a valid email address") });

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "forgot"), 5, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email.toLowerCase() });

    // Always return success to avoid email enumeration.
    if (user) {
      const token = signPasswordResetToken(user._id.toString(), user.email);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetLink = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "NextFlight <onboarding@resend.dev>",
            to: user.email,
            subject: "Reset your NextFlight password",
            html: `<p>Hello ${user.name || "traveler"},</p><p>Reset your password (expires in 15 minutes):</p><p><a href="${resetLink}">Reset password</a></p>`,
          });
        } catch (e) {
          console.error("Forgot-password email error:", e);
        }
      } else {
        console.log(`[Password reset] ${user.email}: ${resetLink}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists for that email, a reset link was sent.",
    });
  } catch (error: unknown) {
    return serverError("Forgot password error", error);
  }
}
