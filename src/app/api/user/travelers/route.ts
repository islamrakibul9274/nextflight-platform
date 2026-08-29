import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Traveler } from "@/models/Traveler";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ travelers: [] });
    }

    await connectDB();
    const travelers = await Traveler.find({ userId: session.id }).sort({ isPrimary: -1, createdAt: 1 }).lean();
    return NextResponse.json({ travelers });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ travelers: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const traveler = await Traveler.create({
      ...body,
      userId: session.id,
    });

    return NextResponse.json({ success: true, traveler });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectDB();

    await Traveler.findOneAndDelete({ _id: id, userId: session.id });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
