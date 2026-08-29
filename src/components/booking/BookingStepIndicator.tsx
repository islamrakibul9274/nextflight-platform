import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number; // 1 to 5
}

export function BookingStepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: "Fare Tier" },
    { num: 2, label: "Passengers" },
    { num: 3, label: "Seats & Add-ons" },
    { num: 4, label: "Review Fare" },
    { num: 5, label: "Secure Payment" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-sky-600 -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-sky-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-slate-900 text-white ring-4 ring-sky-100 shadow-xs"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.num}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                  isCurrent ? "text-slate-900 font-bold" : isCompleted ? "text-sky-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
