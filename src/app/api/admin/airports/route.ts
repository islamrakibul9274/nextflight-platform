import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airport } from "@/models/Airport";
import { requireAdmin } from "@/lib/auth";
import { serverError, forbidden, badRequest } from "@/lib/api-error";
import { z } from "zod";

const AirportSchema = z.object({
  iataCode: z.string().trim().length(3),
  icaoCode: z.string().trim().max(5).optional(),
  name: z.string().trim().min(3).max(150),
  city: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(100),
  countryCode: z.string().trim().length(2),
  timezone: z.string().trim().max(60).optional().default("UTC"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export async function GET() {
  try {
    await connectDB();
    const airports = await Airport.find({}).sort({ city: 1 }).lean();
    return NextResponse.json({ airports });
  } catch (error: unknown) {
    return serverError("Airports error", error);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const body = await req.json();
    const parsed = AirportSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    await connectDB();
    const airport = await Airport.create({
      ...parsed.data,
      iataCode: parsed.data.iataCode.trim().toUpperCase(),
      countryCode: parsed.data.countryCode.trim().toUpperCase(),
    });
    return NextResponse.json({ success: true, airport });
  } catch (error: unknown) {
    return serverError("Airport create error", error);
  }
}
