import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  userName: string;
  userAvatar?: string;
  userRole?: string;
  rating: number;
  comment: string;
  route?: string;
  cabinClass?: string;
  verified: boolean;
  featured: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userName: { type: String, required: true },
    userAvatar: { type: String },
    userRole: { type: String, default: "Frequent Flyer" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    route: { type: String, default: "JFK → LHR" },
    cabinClass: { type: String, default: "Business Class" },
    verified: { type: Boolean, default: true },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
