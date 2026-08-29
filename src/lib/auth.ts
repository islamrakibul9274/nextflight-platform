import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import { User, IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || "aetheria-super-secret-key-2026";

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

export function signToken(user: IUser | SessionUser): string {
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

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("aetheria_token")?.value;

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
  return User.findById(session.id).select("-passwordHash");
}
