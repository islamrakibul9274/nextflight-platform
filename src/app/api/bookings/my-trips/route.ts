import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const emailQuery = searchParams.get("email");

    const email = session?.email || emailQuery;

    if (!email) {
      return NextResponse.json({ bookings: [] });
    }

    await connectDB();

    const bookings = await Booking.find({ userEmail: email.toLowerCase() })
      .populate("flightId")
      .populate("returnFlightId")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("My trips error:", err);
    return NextResponse.json({ bookings: [], error: err.message }, { status: 500 });
  }
}
