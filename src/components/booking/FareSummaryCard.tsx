"use client";

import React, { useState } from "react";
import { Plane, Tag, Check, ArrowRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { formatFlightTime, formatDuration } from "@/lib/utils";

interface FlightSummary {
  flightNumber: string;
  airlineName: string;
  airlineLogo: string;
  originAirport: string;
  originCity: string;
  destinationAirport: string;
  destinationCity: string;
  departureTime: string;
  durationMinutes: number;
}

interface FareSummaryProps {
  flight: FlightSummary;
  cabinClass: string;
  passengerCount: number;
  baseFare: number;
  taxes: number;
  seatFee: number;
  baggageFee: number;
  insuranceFee: number;
  offsetFee: number;
  discount: number;
  couponCode: string;
  onApplyCoupon: (code: string) => Promise<boolean>;
  onRemoveCoupon: () => void;
  totalPrice: number;
  membershipDiscount?: number;
}

export function FareSummaryCard({
  flight,
  cabinClass,
  passengerCount,
  baseFare,
  taxes,
  seatFee,
  baggageFee,
  insuranceFee,
  offsetFee,
  discount,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  totalPrice,
  membershipDiscount = 0,
}: FareSummaryProps) {
  const [inputCode, setInputCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    setApplying(true);
    setCouponError("");
    try {
      const success = await onApplyCoupon(inputCode);
      if (!success) {
        setCouponError("Invalid or expired promo code");
      }
    } catch {
      setCouponError("Error validating promo code");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-2xs sticky top-24">
      {/* Flight Snapshot */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Booking Summary
          </span>
          <span className="text-xs font-mono font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
            {flight.flightNumber}
          </span>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {flight.originAirport}
            </div>
            <div className="text-[11px] text-slate-500">{flight.originCity}</div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5">
              {formatFlightTime(flight.departureTime)}
            </div>
          </div>

          <div className="flex flex-col items-center px-3">
            <span className="text-[10px] text-slate-400 font-medium">
              {formatDuration(flight.durationMinutes)}
            </span>
            <div className="w-16 h-0.5 bg-slate-200 relative my-1">
              <Plane className="w-3 h-3 text-sky-600 absolute left-1/2 -top-1.5 -translate-x-1/2 -rotate-45" />
            </div>
            <span className="text-[9px] text-emerald-600 font-bold uppercase">Nonstop</span>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {flight.destinationAirport}
            </div>
            <div className="text-[11px] text-slate-500">{flight.destinationCity}</div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5">
              {cabinClass.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Fare Itemization */}
      <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
        <div className="flex justify-between text-slate-600">
          <span>
            Airfare ({passengerCount} Traveler{passengerCount > 1 ? "s" : ""})
          </span>
          <span className="font-mono font-bold text-slate-900">${baseFare}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Airport Taxes & Regulatory Surcharges</span>
          <span className="font-mono font-bold text-slate-900">${taxes}</span>
        </div>

        {seatFee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Seat Selection Assignment</span>
            <span className="font-mono font-bold text-slate-900">+${seatFee}</span>
          </div>
        )}

        {baggageFee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Additional Checked Baggage</span>
            <span className="font-mono font-bold text-slate-900">+${baggageFee}</span>
          </div>
        )}

        {insuranceFee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Global Travel Protection</span>
            <span className="font-mono font-bold text-slate-900">+${insuranceFee}</span>
          </div>
        )}

        {offsetFee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Verified Carbon Offset Contribution</span>
            <span className="font-mono font-bold text-slate-900">+${offsetFee}</span>
          </div>
        )}

        {/* Discounts */}
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Promo ({couponCode})
            </span>
            <span className="font-mono">-${discount}</span>
          </div>
        )}

        {membershipDiscount > 0 && (
          <div className="flex justify-between text-sky-700 font-bold bg-sky-50 px-2 py-1 rounded-lg">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Stratosphere Member Perk
            </span>
            <span className="font-mono">-${membershipDiscount}</span>
          </div>
        )}
      </div>

      {/* Promo Code Box */}
      <div className="border-t border-slate-100 pt-4">
        {couponCode ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="font-mono font-bold text-emerald-900">{couponCode} Applied</span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs text-rose-600 font-bold hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. FLYFIRST)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:bg-white focus:border-sky-500 outline-hidden"
              />
              <button
                type="submit"
                disabled={applying || !inputCode}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {applying && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Apply</span>
              </button>
            </div>
            {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
            <p className="text-[10px] text-slate-400">
              Try promo code <strong className="text-slate-600 font-mono">FLYFIRST</strong> for 20% off.
            </p>
          </form>
        )}
      </div>

      {/* Total Authoritative Price */}
      <div className="border-t border-slate-200 pt-4 flex items-baseline justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900">Total Price</div>
          <div className="text-[10px] text-slate-400">Includes all taxes & fees</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-sky-600 font-mono">
            ${totalPrice}
          </div>
          <div className="text-[10px] font-mono text-slate-400">USD</div>
        </div>
      </div>
    </div>
  );
}
