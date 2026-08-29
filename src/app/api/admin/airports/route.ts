import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Airport } from "@/models/Airport";

export async function GET() {
  try {
    await connectDB();
    const airports = await Airport.find({}).sort({ city: 1 }).lean();
    return NextResponse.json({ airports });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const airport = await Airport.create({
      ...body,
      iataCode: body.iataCode.trim().toUpperCase(),
      countryCode: body.countryCode.trim().toUpperCase(),
    });
    return NextResponse.json({ success: true, airport });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
