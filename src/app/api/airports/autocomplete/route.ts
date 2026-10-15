import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airport } from "@/models/Airport";
import { serverError } from "@/lib/api-error";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim().slice(0, 40) || "";

    await connectDB();

    if (!query) {
      const popular = await Airport.find({ isPopular: true }).limit(10).lean();
      return NextResponse.json({ airports: popular });
    }

    const regex = new RegExp(escapeRegExp(query), "i");
    const airports = await Airport.find({
      $or: [{ iataCode: regex }, { city: regex }, { name: regex }, { country: regex }],
    })
      .limit(12)
      .lean();

    return NextResponse.json({ airports });
  } catch (error: unknown) {
    return serverError("Airport autocomplete error", error);
  }
}
