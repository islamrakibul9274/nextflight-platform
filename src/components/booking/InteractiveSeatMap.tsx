"use client";

import React, { useState } from "react";
import { Plane, Check, Sparkles } from "lucide-react";

export interface SeatInfo {
  seatNumber: string;
  type: "STANDARD" | "EXTRA_LEGROOM" | "BUSINESS" | "EXIT_ROW";
  price: number;
  isWindow: boolean;
  isAisle: boolean;
}

interface InteractiveSeatMapProps {
  selectedSeat: string | null;
  onSelectSeat: (seat: SeatInfo) => void;
  cabinClass?: string;
}

export function InteractiveSeatMap({
  selectedSeat,
  onSelectSeat,
  cabinClass = "ECONOMY",
}: InteractiveSeatMapProps) {
  // Occupied seats list for realism
  const occupiedSeats = new Set([
    "1A", "1D", "2B", "3C", "4A", "4F", "6C", "7D", "8A", "9B", "10E", "12A", "12F", "14C", "16B", "18E", "20A", "22F",
  ]);

  const rows = [
    // Business / First Class (Rows 1-3)
    { row: 1, type: "BUSINESS", price: 120, seats: ["A", "", "C", "D", "", "F"] },
    { row: 2, type: "BUSINESS", price: 120, seats: ["A", "", "C", "D", "", "F"] },
    { row: 3, type: "BUSINESS", price: 120, seats: ["A", "", "C", "D", "", "F"] },

    // Extra Legroom (Rows 4-7)
    { row: 4, type: "EXTRA_LEGROOM", price: 35, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 5, type: "EXTRA_LEGROOM", price: 35, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 6, type: "EXTRA_LEGROOM", price: 35, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 7, type: "EXTRA_LEGROOM", price: 35, seats: ["A", "B", "C", "D", "E", "F"] },

    // Exit Row (Row 14)
    { row: 14, type: "EXIT_ROW", price: 25, seats: ["A", "B", "C", "D", "E", "F"] },

    // Standard Economy (Rows 8-20)
    { row: 8, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 9, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 10, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 11, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 12, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 15, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 16, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 17, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
    { row: 18, type: "STANDARD", price: 0, seats: ["A", "B", "C", "D", "E", "F"] },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-6 shadow-2xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plane className="w-5 h-5 text-sky-600" />
          Interactive Aircraft Seat Map (Boeing 787-9)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select your preferred seat. Standard seats are free; extra legroom suites are labeled with price.
        </p>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-sky-600 border border-sky-700" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-100 border border-slate-300" />
          <span>Standard ($0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-sky-100 border border-sky-300" />
          <span>Extra Legroom ($35)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-indigo-100 border border-indigo-300" />
          <span>Lie-Flat Suite ($120)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-200 opacity-40 border border-slate-300" />
          <span>Occupied</span>
        </div>
      </div>

      {/* Fuselage Container */}
      <div className="max-w-md mx-auto bg-slate-50/70 rounded-3xl border-2 border-slate-200 p-6 relative">
        {/* Cockpit Curve Header */}
        <div className="text-center pb-6">
          <div className="w-24 h-10 bg-slate-200 rounded-t-full mx-auto border-t-2 border-x-2 border-slate-300 flex items-center justify-center">
            <span className="text-[9px] font-mono font-bold uppercase text-slate-500">
              Cockpit
            </span>
          </div>
        </div>

        {/* Seat Column Labels */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono font-bold text-slate-400 mb-3">
          <span>A</span>
          <span>B</span>
          <span>C</span>
          <span className="text-[10px] text-slate-300">AISLE</span>
          <span>D</span>
          <span>E</span>
          <span>F</span>
        </div>

        {/* Seat Rows */}
        <div className="space-y-2">
          {rows.map((rowItem) => {
            return (
              <div key={rowItem.row} className="grid grid-cols-7 gap-1.5 items-center">
                {/* Left 3 seats (A, B, C) */}
                {rowItem.seats.slice(0, 3).map((col, idx) => {
                  if (!col) return <div key={idx} className="w-8 h-8" />;
                  const seatId = `${rowItem.row}${col}`;
                  const isOccupied = occupiedSeats.has(seatId);
                  const isSelected = selectedSeat === seatId;

                  const isBusiness = rowItem.type === "BUSINESS";
                  const isExtra = rowItem.type === "EXTRA_LEGROOM" || rowItem.type === "EXIT_ROW";

                  return (
                    <button
                      key={col}
                      type="button"
                      disabled={isOccupied}
                      onClick={() =>
                        onSelectSeat({
                          seatNumber: seatId,
                          type: rowItem.type as SeatInfo["type"],
                          price: rowItem.price,
                          isWindow: col === "A" || col === "F",
                          isAisle: col === "C" || col === "D",
                        })
                      }
                      className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        isSelected
                          ? "bg-sky-600 text-white shadow-xs scale-105"
                          : isOccupied
                          ? "bg-slate-200/80 text-slate-400 cursor-not-allowed opacity-50"
                          : isBusiness
                          ? "bg-indigo-100 text-indigo-900 border border-indigo-300 hover:bg-indigo-200"
                          : isExtra
                          ? "bg-sky-100 text-sky-900 border border-sky-300 hover:bg-sky-200"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-sky-500 hover:bg-sky-50"
                      }`}
                      title={
                        isOccupied
                          ? `Seat ${seatId} Occupied`
                          : `Seat ${seatId} (${rowItem.type}) - $${rowItem.price}`
                      }
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : seatId}
                    </button>
                  );
                })}

                {/* Aisle Row Number */}
                <div className="text-center font-mono text-xs font-bold text-slate-400">
                  {rowItem.row}
                </div>

                {/* Right 3 seats (D, E, F) */}
                {rowItem.seats.slice(3, 6).map((col, idx) => {
                  if (!col) return <div key={idx} className="w-8 h-8" />;
                  const seatId = `${rowItem.row}${col}`;
                  const isOccupied = occupiedSeats.has(seatId);
                  const isSelected = selectedSeat === seatId;

                  const isBusiness = rowItem.type === "BUSINESS";
                  const isExtra = rowItem.type === "EXTRA_LEGROOM" || rowItem.type === "EXIT_ROW";

                  return (
                    <button
                      key={col}
                      type="button"
                      disabled={isOccupied}
                      onClick={() =>
                        onSelectSeat({
                          seatNumber: seatId,
                          type: rowItem.type as SeatInfo["type"],
                          price: rowItem.price,
                          isWindow: col === "A" || col === "F",
                          isAisle: col === "C" || col === "D",
                        })
                      }
                      className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        isSelected
                          ? "bg-sky-600 text-white shadow-xs scale-105"
                          : isOccupied
                          ? "bg-slate-200/80 text-slate-400 cursor-not-allowed opacity-50"
                          : isBusiness
                          ? "bg-indigo-100 text-indigo-900 border border-indigo-300 hover:bg-indigo-200"
                          : isExtra
                          ? "bg-sky-100 text-sky-900 border border-sky-300 hover:bg-sky-200"
                          : "bg-white text-slate-700 border border-slate-200 hover:border-sky-500 hover:bg-sky-50"
                      }`}
                      title={
                        isOccupied
                          ? `Seat ${seatId} Occupied`
                          : `Seat ${seatId} (${rowItem.type}) - $${rowItem.price}`
                      }
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : seatId}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Seat Feedback */}
      {selectedSeat && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500">Selected Seat: </span>
            <span className="font-extrabold text-sky-900 font-mono text-sm">{selectedSeat}</span>
          </div>
          <span className="font-semibold text-sky-700">Seat confirmed for Passenger 1</span>
        </div>
      )}
    </div>
  );
}
