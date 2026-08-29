import mongoose, { Schema, Model } from "mongoose";

export interface IAircraft {
  model: string;
  manufacturer: string;
  cabinLayout: string;
  totalSeats: number;
  economySeats: number;
  premiumEconomySeats: number;
  businessSeats: number;
  firstSeats: number;
  cruiseSpeedKmh: number;
  seatPitchEconomyInches: number;
  hasWifi: boolean;
  hasPower: boolean;
  hasLiveTv: boolean;
}

const AircraftSchema = new Schema<IAircraft>(
  {
    model: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    cabinLayout: { type: String, default: "3-3-3" },
    totalSeats: { type: Number, required: true },
    economySeats: { type: Number, required: true },
    premiumEconomySeats: { type: Number, default: 28 },
    businessSeats: { type: Number, default: 36 },
    firstSeats: { type: Number, default: 8 },
    cruiseSpeedKmh: { type: Number, default: 910 },
    seatPitchEconomyInches: { type: Number, default: 32 },
    hasWifi: { type: Boolean, default: true },
    hasPower: { type: Boolean, default: true },
    hasLiveTv: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Aircraft: Model<IAircraft> =
  mongoose.models.Aircraft || mongoose.model<IAircraft>("Aircraft", AircraftSchema);
