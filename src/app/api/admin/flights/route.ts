import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Flight } from "@/models/Flight";
import { requireAdmin } from "@/lib/auth";
import { serverError, forbidden, badRequest } from "@/lib/api-error";
import { z } from "zod";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FlightUpsertSchema = z.object({
  flightNumber: z.string().trim().min(2).max(20),
  airlineCode: z.string().trim().min(2).max(5),
  airlineName: z.string().trim().min(2).max(100),
  airlineLogo: z.string().trim().max(200).optional().default("✈️"),
  originAirport: z.string().trim().length(3),
  originCity: z.string().trim().min(2).max(100),
  destinationAirport: z.string().trim().length(3),
  destinationCity: z.string().trim().min(2).max(100),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  durationMinutes: z.number().int().positive().max(3000),
  stops: z.number().int().min(0).max(3).optional().default(0),
  basePrice: z.number().positive().max(100000),
  premiumEconomyPrice: z.number().positive().max(100000),
  businessPrice: z.number().positive().max(200000),
  firstPrice: z.number().positive().max(300000),
  status: z
    .enum(["SCHEDULED", "BOARDING", "DEPARTED", "ARRIVED", "DELAYED", "CANCELLED"])
    .optional()
    .default("SCHEDULED"),
});

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().slice(0, 60);
    const status = searchParams.get("status");

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      const regex = new RegExp(escapeRegExp(search), "i");
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
    return serverError("Admin flights error", error);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const body = await req.json();
    const parsed = FlightUpsertSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    await connectDB();
    const newFlight = await Flight.create({
      ...parsed.data,
      originAirport: parsed.data.originAirport.toUpperCase(),
      destinationAirport: parsed.data.destinationAirport.toUpperCase(),
      airlineCode: parsed.data.airlineCode.toUpperCase(),
    });
    return NextResponse.json({ success: true, flight: newFlight });
  } catch (error: unknown) {
    return serverError("Admin flight create error", error);
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const body = await req.json();
    const { id, status } = body as { id?: string; status?: string };
    if (!id) return badRequest("Flight id is required");
    const allowedStatus = ["SCHEDULED", "BOARDING", "DEPARTED", "ARRIVED", "DELAYED", "CANCELLED"];
    const updates: Record<string, unknown> = {};
    if (status !== undefined) {
      if (!allowedStatus.includes(status)) return badRequest("Invalid status");
      updates.status = status;
    }
    if (typeof body.basePrice === "number") {
      if (body.basePrice <= 0 || body.basePrice > 100000) return badRequest("Invalid base price");
      updates.basePrice = body.basePrice;
    }
    if (Object.keys(updates).length === 0) return badRequest("Nothing to update");
    await connectDB();
    const updated = await Flight.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    return NextResponse.json({ success: true, flight: updated });
  } catch (error: unknown) {
    return serverError("Admin flight update error", error);
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return badRequest("Flight id is required");
    await connectDB();
    await Flight.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return serverError("Admin flight delete error", error);
  }
}
