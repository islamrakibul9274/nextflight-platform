import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAirport extends Document {
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
  terminals: number;
  image?: string;
  isPopular?: boolean;
}

const AirportSchema = new Schema<IAirport>(
  {
    iataCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    icaoCode: { type: String, uppercase: true, trim: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true, uppercase: true },
    timezone: { type: String, default: "UTC" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    terminals: { type: Number, default: 3 },
    image: { type: String },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AirportSchema.index({ iataCode: 1, city: 1, name: 1, country: 1 });

export const Airport: Model<IAirport> =
  mongoose.models.Airport || mongoose.model<IAirport>("Airport", AirportSchema);
