import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId | string;
  pnr: string;
  userEmail: string;
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  amount: number;
  currency: string;
  status: "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    pnr: { type: String, required: true, uppercase: true },
    userEmail: { type: String, required: true },
    stripePaymentIntentId: { type: String, required: true },
    stripeChargeId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["SUCCEEDED", "PENDING", "FAILED", "REFUNDED"],
      default: "SUCCEEDED",
    },
    paymentMethod: { type: String, default: "CARD" },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
