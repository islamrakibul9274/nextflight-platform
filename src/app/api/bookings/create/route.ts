import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Flight } from "@/models/Flight";
import { Coupon } from "@/models/Coupon";
import { Payment } from "@/models/Payment";
import { getSessionUser } from "@/lib/auth";
import { generatePNR } from "@/lib/utils";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { verifyPaymentIntent } from "@/lib/stripe";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, badRequest } from "@/lib/api-error";
import { z } from "zod";

const PassengerSchema = z.object({
  firstName: z.string().trim().min(1, "Passenger first name is required").max(60),
  lastName: z.string().trim().min(1, "Passenger last name is required").max(60),
  dateOfBirth: z.string().trim().min(4, "Passenger date of birth is required").max(20),
  passportNumber: z.string().trim().min(4, "Passport number is required").max(30),
  passportExpiry: z.string().trim().min(4, "Passport expiry date is required").max(20),
  seatNumber: z.string().trim().max(10).optional(),
  type: z.enum(["ADULT", "CHILD", "INFANT"]).optional().default("ADULT"),
});

const CreateSchema = z.object({
  flightId: z.string().min(1),
  returnFlightId: z.string().min(1).optional(),
  tripType: z.enum(["ONE_WAY", "ROUND_TRIP", "MULTI_CITY"]).optional().default("ONE_WAY"),
  cabinClass: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).optional().default("ECONOMY"),
  passengers: z.array(PassengerSchema).min(1).max(9),
  contactName: z.string().trim().min(2).max(120),
  contactEmail: z.string().trim().email(),
  contactPhone: z.string().trim().max(30).optional().default(""),
  couponCode: z.string().trim().max(30).optional(),
  travelInsurance: z.boolean().optional().default(false),
  carbonOffsetContribution: z.boolean().optional().default(false),
  seatSelectionFee: z.number().min(0).max(5000).optional().default(0),
  baggageFee: z.number().min(0).max(5000).optional().default(0),
  stripePaymentIntentId: z.string().trim().max(100).optional(),
  specialRequests: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "booking-create"), 15, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    const data = parsed.data;

    if (data.tripType === "ROUND_TRIP" && !data.returnFlightId) {
      return badRequest("Return flight is required for round trips");
    }

    await connectDB();

    const flight = await Flight.findById(data.flightId);
    if (!flight) {
      return NextResponse.json({ error: "Selected flight does not exist" }, { status: 404 });
    }

    let farePerPassenger = flight.basePrice;
    if (data.cabinClass === "PREMIUM_ECONOMY") farePerPassenger = flight.premiumEconomyPrice;
    if (data.cabinClass === "BUSINESS") farePerPassenger = flight.businessPrice;
    if (data.cabinClass === "FIRST") farePerPassenger = flight.firstPrice;

    const passengerCount = data.passengers.length;
    const totalBaseFare = farePerPassenger * passengerCount;
    const taxesAndFees = Math.round(totalBaseFare * 0.12);

    let addonsFee = 0;
    if (data.travelInsurance) addonsFee += 39 * passengerCount;
    if (data.carbonOffsetContribution) addonsFee += 12 * passengerCount;

    let discountAmount = 0;
    let validatedCoupon: string | undefined;

    if (data.couponCode) {
      const code = data.couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOneAndUpdate(
        {
          code,
          isActive: true,
          validUntil: { $gte: new Date() },
          $expr: { $lt: ["$timesUsed", "$usageLimit"] },
        },
        { $inc: { timesUsed: 1 } },
        { new: true }
      );
      if (coupon) {
        validatedCoupon = coupon.code;
        if (coupon.discountType === "PERCENT") {
          discountAmount = Math.round((totalBaseFare * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = Math.min(coupon.discountValue, totalBaseFare);
        }
      }
    }

    const session = await getSessionUser();
    // Use the DB tier (not the JWT claim) so freshly purchased memberships apply immediately
    let memberTier: "VOYAGER" | "STRATOSPHERE" | "APEX" = session?.membershipTier || "VOYAGER";
    if (session?.id) {
      const { User } = await import("@/models/User");
      const member = await User.findById(session.id).select("membershipTier membershipExpiresAt").lean();
      if (member) {
        const expired =
          member.membershipTier !== "VOYAGER" &&
          member.membershipExpiresAt &&
          new Date(member.membershipExpiresAt).getTime() < Date.now();
        memberTier = expired ? "VOYAGER" : member.membershipTier;
      }
    }
    if (memberTier !== "VOYAGER" && !discountAmount) {
      const pct = memberTier === "APEX" ? 20 : 15;
      discountAmount = Math.round((totalBaseFare * pct) / 100);
    }

    // Stratosphere/Apex perk: complimentary seat selection
    const seatSelectionFee = memberTier !== "VOYAGER" ? 0 : data.seatSelectionFee;

    const calculatedTotal = Math.max(
      0,
      totalBaseFare + taxesAndFees + seatSelectionFee + data.baggageFee + addonsFee - discountAmount
    );

    // Verify Stripe payment when an intent id is supplied.
    let isPaid = false;
    if (data.stripePaymentIntentId) {
      const check = await verifyPaymentIntent(
        data.stripePaymentIntentId,
        Math.round(calculatedTotal * 100)
      );
      isPaid = check.paid;
      if (!check.paid) {
        return NextResponse.json(
          { error: `Payment not verified: ${check.reason || "unknown"}` },
          { status: 402 }
        );
      }
    }

    const pnr = generatePNR();

    const newBooking = await Booking.create({
      pnr,
      userId: session?.id || undefined,
      userEmail: data.contactEmail.toLowerCase(),
      contactName: data.contactName.trim(),
      contactEmail: data.contactEmail.toLowerCase(),
      contactPhone: data.contactPhone || "",
      flightId: flight._id,
      returnFlightId: data.returnFlightId || undefined,
      tripType: data.tripType,
      cabinClass: data.cabinClass,
      passengers: data.passengers,
      baseFare: totalBaseFare,
      taxesAndFees,
      seatSelectionFee,
      baggageFee: data.baggageFee,
      addonsFee,
      discountAmount,
      couponCode: validatedCoupon || undefined,
      totalAmount: calculatedTotal,
      currency: "USD",
      status: isPaid ? "CONFIRMED" : "PENDING",
      paymentStatus: isPaid ? "PAID" : "UNPAID",
      stripePaymentIntentId: data.stripePaymentIntentId || undefined,
      travelInsurance: data.travelInsurance,
      carbonOffsetContribution: data.carbonOffsetContribution,
      specialRequests: data.specialRequests,
    });

    const seatField =
      data.cabinClass === "FIRST"
        ? "firstSeatsAvailable"
        : data.cabinClass === "BUSINESS"
          ? "businessSeatsAvailable"
          : data.cabinClass === "PREMIUM_ECONOMY"
            ? "premiumEconomySeatsAvailable"
            : "economySeatsAvailable";

    // Atomic decrement only if seats remain
    await Flight.findOneAndUpdate(
      { _id: flight._id, [seatField]: { $gte: passengerCount } },
      { $inc: { [seatField]: -passengerCount } }
    );

    if (isPaid) {
      await Payment.create({
        bookingId: newBooking._id,
        pnr: newBooking.pnr,
        userEmail: newBooking.userEmail,
        stripePaymentIntentId: data.stripePaymentIntentId,
        amount: calculatedTotal,
        currency: "USD",
        status: "SUCCEEDED",
        paymentMethod: "CARD",
      });
    }

    try {
      await sendBookingConfirmationEmail({
        to: data.contactEmail,
        passengerName: `${data.passengers[0].firstName} ${data.passengers[0].lastName}`,
        pnr: newBooking.pnr,
        flightNumber: flight.flightNumber,
        origin: `${flight.originCity} (${flight.originAirport})`,
        destination: `${flight.destinationCity} (${flight.destinationAirport})`,
        departureTime: new Date(flight.departureTime).toLocaleString("en-US", {
          dateStyle: "full",
          timeStyle: "short",
        }),
        cabinClass: data.cabinClass,
        seatNumber: data.passengers[0].seatNumber || "Assigned at Gate",
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
      paymentStatus: newBooking.paymentStatus,
    });
  } catch (error: unknown) {
    // Friendly message for schema validation instead of raw Mongoose text
    if (error instanceof Error && error.name === "ValidationError") {
      const missing = /`(\w+)` is required/.exec(error.message)?.[1];
      return NextResponse.json(
        {
          error: missing
            ? `Missing required field: ${missing}. Go back to Passengers and complete it.`
            : "Some booking details are missing. Go back to Passengers and complete all required fields.",
        },
        { status: 400 }
      );
    }
    return serverError("Booking creation error", error);
  }
}
