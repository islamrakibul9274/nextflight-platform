import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import { User, IUser } from "@/models/User";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is not configured. Refusing to sign tokens with a fallback in production.");
  }
  console.warn("[auth] JWT_SECRET missing — using dev-only fallback. Set JWT_SECRET in .env.local.");
  return "dev-only-insecure-secret-do-not-use-in-prod";
}

const JWT_SECRET_LAZY = () => getJwtSecret();

export const AUTH_COOKIE_NAME = "aetheria_token";

export function getAuthCookieFlags(rememberMe = true) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24, // 7 days vs 1 day
    path: "/",
  };
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  membershipTier: "VOYAGER" | "STRATOSPHERE" | "APEX";
  avatar?: string;
  homeAirport?: string;
  preferredCurrency?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: IUser | SessionUser, rememberMe = true): string {
  const payload: SessionUser = {
    id: (user as IUser)._id ? (user as IUser)._id.toString() : (user as SessionUser).id,
    name: user.name,
    email: user.email,
    role: user.role,
    membershipTier: user.membershipTier,
    avatar: user.avatar,
    homeAirport: user.homeAirport,
    preferredCurrency: user.preferredCurrency,
  };

  return jwt.sign(payload, JWT_SECRET_LAZY(), { expiresIn: rememberMe ? "7d" : "1d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET_LAZY()) as SessionUser;
  } catch {
    return null;
  }
}

export function signPasswordResetToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email, purpose: "password-reset" }, JWT_SECRET_LAZY(), {
    expiresIn: "15m",
  });
}

export function verifyPasswordResetToken(token: string): { sub: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_LAZY()) as {
      sub: string;
      email: string;
      purpose?: string;
    };
    if (decoded.purpose !== "password-reset" || !decoded.sub) return null;
    return { sub: decoded.sub, email: decoded.email };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded) return null;

    return decoded;
  } catch {
    return null;
  }
}

export async function getCurrentUserFromDb(): Promise<IUser | null> {
  const session = await getSessionUser();
  if (!session?.id) return null;

  await connectDB();
  const dbUser = await User.findById(session.id).select("-passwordHash");
  if (!dbUser) return null;

  // Lazy expiry: paid tiers fall back to VOYAGER once expired
  if (
    dbUser.membershipTier !== "VOYAGER" &&
    dbUser.membershipExpiresAt &&
    new Date(dbUser.membershipExpiresAt).getTime() < Date.now()
  ) {
    dbUser.membershipTier = "VOYAGER";
    dbUser.membershipExpiresAt = undefined;
    await dbUser.save();
  }
  return dbUser;
}

/** Server-side guard: returns DB user or null. Never trusts JWT role alone. */
export async function requireAdmin(): Promise<IUser | null> {
  const dbUser = await getCurrentUserFromDb();
  if (!dbUser || dbUser.role !== "ADMIN") return null;
  return dbUser;
}
