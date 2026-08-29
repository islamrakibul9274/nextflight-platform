import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airport } from "@/models/Airport";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    await connectDB();

    if (!query) {
      // Return popular airports by default
      const popular = await Airport.find({ isPopular: true }).limit(10).lean();
      return NextResponse.json({ airports: popular });
    }

    const regex = new RegExp(query, "i");
    const airports = await Airport.find({
      $or: [{ iataCode: regex }, { city: regex }, { name: regex }, { country: regex }],
    })
      .limit(12)
      .lean();

    return NextResponse.json({ airports });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Airport autocomplete error:", err);
    return NextResponse.json({ airports: [], error: err.message }, { status: 500 });
  }
}
