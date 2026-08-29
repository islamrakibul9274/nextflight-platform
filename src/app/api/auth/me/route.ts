import { NextResponse } from "next/server";
import { getSessionUser, getCurrentUserFromDb } from "@/lib/auth";

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
    const err = error as Error;
    console.error("Auth me error:", err);
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
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
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // @ts-expect-error field is validated
        dbUser[field] = body[field];
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
    const err = error as Error;
    console.error("Update profile error:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
