import { z } from "zod";

export const CABIN_FIELDS = {
  ECONOMY: {
    price: "basePrice",
    seats: "economySeatsAvailable",
    label: "Economy",
  },
  PREMIUM_ECONOMY: {
    price: "premiumEconomyPrice",
    seats: "premiumEconomySeatsAvailable",
    label: "Premium economy",
  },
  BUSINESS: {
    price: "businessPrice",
    seats: "businessSeatsAvailable",
    label: "Business",
  },
  FIRST: { price: "firstPrice", seats: "firstSeatsAvailable", label: "First" },
} as const;
export type Cabin = keyof typeof CABIN_FIELDS;
export function normalizeCabin(value: string | null): Cabin {
  return value && value.toUpperCase() in CABIN_FIELDS
    ? (value.toUpperCase() as Cabin)
    : "ECONOMY";
}

export function isCalendarDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

const optionalCode = z
  .string()
  .regex(/^[A-Z]{3}$/, "Use a three-letter airport code.")
  .optional();
const schema = z
  .object({
    from: optionalCode,
    to: optionalCode,
    date: z
      .string()
      .refine(isCalendarDate, "Choose a valid travel date.")
      .optional(),
    cabin: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]),
    passengers: z.coerce.number().int().min(1).max(9),
    stops: z.string().regex(/^(all|[0-2](,[0-2])*)$/),
    airlines: z.array(z.string().regex(/^[A-Z0-9]{2,3}$/)),
    minPrice: z.coerce.number().finite().min(0).optional(),
    maxPrice: z.coerce.number().finite().min(0).optional(),
    timeWindow: z.enum(["all", "morning", "afternoon", "evening", "night"]),
    refundable: z.boolean(),
    sort: z.enum(["recommended", "cheapest", "fastest", "earliest", "latest"]),
  })
  .refine((value) => !value.from || !value.to || value.from !== value.to, {
    message: "Departure and arrival airports must be different.",
  })
  .refine(
    (value) =>
      value.minPrice === undefined ||
      value.maxPrice === undefined ||
      value.minPrice <= value.maxPrice,
    { message: "The price range is invalid." },
  );

export function parseFlightSearch(params: URLSearchParams) {
  return schema.safeParse({
    from: params.get("from")?.trim().toUpperCase() || undefined,
    to: params.get("to")?.trim().toUpperCase() || undefined,
    date: params.get("date") || params.get("departure") || undefined,
    cabin: (
      params.get("cabin") ||
      params.get("class") ||
      "ECONOMY"
    ).toUpperCase(),
    passengers: params.get("passengers") || params.get("adults") || 1,
    stops: params.get("stops") || "all",
    airlines: (params.get("airlines") || "")
      .split(",")
      .map((code) => code.trim().toUpperCase())
      .filter(Boolean),
    minPrice: params.get("minPrice") || undefined,
    maxPrice: params.get("maxPrice") || undefined,
    timeWindow: params.get("timeWindow") || "all",
    refundable: params.get("refundable") === "true",
    sort: params.get("sort") || "recommended",
  });
}
export type FlightSearch = z.infer<typeof schema>;

export interface SearchableFlight {
  departureTime: Date | string;
  durationMinutes: number;
  stops: number;
  airlineCode: string;
  refundable: boolean;
  basePrice: number;
  premiumEconomyPrice: number;
  businessPrice: number;
  firstPrice: number;
}

export function filterAndSortFlights<T extends SearchableFlight>(
  flights: T[],
  criteria: FlightSearch,
) {
  const priceField = CABIN_FIELDS[criteria.cabin].price;
  const stops =
    criteria.stops === "all" ? null : criteria.stops.split(",").map(Number);
  return flights
    .filter((flight) => {
      const price = flight[priceField];
      const hour = new Date(flight.departureTime).getUTCHours();
      const timeMatches =
        criteria.timeWindow === "all" ||
        (criteria.timeWindow === "morning" && hour >= 6 && hour < 12) ||
        (criteria.timeWindow === "afternoon" && hour >= 12 && hour < 18) ||
        (criteria.timeWindow === "evening" && hour >= 18) ||
        (criteria.timeWindow === "night" && hour < 6);
      return (
        Number.isFinite(price) &&
        price > 0 &&
        (!stops || stops.includes(flight.stops)) &&
        (!criteria.airlines.length ||
          criteria.airlines.includes(flight.airlineCode)) &&
        (criteria.minPrice === undefined || price >= criteria.minPrice) &&
        (criteria.maxPrice === undefined || price <= criteria.maxPrice) &&
        (!criteria.refundable || flight.refundable) &&
        timeMatches
      );
    })
    .sort((a, b) => {
      if (criteria.sort === "cheapest") return a[priceField] - b[priceField];
      if (criteria.sort === "fastest")
        return a.durationMinutes - b.durationMinutes;
      if (criteria.sort === "earliest")
        return +new Date(a.departureTime) - +new Date(b.departureTime);
      if (criteria.sort === "latest")
        return +new Date(b.departureTime) - +new Date(a.departureTime);
      return (
        a[priceField] * 0.4 +
        a.durationMinutes * 0.8 +
        a.stops * 200 -
        (b[priceField] * 0.4 + b.durationMinutes * 0.8 + b.stops * 200)
      );
    });
}
