import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Flight } from "@/models/Flight";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { flightNumber: regex },
        { originAirport: regex },
        { destinationAirport: regex },
        { originCity: regex },
        { destinationCity: regex },
        { airlineName: regex },
      ];
    }
    if (status && status !== "ALL") {
      query.status = status;
    }

    const flights = await Flight.find(query).sort({ departureTime: 1 }).limit(100).lean();
    return NextResponse.json({ flights });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newFlight = await Flight.create(body);
    return NextResponse.json({ success: true, flight: newFlight });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    await connectDB();
    const updated = await Flight.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, flight: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectDB();
    await Flight.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
