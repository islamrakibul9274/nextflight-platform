import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPassengerInfo {
  id?: string;
  type: "ADULT" | "CHILD" | "INFANT";
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  seatNumber?: string;
  mealPreference?: string;
  extraBaggageKg?: number;
  frequentFlyerNumber?: string;
}

export interface IBooking extends Document {
  pnr: string;
  userId?: mongoose.Types.ObjectId | string;
  userEmail: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  flightId: mongoose.Types.ObjectId | string;
  returnFlightId?: mongoose.Types.ObjectId | string;
  tripType: "ONE_WAY" | "ROUND_TRIP" | "MULTI_CITY";
  cabinClass: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  passengers: IPassengerInfo[];
  baseFare: number;
  taxesAndFees: number;
  seatSelectionFee: number;
  baggageFee: number;
  addonsFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED" | "CHECKED_IN";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
  stripePaymentIntentId?: string;
  travelInsurance: boolean;
  carbonOffsetContribution: boolean;
  specialRequests?: string;
  eTicketUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PassengerSchema = new Schema<IPassengerInfo>(
  {
    type: { type: String, enum: ["ADULT", "CHILD", "INFANT"], default: "ADULT" },
    title: { type: String, default: "Mr" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, default: "MALE" },
    nationality: { type: String, default: "US" },
    passportNumber: { type: String, required: true },
    passportExpiry: { type: String, required: true },
    seatNumber: { type: String },
    mealPreference: { type: String, default: "STANDARD" },
    extraBaggageKg: { type: Number, default: 0 },
    frequentFlyerNumber: { type: String },
  },
  { _id: true }
);

const BookingSchema = new Schema<IBooking>(
  {
    pnr: { type: String, required: true, unique: true, uppercase: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: { type: String, required: true, lowercase: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true },
    contactPhone: { type: String, required: true },
    flightId: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    returnFlightId: { type: Schema.Types.ObjectId, ref: "Flight" },
    tripType: { type: String, enum: ["ONE_WAY", "ROUND_TRIP", "MULTI_CITY"], default: "ONE_WAY" },
    cabinClass: {
      type: String,
      enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
      default: "ECONOMY",
    },
    passengers: [PassengerSchema],
    baseFare: { type: Number, required: true },
    taxesAndFees: { type: Number, required: true },
    seatSelectionFee: { type: Number, default: 0 },
    baggageFee: { type: Number, default: 0 },
    addonsFee: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, uppercase: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "REFUNDED", "CHECKED_IN"],
      default: "CONFIRMED",
    },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "REFUNDED", "FAILED"],
      default: "PAID",
    },
    stripePaymentIntentId: { type: String },
    travelInsurance: { type: Boolean, default: false },
    carbonOffsetContribution: { type: Boolean, default: false },
    specialRequests: { type: String },
    eTicketUrl: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ pnr: 1, userEmail: 1 });
BookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
