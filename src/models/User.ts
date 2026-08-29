import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: "USER" | "ADMIN";
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  preferredCurrency: string;
  preferredLanguage: string;
  membershipTier: "VOYAGER" | "STRATOSPHERE" | "APEX";
  membershipExpiresAt?: Date;
  homeAirport?: string;
  seatPreference?: "WINDOW" | "AISLE" | "ANY";
  mealPreference?: "STANDARD" | "VEGAN" | "HALAL" | "KOSHER" | "GLUTEN_FREE";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    avatar: { type: String },
    phone: { type: String },
    dateOfBirth: { type: String },
    nationality: { type: String, default: "US" },
    preferredCurrency: { type: String, default: "USD" },
    preferredLanguage: { type: String, default: "en" },
    membershipTier: { type: String, enum: ["VOYAGER", "STRATOSPHERE", "APEX"], default: "VOYAGER" },
    membershipExpiresAt: { type: Date },
    homeAirport: { type: String, default: "JFK" },
    seatPreference: { type: String, enum: ["WINDOW", "AISLE", "ANY"], default: "ANY" },
    mealPreference: {
      type: String,
      enum: ["STANDARD", "VEGAN", "HALAL", "KOSHER", "GLUTEN_FREE"],
      default: "STANDARD",
    },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
