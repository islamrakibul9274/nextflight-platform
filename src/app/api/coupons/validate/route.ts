import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    const { code, orderAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    await connectDB();
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      validUntil: { $gte: new Date() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 });
    }

    if (orderAmount < coupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value of $${coupon.minOrderValue} required for this code` },
        { status: 400 }
      );
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENT") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, orderAmount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.round(discountAmount),
      newTotal: Math.round(orderAmount - discountAmount),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Coupon validation error:", err);
    return NextResponse.json({ error: err.message || "Failed to validate coupon" }, { status: 500 });
  }
}
