import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFlight extends Document {
  flightNumber: string;
  airlineCode: string;
  airlineName: string;
  airlineLogo: string;
  originAirport: string;
  originCity: string;
  destinationAirport: string;
  destinationCity: string;
  departureTime: Date;
  arrivalTime: Date;
  durationMinutes: number;
  stops: number;
  stopAirports: string[];
  aircraftModel: string;
  basePrice: number;
  premiumEconomyPrice: number;
  businessPrice: number;
  firstPrice: number;
  economySeatsAvailable: number;
  premiumEconomySeatsAvailable: number;
  businessSeatsAvailable: number;
  firstSeatsAvailable: number;
  baggageAllowance: {
    carryOn: string;
    checked: string;
  };
  amenities: {
    wifi: boolean;
    power: boolean;
    entertainment: boolean;
    meal: boolean;
    lieFlatSeats: boolean;
  };
  status: "SCHEDULED" | "BOARDING" | "DEPARTED" | "ARRIVED" | "DELAYED" | "CANCELLED";
  terminalDeparture?: string;
  terminalArrival?: string;
  gateDeparture?: string;
  gateArrival?: string;
  carbonKg: number;
  refundable: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlightSchema = new Schema<IFlight>(
  {
    flightNumber: { type: String, required: true, trim: true },
    airlineCode: { type: String, required: true, uppercase: true },
    airlineName: { type: String, required: true },
    airlineLogo: { type: String, required: true },
    originAirport: { type: String, required: true, uppercase: true },
    originCity: { type: String, required: true },
    destinationAirport: { type: String, required: true, uppercase: true },
    destinationCity: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    stops: { type: Number, default: 0 },
    stopAirports: [{ type: String, uppercase: true }],
    aircraftModel: { type: String, default: "Boeing 787-9" },
    basePrice: { type: Number, required: true },
    premiumEconomyPrice: { type: Number, required: true },
    businessPrice: { type: Number, required: true },
    firstPrice: { type: Number, required: true },
    economySeatsAvailable: { type: Number, default: 150 },
    premiumEconomySeatsAvailable: { type: Number, default: 28 },
    businessSeatsAvailable: { type: Number, default: 32 },
    firstSeatsAvailable: { type: Number, default: 6 },
    baggageAllowance: {
      carryOn: { type: String, default: "1x 8kg cabin bag" },
      checked: { type: String, default: "1x 23kg checked bag" },
    },
    amenities: {
      wifi: { type: Boolean, default: true },
      power: { type: Boolean, default: true },
      entertainment: { type: Boolean, default: true },
      meal: { type: Boolean, default: true },
      lieFlatSeats: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "BOARDING", "DEPARTED", "ARRIVED", "DELAYED", "CANCELLED"],
      default: "SCHEDULED",
    },
    terminalDeparture: { type: String, default: "T4" },
    terminalArrival: { type: String, default: "T2" },
    gateDeparture: { type: String, default: "A12" },
    gateArrival: { type: String, default: "B04" },
    carbonKg: { type: Number, default: 280 },
    refundable: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

FlightSchema.index({ originAirport: 1, destinationAirport: 1, departureTime: 1 });
FlightSchema.index({ basePrice: 1, durationMinutes: 1, stops: 1 });

export const Flight: Model<IFlight> =
  mongoose.models.Flight || mongoose.model<IFlight>("Flight", FlightSchema);
