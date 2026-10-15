import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { forbidden } from "@/lib/api-error";

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Seeding is disabled. Use local scripts with ADMIN credentials." },
    { status: 403 }
  );
}

export async function POST(req: Request) {
  try {
    if (process.env.NODE_ENV === "production") {
      return forbidden("Seeding is disabled in production");
    }
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");

    const { seedDatabase } = await import("@/lib/seed");
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Seed error:", err);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { success: false, error: isProd ? "Failed to seed database" : err.message },
      { status: 500 }
    );
  }
}
