import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";

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
        { pnr: regex },
        { userEmail: regex },
        { contactName: regex },
        { contactEmail: regex },
      ];
    }
    if (status && status !== "ALL") {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("flightId")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus } = body;
    await connectDB();
    const updated = await Booking.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true }
    );
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
