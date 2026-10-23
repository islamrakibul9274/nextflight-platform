"use client";

import { useSyncExternalStore } from "react";
import { localDateInput } from "./search-dates";

// Hydrate from the same empty snapshot, then use the traveler's local calendar.
function subscribe(callback: () => void) {
  const timer = window.setInterval(callback, 60_000);
  window.addEventListener("focus", callback);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", callback);
  };
}
const getToday = () => localDateInput(new Date());
const getServerToday = () => "";
export function useLocalToday() {
  return useSyncExternalStore(subscribe, getToday, getServerToday);
}
