import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validUntil: Date;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ["PERCENT", "FIXED"], default: "PERCENT" },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 1000 },
    timesUsed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
