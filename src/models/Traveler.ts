import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITraveler extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  frequentFlyerAirline?: string;
  frequentFlyerNumber?: string;
  isPrimary?: boolean;
}

const TravelerSchema = new Schema<ITraveler>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Mr" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, default: "MALE" },
    nationality: { type: String, default: "US" },
    passportNumber: { type: String, required: true },
    passportExpiry: { type: String, required: true },
    frequentFlyerAirline: { type: String },
    frequentFlyerNumber: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Traveler: Model<ITraveler> =
  mongoose.models.Traveler || mongoose.model<ITraveler>("Traveler", TravelerSchema);
