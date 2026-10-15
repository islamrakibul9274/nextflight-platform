import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import "@/models/Flight"; // register schema for populate("flightId", "returnFlightId")
import { getCurrentUserFromDb } from "@/lib/auth";
import { serverError, unauthorized } from "@/lib/api-error";

export async function GET() {
  try {
    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) return unauthorized("Sign in to view your trips");

    await connectDB();

    const bookings = await Booking.find({
      $or: [{ userId: dbUser._id }, { userEmail: dbUser.email.toLowerCase() }],
    })
      .populate("flightId")
      .populate("returnFlightId")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings });
  } catch (error: unknown) {
    return serverError("My trips error", error);
  }
}
