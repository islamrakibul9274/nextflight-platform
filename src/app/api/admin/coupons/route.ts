import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const coupon = await Coupon.create({
      ...body,
      code: body.code.trim().toUpperCase(),
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectDB();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
