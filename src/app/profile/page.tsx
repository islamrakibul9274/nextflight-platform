"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Globe,
  Crown,
  Plane,
  Save,
  Plus,
  Trash2,
  Shield,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface TravelerProfile {
  _id?: string;
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
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || "Alex Thorne");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 839-1029");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "1992-04-14");
  const [nationality, setNationality] = useState(user?.nationality || "US");
  const [preferredCurrency, setPreferredCurrency] = useState(user?.preferredCurrency || "USD");
  const [homeAirport, setHomeAirport] = useState(user?.homeAirport || "SFO");
  const [seatPreference, setSeatPreference] = useState(user?.seatPreference || "WINDOW");
  const [mealPreference, setMealPreference] = useState(user?.mealPreference || "STANDARD");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Travelers
  const [travelers, setTravelers] = useState<TravelerProfile[]>([]);
  const [loadingTravelers, setLoadingTravelers] = useState(true);
  const [showAddTravelerModal, setShowAddTravelerModal] = useState(false);

  // New Traveler Form
  const [newTraveler, setNewTraveler] = useState<TravelerProfile>({
    title: "Ms",
    firstName: "",
    lastName: "",
    dateOfBirth: "1995-06-12",
    gender: "FEMALE",
    nationality: "US",
    passportNumber: "",
    passportExpiry: "2032-10-15",
    frequentFlyerAirline: "Aetheria Sky Alliance",
    frequentFlyerNumber: "",
  });

  const fetchTravelers = async () => {
    setLoadingTravelers(true);
    try {
      const res = await fetch("/api/user/travelers");
      const data = await res.json();
      if (data.travelers) {
        setTravelers(data.travelers);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTravelers(false);
    }
  };

  useEffect(() => {
    fetchTravelers();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          dateOfBirth,
          nationality,
          preferredCurrency,
          homeAirport,
          seatPreference,
          mealPreference,
        }),
      });

      if (res.ok) {
        setProfileSuccessMsg("Profile preferences saved successfully!");
        refreshUser();
        setTimeout(() => setProfileSuccessMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateTraveler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/travelers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTraveler),
      });
      if (res.ok) {
        setShowAddTravelerModal(false);
        setNewTraveler({
          title: "Ms",
          firstName: "",
          lastName: "",
          dateOfBirth: "1995-06-12",
          gender: "FEMALE",
          nationality: "US",
          passportNumber: "",
          passportExpiry: "2032-10-15",
          frequentFlyerAirline: "Aetheria Sky Alliance",
          frequentFlyerNumber: "",
        });
        fetchTravelers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTraveler = async (id: string) => {
    try {
      await fetch(`/api/user/travelers?id=${id}`, { method: "DELETE" });
      fetchTravelers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <User className="w-3.5 h-3.5" /> Traveler Profile & Companions
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal travel documents, passport records, and saved companion travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personal Profile & Travel Settings */}
          <div className="lg:col-span-8 space-y-8">
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Personal Details</h3>
                <span className="text-xs font-mono text-slate-400">
                  {user?.email || "traveler@aetheria.com"}
                </span>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Nationality / Passport Country
                  </label>
                  <select
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
                  >
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="CA">Canada (CA)</option>
                    <option value="AU">Australia (AU)</option>
                    <option value="JP">Japan (JP)</option>
                    <option value="SG">Singapore (SG)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="FR">France (FR)</option>
                  </select>
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Flight & Cabin Preferences
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Home Base Airport
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SFO, JFK"
                      value={homeAirport}
                      onChange={(e) => setHomeAirport(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Seat Preference
                    </label>
                    <select
                      value={seatPreference}
                      onChange={(e) => setSeatPreference(e.target.value as typeof seatPreference)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
                    >
                      <option value="WINDOW">Window Seat</option>
                      <option value="AISLE">Aisle Seat</option>
                      <option value="ANY">No Preference</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Meal Preference
                    </label>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-sky-500 outline-hidden cursor-pointer"
                    >
                      <option value="STANDARD">Chef Special</option>
                      <option value="VEGAN">Vegan / Plant-Based</option>
                      <option value="HALAL">Halal</option>
                      <option value="KOSHER">Kosher</option>
                      <option value="GLUTEN_FREE">Gluten-Free</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-slate-900 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? "Saving Changes..." : "Save Preferences"}</span>
                </button>
              </div>
            </form>

            {/* Saved Travelers Directory */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Saved Travelers & Companions</h3>
                  <p className="text-xs text-slate-500">
                    Auto-fill companion traveler records during multi-passenger flight checkouts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddTravelerModal(true)}
                  className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Companion</span>
                </button>
              </div>

              {loadingTravelers ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading travelers...</div>
              ) : travelers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {travelers.map((t) => (
                    <div
                      key={t._id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-sm text-slate-900">
                            {t.title} {t.firstName} {t.lastName}
                          </div>
                          {t._id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTraveler(t._id!)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete companion"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-1">
                          Passport: {t.passportNumber} ({t.nationality})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          DOB: {t.dateOfBirth} • Exp: {t.passportExpiry}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No companion travelers saved yet. Click &quot;Add Companion&quot; to register family members.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Membership Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-sm tracking-wider uppercase">Stratosphere Tier</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-500 text-white uppercase">
                  {user?.membershipTier || "STRATOSPHERE"}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold">{user?.name || "Alex Thorne"}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active member since 2025 • Lifetime Miles: 42,800
                </p>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Flight Discount:</span>
                  <span className="font-bold text-sky-400">15% Automatic</span>
                </div>
                <div className="flex justify-between">
                  <span>Airport VIP Lounges:</span>
                  <span className="font-bold text-emerald-400">Unlimited Access</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Checked Baggage:</span>
                  <span className="font-bold text-white">+1x 23kg Free</span>
                </div>
              </div>

              <Link
                href="/membership"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Manage Membership Perks</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add Traveler Modal */}
      {showAddTravelerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add Companion Traveler</h3>
              <button
                type="button"
                onClick={() => setShowAddTravelerModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleCreateTraveler} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena"
                    value={newTraveler.firstName}
                    onChange={(e) => setNewTraveler({ ...newTraveler, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rostova"
                    value={newTraveler.lastName}
                    onChange={(e) => setNewTraveler({ ...newTraveler, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newTraveler.dateOfBirth}
                    onChange={(e) => setNewTraveler({ ...newTraveler, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium cursor-pointer"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passport Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. US54019283B"
                    value={newTraveler.passportNumber}
                    onChange={(e) =>
                      setNewTraveler({ ...newTraveler, passportNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTravelerModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Save Companion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
