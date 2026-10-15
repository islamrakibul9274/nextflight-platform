import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signToken, getAuthCookieFlags, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited } from "@/lib/api-error";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters").max(128, "Password is too long"),
  phone: z.string().trim().max(30, "Phone number is too long").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "register"), 5, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;

    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      phone: phone?.trim() || undefined,
      role: "USER",
      membershipTier: "VOYAGER",
    });

    const token = signToken(user, true);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipTier: user.membershipTier,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieFlags(true));

    return response;
  } catch (error: unknown) {
    return serverError("Register error", error);
  }
}
