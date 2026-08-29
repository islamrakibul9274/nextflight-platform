"use client";

import React from "react";
import { User, Mail, Phone, Globe, Shield, Calendar, Award } from "lucide-react";

export interface PassengerData {
  type: "ADULT" | "CHILD" | "INFANT";
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
  seatNumber?: string;
  mealPreference?: string;
}

interface PassengerFormProps {
  passengers: PassengerData[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  onUpdatePassenger: (index: number, field: keyof PassengerData, value: string) => void;
  onUpdateContact: (field: "contactName" | "contactEmail" | "contactPhone", value: string) => void;
  onAutofillDemo: () => void;
}

export function PassengerForm({
  passengers,
  contactName,
  contactEmail,
  contactPhone,
  onUpdatePassenger,
  onUpdateContact,
  onAutofillDemo,
}: PassengerFormProps) {
  return (
    <div className="space-y-8">
      {/* Primary Contact Details */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Primary Booking Contact
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              E-tickets, gate change alerts, and boarding passes will be sent here.
            </p>
          </div>
          <button
            type="button"
            onClick={onAutofillDemo}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            ⚡ Auto-Fill Demo Traveler
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="contact-name" className="text-xs font-bold text-zinc-700 block mb-1.5">
              Full Legal Name *
            </label>
            <input
              id="contact-name"
              name="contactName"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Alex Thorne"
              value={contactName}
              onChange={(e) => onUpdateContact("contactName", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="text-xs font-bold text-zinc-700 block mb-1.5">
              Email Address *
            </label>
            <input
              id="contact-email"
              name="contactEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="e.g. traveler@nextflight.com"
              value={contactEmail}
              onChange={(e) => onUpdateContact("contactEmail", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="text-xs font-bold text-zinc-700 block mb-1.5">
              Mobile Phone (for SMS flight alerts)
            </label>
            <input
              id="contact-phone"
              name="contactPhone"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. +1 (555) 839-1029"
              value={contactPhone}
              onChange={(e) => onUpdateContact("contactPhone", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
            />
          </div>
        </div>
      </div>

      {/* Passenger Information Cards */}
      {passengers.map((p, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 space-y-6 shadow-2xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Passenger {idx + 1} ({p.type})
            </h3>
            <span className="text-xs font-mono font-bold text-zinc-400">
              Must match government passport
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label htmlFor={`passenger-${idx}-title`} className="text-xs font-bold text-zinc-700 block mb-1.5">Title</label>
              <select
                id={`passenger-${idx}-title`}
                name={`passenger_${idx}_title`}
                value={p.title}
                onChange={(e) => onUpdatePassenger(idx, "title", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
              >
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            {/* First Name */}
            <div className="sm:col-span-5">
              <label htmlFor={`passenger-${idx}-first-name`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                First / Given Name *
              </label>
              <input
                id={`passenger-${idx}-first-name`}
                name={`passenger_${idx}_firstName`}
                type="text"
                required
                autoComplete="given-name"
                placeholder="e.g. Alex"
                value={p.firstName}
                onChange={(e) => onUpdatePassenger(idx, "firstName", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="sm:col-span-5">
              <label htmlFor={`passenger-${idx}-last-name`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                Last / Family Name *
              </label>
              <input
                id={`passenger-${idx}-last-name`}
                name={`passenger_${idx}_lastName`}
                type="text"
                required
                autoComplete="family-name"
                placeholder="e.g. Thorne"
                value={p.lastName}
                onChange={(e) => onUpdatePassenger(idx, "lastName", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
              />
            </div>

            {/* DOB */}
            <div className="sm:col-span-4">
              <label htmlFor={`passenger-${idx}-dob`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                Date of Birth *
              </label>
              <input
                id={`passenger-${idx}-dob`}
                name={`passenger_${idx}_dob`}
                type="date"
                required
                autoComplete="bday"
                value={p.dateOfBirth}
                onChange={(e) => onUpdatePassenger(idx, "dateOfBirth", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-4">
              <label htmlFor={`passenger-${idx}-gender`} className="text-xs font-bold text-zinc-700 block mb-1.5">Gender</label>
              <select
                id={`passenger-${idx}-gender`}
                name={`passenger_${idx}_gender`}
                value={p.gender}
                onChange={(e) => onUpdatePassenger(idx, "gender", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNDISCLOSED">Undisclosed</option>
              </select>
            </div>

            {/* Nationality */}
            <div className="sm:col-span-4">
              <label htmlFor={`passenger-${idx}-nationality`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                Nationality
              </label>
              <select
                id={`passenger-${idx}-nationality`}
                name={`passenger_${idx}_nationality`}
                value={p.nationality}
                onChange={(e) => onUpdatePassenger(idx, "nationality", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="AU">Australia (AU)</option>
                <option value="JP">Japan (JP)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="DE">Germany (DE)</option>
                <option value="FR">France (FR)</option>
                <option value="AE">United Arab Emirates (AE)</option>
              </select>
            </div>

            {/* Passport Number */}
            <div className="sm:col-span-6">
              <label htmlFor={`passenger-${idx}-passport-num`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                Passport Number *
              </label>
              <input
                id={`passenger-${idx}-passport-num`}
                name={`passenger_${idx}_passportNumber`}
                type="text"
                required
                placeholder="e.g. US98234102A"
                value={p.passportNumber}
                onChange={(e) => onUpdatePassenger(idx, "passportNumber", e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono font-bold text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all uppercase"
              />
            </div>

            {/* Passport Expiration */}
            <div className="sm:col-span-6">
              <label htmlFor={`passenger-${idx}-passport-expiry`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                Passport Expiration Date *
              </label>
              <input
                id={`passenger-${idx}-passport-expiry`}
                name={`passenger_${idx}_passportExpiry`}
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={p.passportExpiry}
                onChange={(e) => onUpdatePassenger(idx, "passportExpiry", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all cursor-pointer"
              />
            </div>

            {/* Frequent Flyer Number (Optional) */}
            <div className="sm:col-span-12 pt-2 border-t border-zinc-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`passenger-${idx}-ff-program`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                    Frequent Flyer Program (Optional)
                  </label>
                  <input
                    id={`passenger-${idx}-ff-program`}
                    name={`passenger_${idx}_frequentFlyerAirline`}
                    type="text"
                    placeholder="e.g. NextFlight Sky Alliance, Star Alliance"
                    value={p.frequentFlyerAirline || ""}
                    onChange={(e) => onUpdatePassenger(idx, "frequentFlyerAirline", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`passenger-${idx}-ff-num`} className="text-xs font-bold text-zinc-700 block mb-1.5">
                    Membership Number
                  </label>
                  <input
                    id={`passenger-${idx}-ff-num`}
                    name={`passenger_${idx}_frequentFlyerNumber`}
                    type="text"
                    placeholder="e.g. AET-78902"
                    value={p.frequentFlyerNumber || ""}
                    onChange={(e) => onUpdatePassenger(idx, "frequentFlyerNumber", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-900 focus:bg-white focus:border-blue-600 outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
