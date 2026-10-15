import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Flight } from "@/models/Flight";
import { Airport } from "@/models/Airport";
import { Aircraft } from "@/models/Aircraft";
import { serverError } from "@/lib/api-error";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid flight id" }, { status: 400 });
    }
    await connectDB();

    const flight = await Flight.findById(id).lean();
    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    const [originAirport, destAirport, aircraft] = await Promise.all([
      Airport.findOne({ iataCode: flight.originAirport }).lean(),
      Airport.findOne({ iataCode: flight.destinationAirport }).lean(),
      Aircraft.findOne({ model: flight.aircraftModel }).lean(),
    ]);

    return NextResponse.json({
      flight,
      originAirport,
      destAirport,
      aircraft,
    });
  } catch (error: unknown) {
    return serverError("Get flight error", error);
  }
}
