import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Flight } from "@/models/Flight";
import { Airport } from "@/models/Airport";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ pnr: string }> }
) {
  try {
    const { pnr } = await params;
    await connectDB();

    const booking = await Booking.findOne({ pnr: pnr.trim().toUpperCase() })
      .populate("flightId")
      .populate("returnFlightId")
      .lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking reference (PNR) not found" }, { status: 404 });
    }

    const flight = booking.flightId as unknown as { originAirport: string; destinationAirport: string };
    const [originAirport, destAirport] = await Promise.all([
      Airport.findOne({ iataCode: flight.originAirport }).lean(),
      Airport.findOne({ iataCode: flight.destinationAirport }).lean(),
    ]);

    return NextResponse.json({
      booking,
      originAirport,
      destAirport,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Get booking error:", err);
    return NextResponse.json({ error: err.message || "Failed to retrieve booking" }, { status: 500 });
  }
}

// Cancel Booking & Automated Refund Calculation
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ pnr: string }> }
) {
  try {
    const { pnr } = await params;
    await connectDB();

    const booking = await Booking.findOne({ pnr: pnr.trim().toUpperCase() }).populate("flightId");

    if (!booking) {
      return NextResponse.json({ error: "Booking reference not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED" || booking.status === "REFUNDED") {
      return NextResponse.json(
        { error: "This flight booking is already cancelled" },
        { status: 400 }
      );
    }

    // Refund policy calculation:
    // Business/First or TravelInsurance: 100% refund
    // Economy: 85% refund ($50 administrative cancellation fee)
    const isFullRefund =
      booking.cabinClass === "BUSINESS" ||
      booking.cabinClass === "FIRST" ||
      booking.travelInsurance === true;

    const refundAmount = isFullRefund
      ? booking.totalAmount
      : Math.max(0, booking.totalAmount - 50);

    booking.status = "CANCELLED";
    booking.paymentStatus = "REFUNDED";
    await booking.save();

    // Release flight seats back
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
    const err = error as Error;
    console.error("Cancel booking error:", err);
    return NextResponse.json({ error: err.message || "Failed to cancel booking" }, { status: 500 });
  }
}
