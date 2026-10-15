import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Flight } from "@/models/Flight";
import { Airport } from "@/models/Airport";
import { getCurrentUserFromDb } from "@/lib/auth";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, forbidden, unauthorized } from "@/lib/api-error";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pnr: string }> }
) {
  try {
    const rl = checkRateLimit(getClientKey(req, "pnr-get"), 30, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const { pnr } = await params;
    if (!pnr || pnr.trim().length < 3) {
      return NextResponse.json({ error: "Invalid booking reference" }, { status: 400 });
    }
    await connectDB();

    const booking = await Booking.findOne({ pnr: pnr.trim().toUpperCase() })
      .populate("flightId")
      .populate("returnFlightId")
      .lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking reference (PNR) not found" }, { status: 404 });
    }

    const flight = booking.flightId as unknown as { originAirport: string; destinationAirport: string } | null;
    let originAirport = null;
    let destAirport = null;
    if (flight?.originAirport) {
      [originAirport, destAirport] = await Promise.all([
        Airport.findOne({ iataCode: flight.originAirport }).lean(),
        Airport.findOne({ iataCode: flight.destinationAirport }).lean(),
      ]);
    }

    return NextResponse.json({
      booking,
      originAirport,
      destAirport,
    });
  } catch (error: unknown) {
    return serverError("Get booking error", error);
  }
}

// Cancel Booking & Automated Refund Calculation — requires owner or admin
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ pnr: string }> }
) {
  try {
    const dbUser = await getCurrentUserFromDb();
    if (!dbUser) return unauthorized("Sign in to cancel a booking");

    const { pnr } = await params;
    await connectDB();

    const booking = await Booking.findOne({ pnr: pnr.trim().toUpperCase() }).populate("flightId");

    if (!booking) {
      return NextResponse.json({ error: "Booking reference not found" }, { status: 404 });
    }

    const isOwner =
      (booking.userId && booking.userId.toString() === dbUser._id.toString()) ||
      booking.userEmail.toLowerCase() === dbUser.email.toLowerCase() ||
      booking.contactEmail.toLowerCase() === dbUser.email.toLowerCase();
    if (!isOwner && dbUser.role !== "ADMIN") {
      return forbidden("You do not own this booking");
    }

    if (booking.status === "CANCELLED" || booking.status === "REFUNDED") {
      return NextResponse.json(
        { error: "This flight booking is already cancelled" },
        { status: 400 }
      );
    }

    const membershipActive =
      (dbUser.membershipTier === "STRATOSPHERE" || dbUser.membershipTier === "APEX") &&
      (!dbUser.membershipExpiresAt || new Date(dbUser.membershipExpiresAt).getTime() >= Date.now());
    const isFullRefund =
      booking.cabinClass === "BUSINESS" ||
      booking.cabinClass === "FIRST" ||
      booking.travelInsurance === true ||
      membershipActive;

    const refundAmount = isFullRefund
      ? booking.totalAmount
      : Math.max(0, booking.totalAmount - 50);

    booking.status = "CANCELLED";
    booking.paymentStatus = booking.paymentStatus === "PAID" ? "REFUNDED" : booking.paymentStatus;
    await booking.save();

    if (booking.flightId) {
      const flight = await Flight.findById(booking.flightId);
      if (flight) {
        const count = booking.passengers.length;
        if (booking.cabinClass === "BUSINESS") flight.businessSeatsAvailable += count;
        else if (booking.cabinClass === "FIRST") flight.firstSeatsAvailable += count;
        else if (booking.cabinClass === "PREMIUM_ECONOMY")
          flight.premiumEconomySeatsAvailable += count;
        else flight.economySeatsAvailable += count;
        await flight.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${pnr} cancelled successfully. Refund of $${refundAmount} processed to original payment method.`,
      refundAmount,
      booking,
    });
  } catch (error: unknown) {
    return serverError("Cancel booking error", error);
  }
}
