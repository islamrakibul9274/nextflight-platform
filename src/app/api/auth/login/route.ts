import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { verifyPassword, signToken, getAuthCookieFlags, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited } from "@/lib/api-error";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "login"), 10, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = parsed.data;

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken(user, rememberMe);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipTier: user.membershipTier,
        avatar: user.avatar,
        homeAirport: user.homeAirport,
        preferredCurrency: user.preferredCurrency,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieFlags(rememberMe));

    return response;
  } catch (error: unknown) {
    return serverError("Login error", error);
  }
}
