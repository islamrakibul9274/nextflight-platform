import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Flight } from "@/models/Flight";
import { Coupon } from "@/models/Coupon";
import { Payment } from "@/models/Payment";
import { getSessionUser } from "@/lib/auth";
import { generatePNR } from "@/lib/utils";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      flightId,
      returnFlightId,
      tripType = "ONE_WAY",
      cabinClass = "ECONOMY",
      passengers,
      contactName,
      contactEmail,
      contactPhone,
      couponCode,
      travelInsurance = false,
      carbonOffsetContribution = false,
      seatSelectionFee = 0,
      baggageFee = 0,
      stripePaymentIntentId,
      specialRequests,
    } = body;

    if (!flightId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: "Invalid booking request. Missing flight or passenger details." },
        { status: 400 }
      );
    }

    if (!contactEmail || !contactName) {
      return NextResponse.json(
        { error: "Contact name and email are required." },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch flight from DB to ensure authoritative pricing
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return NextResponse.json({ error: "Selected flight does not exist" }, { status: 404 });
    }

    // 2. Determine base fare based on cabin class
    let farePerPassenger = flight.basePrice;
    if (cabinClass === "PREMIUM_ECONOMY") farePerPassenger = flight.premiumEconomyPrice;
    if (cabinClass === "BUSINESS") farePerPassenger = flight.businessPrice;
    if (cabinClass === "FIRST") farePerPassenger = flight.firstPrice;

    const passengerCount = passengers.length;
    const totalBaseFare = farePerPassenger * passengerCount;
    const taxesAndFees = Math.round(totalBaseFare * 0.12);

    let addonsFee = 0;
    if (travelInsurance) addonsFee += 39 * passengerCount;
    if (carbonOffsetContribution) addonsFee += 12 * passengerCount;

    let discountAmount = 0;
    let validatedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        validUntil: { $gte: new Date() },
      });

      if (coupon) {
        validatedCoupon = coupon.code;
        if (coupon.discountType === "PERCENT") {
          discountAmount = Math.round((totalBaseFare * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        // Increment coupon usage
        coupon.timesUsed += 1;
        await coupon.save();
      }
    }

    // Check membership discount if logged in
    const session = await getSessionUser();
    if (session && session.membershipTier !== "VOYAGER" && !discountAmount) {
      const memberDiscountPct = session.membershipTier === "APEX" ? 20 : 15;
      discountAmount = Math.round((totalBaseFare * memberDiscountPct) / 100);
    }

    const calculatedTotal = Math.max(
      0,
      totalBaseFare + taxesAndFees + seatSelectionFee + baggageFee + addonsFee - discountAmount
    );

    const pnr = generatePNR();

    // 3. Create Booking in MongoDB
    const newBooking = await Booking.create({
      pnr,
      userId: session?.id || undefined,
      userEmail: contactEmail.toLowerCase(),
      contactName,
      contactEmail: contactEmail.toLowerCase(),
      contactPhone: contactPhone || "",
      flightId: flight._id,
      returnFlightId: returnFlightId || undefined,
      tripType,
      cabinClass,
      passengers,
      baseFare: totalBaseFare,
      taxesAndFees,
      seatSelectionFee,
      baggageFee,
      addonsFee,
      discountAmount,
      couponCode: validatedCoupon || undefined,
      totalAmount: calculatedTotal,
      currency: "USD",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      stripePaymentIntentId: stripePaymentIntentId || `pi_direct_${Date.now()}`,
      travelInsurance,
      carbonOffsetContribution,
      specialRequests,
    });

    // 4. Update available seats on flight
    const seatField =
      cabinClass === "FIRST"
        ? "firstSeatsAvailable"
        : cabinClass === "BUSINESS"
        ? "businessSeatsAvailable"
        : cabinClass === "PREMIUM_ECONOMY"
        ? "premiumEconomySeatsAvailable"
        : "economySeatsAvailable";

    const flightRecord = flight as unknown as Record<string, number>;
    if (flightRecord[seatField] >= passengerCount) {
      flightRecord[seatField] -= passengerCount;
      await flight.save();
    }

    // 5. Create Payment record
    await Payment.create({
      bookingId: newBooking._id,
      pnr: newBooking.pnr,
      userEmail: newBooking.userEmail,
      stripePaymentIntentId: stripePaymentIntentId || `pi_sim_${Date.now()}`,
      amount: calculatedTotal,
      currency: "USD",
      status: "SUCCEEDED",
      paymentMethod: "CARD",
    });

    // 6. Send e-ticket email notification via Resend in background
    try {
      await sendBookingConfirmationEmail({
        to: contactEmail,
        passengerName: `${passengers[0].firstName} ${passengers[0].lastName}`,
        pnr: newBooking.pnr,
        flightNumber: flight.flightNumber,
        origin: `${flight.originCity} (${flight.originAirport})`,
        destination: `${flight.destinationCity} (${flight.destinationAirport})`,
        departureTime: new Date(flight.departureTime).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        }),
        cabinClass,
        seatNumber: passengers[0].seatNumber || "Assigned at Gate",
        totalAmount: calculatedTotal,
        currency: "USD",
      });
    } catch (e) {
      console.warn("Email notification dispatch skipped:", e);
    }

    return NextResponse.json({
      success: true,
      booking: newBooking,
      pnr: newBooking.pnr,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to finalize flight booking" },
      { status: 500 }
    );
  }
}
