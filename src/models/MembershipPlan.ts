import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMembershipPlan extends Document {
  tier: "VOYAGER" | "STRATOSPHERE" | "APEX";
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  flightDiscountPercent: number;
  freeSeatSelection: boolean;
  freeExtraBaggage: boolean;
  loungeAccess: boolean;
  priorityBoarding: boolean;
  dedicatedConcierge: boolean;
  flexibleCancellations: boolean;
  badgeColor: string;
  isPopular?: boolean;
}

const MembershipPlanSchema = new Schema<IMembershipPlan>(
  {
    tier: {
      type: String,
      enum: ["VOYAGER", "STRATOSPHERE", "APEX"],
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    monthlyPrice: { type: Number, default: 0 },
    yearlyPrice: { type: Number, default: 0 },
    flightDiscountPercent: { type: Number, default: 0 },
    freeSeatSelection: { type: Boolean, default: false },
    freeExtraBaggage: { type: Boolean, default: false },
    loungeAccess: { type: Boolean, default: false },
    priorityBoarding: { type: Boolean, default: false },
    dedicatedConcierge: { type: Boolean, default: false },
    flexibleCancellations: { type: Boolean, default: false },
    badgeColor: { type: String, default: "slate" },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MembershipPlan: Model<IMembershipPlan> =
  mongoose.models.MembershipPlan ||
  mongoose.model<IMembershipPlan>("MembershipPlan", MembershipPlanSchema);
