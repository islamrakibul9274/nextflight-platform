import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Traveler } from "@/models/Traveler";
import { getSessionUser } from "@/lib/auth";
import { serverError, unauthorized, badRequest } from "@/lib/api-error";
import { z } from "zod";

const TravelerSchema = z.object({
  title: z.enum(["Mr", "Ms", "Mrs", "Dr"]).optional().default("Mr"),
  firstName: z.string().trim().min(1).max(60),
  lastName: z.string().trim().min(1).max(60),
  dateOfBirth: z.string().trim().min(4).max(20),
  gender: z.enum(["MALE", "FEMALE", "UNDISCLOSED", "OTHER"]).optional().default("MALE"),
  nationality: z.string().trim().max(60).optional().default("US"),
  passportNumber: z.string().trim().min(4).max(30),
  passportExpiry: z.string().trim().min(4).max(20).optional(),
  frequentFlyerAirline: z.string().trim().max(60).optional(),
  frequentFlyerNumber: z.string().trim().max(40).optional(),
  isPrimary: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return unauthorized("Sign in to view travelers");
    }

    await connectDB();
    const travelers = await Traveler.find({ userId: session.id }).sort({ isPrimary: -1, createdAt: 1 }).lean();
    return NextResponse.json({ travelers });
  } catch (error: unknown) {
    return serverError("Travelers error", error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return unauthorized();
    }

    const body = await req.json();
    const parsed = TravelerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    await connectDB();

    const traveler = await Traveler.create({
      ...parsed.data,
      userId: session.id,
    });

    return NextResponse.json({ success: true, traveler });
  } catch (error: unknown) {
    return serverError("Traveler create error", error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return badRequest("Traveler id is required");
    await connectDB();

    const deleted = await Traveler.findOneAndDelete({ _id: id, userId: session.id });
    if (!deleted) return NextResponse.json({ error: "Traveler not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return serverError("Traveler delete error", error);
  }
}
