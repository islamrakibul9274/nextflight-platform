import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Seed error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Seed error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
