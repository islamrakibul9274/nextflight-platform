import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { requireAdmin } from "@/lib/auth";
import { serverError, forbidden, badRequest } from "@/lib/api-error";
import { z } from "zod";

const CouponSchema = z.object({
  code: z.string().trim().min(3).max(30),
  description: z.string().trim().min(3).max(200),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.number().positive().max(100000),
  minOrderValue: z.number().min(0).max(1000000).optional().default(0),
  maxDiscount: z.number().positive().max(100000).optional(),
  validUntil: z.string().min(1),
  usageLimit: z.number().int().positive().max(1000000).optional().default(1000),
});

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch (error: unknown) {
    return serverError("Admin coupons error", error);
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const body = await req.json();
    const parsed = CouponSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    if (parsed.data.discountType === "PERCENT" && parsed.data.discountValue > 100) {
      return badRequest("Percent discount cannot exceed 100");
    }
    await connectDB();
    const coupon = await Coupon.create({
      ...parsed.data,
      code: parsed.data.code.trim().toUpperCase(),
      validUntil: new Date(parsed.data.validUntil),
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error: unknown) {
    return serverError("Admin coupon create error", error);
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return badRequest("Coupon id is required");
    await connectDB();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return serverError("Admin coupon delete error", error);
  }
}
