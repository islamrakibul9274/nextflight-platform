import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const users = await User.find(query).select("-passwordHash").sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ users });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, role, membershipTier } = body;
    await connectDB();
    const updated = await User.findByIdAndUpdate(
      id,
      { role, membershipTier },
      { new: true }
    ).select("-passwordHash");
    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
