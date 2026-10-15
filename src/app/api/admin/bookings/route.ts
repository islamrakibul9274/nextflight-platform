import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import "@/models/Flight"; // register schema for populate("flightId")
import { requireAdmin } from "@/lib/auth";
import { serverError, forbidden, badRequest } from "@/lib/api-error";
import { z } from "zod";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const UpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "REFUNDED", "CHECKED_IN"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED", "FAILED"]).optional(),
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
    return serverError("Admin bookings error", error);
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    await connectDB();
    const updated = await Booking.findByIdAndUpdate(
      parsed.data.id,
      {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.paymentStatus ? { paymentStatus: parsed.data.paymentStatus } : {}),
      },
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: unknown) {
    return serverError("Admin booking update error", error);
  }
}
