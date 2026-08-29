"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingStepIndicator } from "@/components/booking/BookingStepIndicator";
import { PassengerForm, PassengerData } from "@/components/booking/PassengerForm";
import { InteractiveSeatMap, SeatInfo } from "@/components/booking/InteractiveSeatMap";
import { AddOnsSelector } from "@/components/booking/AddOnsSelector";
import { FareSummaryCard } from "@/components/booking/FareSummaryCard";
import { StripePaymentForm } from "@/components/booking/StripePaymentForm";
import { useAuth } from "@/context/AuthContext";
import {
  Plane,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Luggage,
  Sparkles,
  AlertCircle,
  Lock,
} from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const flightId = searchParams.get("flightId");
  const initialCabin = searchParams.get("cabin") || "ECONOMY";
  const passengerCountParam = Number(searchParams.get("passengers") || 1);

  const [step, setStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking details state
  const [cabinClass, setCabinClass] = useState(initialCabin);
  const [selectedFareTier, setSelectedFareTier] = useState<"BASIC" | "STANDARD" | "FLEX">("STANDARD");

  // Contact Info
  const [contactName, setContactName] = useState(user?.name || "Alex Thorne");
  const [contactEmail, setContactEmail] = useState(user?.email || "traveler@aetheria.com");
  const [contactPhone, setContactPhone] = useState(user?.phone || "+1 (555) 839-1029");

  // Passengers
  const [passengers, setPassengers] = useState<PassengerData[]>(() =>
    Array.from({ length: passengerCountParam }, (_, i) => ({
      type: "ADULT",
      title: "Mr",
      firstName: i === 0 && user?.name ? user.name.split(" ")[0] : i === 0 ? "Alex" : `Traveler`,
      lastName: i === 0 && user?.name ? user.name.split(" ")[1] || "Thorne" : i === 0 ? "Thorne" : `${i + 1}`,
      dateOfBirth: "1992-04-14",
      gender: "MALE",
      nationality: "US",
      passportNumber: `US9823410${i}A`,
      passportExpiry: "2031-08-20",
      frequentFlyerAirline: "Aetheria Sky Alliance",
      frequentFlyerNumber: "AET-78902",
    }))
  );

  // Seats & Addons
  const [selectedSeat, setSelectedSeat] = useState<string | null>("14A");
  const [seatFee, setSeatFee] = useState(25);
  const [extraBaggage, setExtraBaggage] = useState(0);
  const [mealPreference, setMealPreference] = useState("STANDARD");
  const [travelInsurance, setTravelInsurance] = useState(false);
  const [carbonOffset, setCarbonOffset] = useState(false);

  // Promo Code
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Submitting
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Flight details
  useEffect(() => {
    async function getFlight() {
      if (!flightId) return;
      try {
        const res = await fetch(`/api/flights/${flightId}`);
        const data = await res.json();
        if (data.flight) {
          setFlight(data.flight);
        }
      } catch (e) {
        console.error("Flight fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    getFlight();
  }, [flightId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-9 h-9 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Locking flight inventory...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Flight Unavailable</h3>
          <p className="text-xs text-slate-500">
            The selected flight could not be retrieved. Please return to search to pick another corridor.
          </p>
          <button
            onClick={() => router.push("/search")}
            className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
          >
            Back to Flight Search
          </button>
        </div>
      </div>
    );
  }

  // Calculate Authoritative Pricing
  const basePricePerPerson =
    cabinClass === "FIRST"
      ? flight.firstPrice
      : cabinClass === "BUSINESS"
      ? flight.businessPrice
      : cabinClass === "PREMIUM_ECONOMY"
      ? flight.premiumEconomyPrice
      : flight.basePrice;

  // Tier modifier
  const tierModifier =
    selectedFareTier === "BASIC" ? -40 : selectedFareTier === "FLEX" ? 75 : 0;

  const totalBaseFare = (basePricePerPerson + tierModifier) * passengers.length;
  const taxes = Math.round(totalBaseFare * 0.12);
  const baggageFee = extraBaggage * 45 * passengers.length;
  const insuranceFee = travelInsurance ? 39 * passengers.length : 0;
  const offsetFee = carbonOffset ? 12 * passengers.length : 0;

  // Membership discount
  const membershipDiscount =
    user?.membershipTier === "APEX"
      ? Math.round(totalBaseFare * 0.2)
      : user?.membershipTier === "STRATOSPHERE"
      ? Math.round(totalBaseFare * 0.15)
      : 0;

  const finalTotal = Math.max(
    0,
    totalBaseFare + taxes + seatFee + baggageFee + insuranceFee + offsetFee - discountAmount - membershipDiscount
  );

  const handleApplyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderAmount: totalBaseFare }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponCode(data.code);
        setDiscountAmount(data.discountAmount);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
  };

  const handleSelectSeat = (seat: SeatInfo) => {
    setSelectedSeat(seat.seatNumber);
    setSeatFee(seat.price);
    // Assign to passenger 1
    const updated = [...passengers];
    updated[0].seatNumber = seat.seatNumber;
    setPassengers(updated);
  };

  const handleUpdatePassenger = (
    index: number,
    field: keyof PassengerData,
    value: string
  ) => {
    const updated = [...passengers];
    // @ts-expect-error dynamic string assign
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleUpdateContact = (
    field: "contactName" | "contactEmail" | "contactPhone",
    value: string
  ) => {
    if (field === "contactName") setContactName(value);
    if (field === "contactEmail") setContactEmail(value);
    if (field === "contactPhone") setContactPhone(value);
  };

  const handleAutofillDemo = () => {
    setContactName("Alex Thorne");
    setContactEmail("traveler@aetheria.com");
    setContactPhone("+1 (555) 839-1029");
    setPassengers([
      {
        type: "ADULT",
        title: "Mr",
        firstName: "Alex",
        lastName: "Thorne",
        dateOfBirth: "1992-04-14",
        gender: "MALE",
        nationality: "US",
        passportNumber: "US98234102A",
        passportExpiry: "2031-08-20",
        frequentFlyerAirline: "Aetheria Sky Alliance",
        frequentFlyerNumber: "AET-78902",
        seatNumber: "14A",
      },
    ]);
  };

  // Finalize booking via Authoritative Server Action API
  const handleFinalizeBooking = async (stripePaymentId: string) => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const payload = {
        flightId: flight._id,
        cabinClass,
        passengers,
        contactName,
        contactEmail,
        contactPhone,
        couponCode: couponCode || undefined,
        travelInsurance,
        carbonOffsetContribution: carbonOffset,
        seatSelectionFee: seatFee,
        baggageFee,
        stripePaymentIntentId: stripePaymentId,
        specialRequests: `${mealPreference} meal requested`,
      };

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to finalize flight booking");
      }

      // Redirect to Confirmation & E-Ticket issuance page
      router.push(`/booking/success?pnr=${data.pnr}`);
    } catch (e: unknown) {
      const err = e as Error;
      setErrorMessage(err.message || "An unexpected error occurred during booking");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator Header */}
        <BookingStepIndicator currentStep={step} />

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Booking Form Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Fare Tier Upgrade */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Select Your Fare Experience
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose the flexibility and baggage allowance that fits your voyage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Basic Economy */}
                    <div
                      onClick={() => setSelectedFareTier("BASIC")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        selectedFareTier === "BASIC"
                          ? "border-sky-600 bg-sky-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">Basic Saver</h4>
                          {selectedFareTier === "BASIC" && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 font-mono mt-3">
                          ${basePricePerPerson - 40}
                        </div>
                        <ul className="mt-4 space-y-2 text-xs text-slate-600">
                          <li>• 1x 8kg Cabin Bag</li>
                          <li>• Seat assigned at gate</li>
                          <li>• Non-changeable ticket</li>
                        </ul>
                      </div>
                    </div>

                    {/* Standard Economy */}
                    <div
                      onClick={() => setSelectedFareTier("STANDARD")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                        selectedFareTier === "STANDARD"
                          ? "border-sky-600 bg-sky-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase">
                        Recommended
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">Standard Flex</h4>
                          {selectedFareTier === "STANDARD" && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 font-mono mt-3">
                          ${basePricePerPerson}
                        </div>
                        <ul className="mt-4 space-y-2 text-xs text-slate-600">
                          <li>• 1x 8kg Cabin Bag</li>
                          <li>• 1x 23kg Checked Bag</li>
                          <li>• Free Seat Selection</li>
                          <li>• Free Date Changes</li>
                        </ul>
                      </div>
                    </div>

                    {/* Flex Plus */}
                    <div
                      onClick={() => setSelectedFareTier("FLEX")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        selectedFareTier === "FLEX"
                          ? "border-sky-600 bg-sky-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">Flex Plus VIP</h4>
                          {selectedFareTier === "FLEX" && <Check className="w-4 h-4 text-sky-600" />}
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 font-mono mt-3">
                          ${basePricePerPerson + 75}
                        </div>
                        <ul className="mt-4 space-y-2 text-xs text-slate-600">
                          <li>• 2x 23kg Checked Bags</li>
                          <li>• Priority Fast-Track Security</li>
                          <li>• Extra Legroom Seat included</li>
                          <li>• 100% Refundable Ticket</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Next: Passenger Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Passenger Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <PassengerForm
                  passengers={passengers}
                  contactName={contactName}
                  contactEmail={contactEmail}
                  contactPhone={contactPhone}
                  onUpdatePassenger={handleUpdatePassenger}
                  onUpdateContact={handleUpdateContact}
                  onAutofillDemo={handleAutofillDemo}
                />

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Next: Seats & Add-ons</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Seats & Add-ons */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <InteractiveSeatMap
                  selectedSeat={selectedSeat}
                  onSelectSeat={handleSelectSeat}
                  cabinClass={cabinClass}
                />

                <AddOnsSelector
                  extraBaggage={extraBaggage}
                  onUpdateBaggage={setExtraBaggage}
                  mealPreference={mealPreference}
                  onUpdateMeal={setMealPreference}
                  travelInsurance={travelInsurance}
                  onToggleInsurance={setTravelInsurance}
                  carbonOffset={carbonOffset}
                  onToggleOffset={setCarbonOffset}
                  passengerCount={passengers.length}
                />

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Next: Review Fare</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review Fare & Promo Application */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Review Your Itinerary & Travelers
                  </h2>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Lead Passenger & Contact
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{contactName}</div>
                      <div className="text-slate-500">{contactEmail}</div>
                      <div className="text-slate-500">{contactPhone}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Selected Options
                      </div>
                      <div className="font-bold text-slate-900">Seat {selectedSeat || "Assigned at Gate"}</div>
                      <div className="text-slate-500">Meal: {mealPreference}</div>
                      <div className="text-slate-500">
                        Insurance: {travelInsurance ? "Enrolled ✓" : "Declined"}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Authoritative Fare Lock Active</div>
                      <div className="text-sky-700 text-[11px] mt-0.5">
                        Your fare and seat assignment are locked for the next 15 minutes while completing payment.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Secure Payment */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <StripePaymentForm
                  totalAmount={finalTotal}
                  contactEmail={contactEmail}
                  onPaymentSuccess={handleFinalizeBooking}
                  isProcessing={isProcessing}
                />

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setStep(4)}
                    className="px-6 py-3 border border-slate-200 bg-white text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Fare Summary Card Column */}
          <div className="lg:col-span-4">
            <FareSummaryCard
              flight={flight}
              cabinClass={cabinClass}
              passengerCount={passengers.length}
              baseFare={totalBaseFare}
              taxes={taxes}
              seatFee={seatFee}
              baggageFee={baggageFee}
              insuranceFee={insuranceFee}
              offsetFee={offsetFee}
              discount={discountAmount}
              couponCode={couponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              totalPrice={finalTotal}
              membershipDiscount={membershipDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-3">
            <div className="w-9 h-9 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Preparing booking console...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
