import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAirline extends Document {
  code: string;
  name: string;
  logo: string;
  country: string;
  alliance?: string;
  rating: number;
  featured?: boolean;
}

const AirlineSchema = new Schema<IAirline>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    country: { type: String, required: true },
    alliance: { type: String },
    rating: { type: Number, default: 4.8 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Airline: Model<IAirline> =
  mongoose.models.Airline || mongoose.model<IAirline>("Airline", AirlineSchema);
