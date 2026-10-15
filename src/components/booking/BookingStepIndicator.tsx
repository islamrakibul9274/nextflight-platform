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

  const safeStep = Math.min(Math.max(currentStep, 1), steps.length);
  const progress = ((safeStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav aria-label="Booking progress" className="w-full max-w-4xl mx-auto py-6">
      <ol className="relative flex items-start justify-between">
        {/* Track + fill run through circle centers only (circle is w-9/h-9 = 36px, center at 18px) */}
        <div aria-hidden className="absolute left-[18px] right-[18px] top-[18px] h-0.5 bg-slate-200" />
        <div
          aria-hidden
          className="absolute left-[18px] top-[18px] h-0.5 bg-sky-600 transition-all duration-200"
          style={{ width: `calc(${progress}% - ${(progress / 100) * 36}px)` }}
        />

        {steps.map((step) => {
          const isCompleted = safeStep > step.num;
          const isCurrent = safeStep === step.num;

          return (
            <li key={step.num} className="relative z-10 flex w-9 flex-col items-center">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-sky-600 text-white shadow-sm"
                    : isCurrent
                      ? "bg-sky-600 text-white ring-4 ring-sky-100 shadow-sm"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" aria-hidden /> : step.num}
              </div>
              <span
                className={`mt-1.5 hidden sm:block whitespace-nowrap text-center text-[11px] font-semibold ${
                  isCurrent ? "text-slate-900 font-bold" : isCompleted ? "text-sky-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
