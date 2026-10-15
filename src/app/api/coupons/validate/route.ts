import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { serverError, rateLimited, badRequest } from "@/lib/api-error";
import { z } from "zod";

const Schema = z.object({
  code: z.string().trim().min(2).max(30),
  orderAmount: z.number().min(0).max(1000000),
});

export async function POST(req: Request) {
  try {
    const rl = checkRateLimit(getClientKey(req, "coupon"), 30, 60_000);
    if (!rl.allowed) return rateLimited(rl.resetAt);

    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    const { code, orderAmount } = parsed.data;

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
    return serverError("Coupon validation error", error);
  }
}
