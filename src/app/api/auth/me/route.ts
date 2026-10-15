import { NextResponse } from "next/server";
import { getSessionUser, getCurrentUserFromDb } from "@/lib/auth";
import { serverError, unauthorized } from "@/lib/api-error";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80).optional(),
  phone: z.string().trim().max(30).optional(),
  dateOfBirth: z.string().trim().max(20).optional(),
  nationality: z.string().trim().max(60).optional(),
  preferredCurrency: z.string().trim().max(10).optional(),
  preferredLanguage: z.string().trim().max(10).optional(),
  homeAirport: z.string().trim().max(10).optional(),
  seatPreference: z.enum(["WINDOW", "AISLE", "ANY"]).optional(),
  mealPreference: z
    .enum(["STANDARD", "VEGAN", "HALAL", "KOSHER", "GLUTEN_FREE"])
    .optional(),
  avatar: z.string().trim().max(500).optional(),
});

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        membershipTier: dbUser.membershipTier,
        membershipExpiresAt: dbUser.membershipExpiresAt,
        avatar: dbUser.avatar,
        phone: dbUser.phone,
        dateOfBirth: dbUser.dateOfBirth,
        nationality: dbUser.nationality,
        preferredCurrency: dbUser.preferredCurrency,
        preferredLanguage: dbUser.preferredLanguage,
        homeAirport: dbUser.homeAirport,
        seatPreference: dbUser.seatPreference,
        mealPreference: dbUser.mealPreference,
      },
    });
  } catch (error: unknown) {
    return serverError("Auth me error", error);
  }
}

export async function PUT(req: Request) {
  try {
    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) {
      return unauthorized();
    }

    const body = await req.json();
    if (body.role !== undefined || body.membershipTier !== undefined) {
      return NextResponse.json(
        { error: "Role and tier changes are not allowed here. Use membership checkout or contact an admin." },
        { status: 403 }
      );
    }
    const parsed = ProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const allowedFields = [
      "name",
      "phone",
      "dateOfBirth",
      "nationality",
      "preferredCurrency",
      "preferredLanguage",
      "homeAirport",
      "seatPreference",
      "mealPreference",
      "avatar",
    ] as const;

    for (const field of allowedFields) {
      const value = parsed.data[field];
      if (value !== undefined) {
        // @ts-expect-error field is validated
        dbUser[field] = value;
      }
    }

    await dbUser.save();

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        membershipTier: dbUser.membershipTier,
        avatar: dbUser.avatar,
        phone: dbUser.phone,
        dateOfBirth: dbUser.dateOfBirth,
        nationality: dbUser.nationality,
        preferredCurrency: dbUser.preferredCurrency,
        preferredLanguage: dbUser.preferredLanguage,
        homeAirport: dbUser.homeAirport,
        seatPreference: dbUser.seatPreference,
        mealPreference: dbUser.mealPreference,
      },
    });
  } catch (error: unknown) {
    return serverError("Update profile error", error);
  }
}
