import { describe, expect, it } from "vitest";
import {
  CABIN_FIELDS,
  filterAndSortFlights,
  parseFlightSearch,
  type FlightSearch,
  type SearchableFlight,
} from "@/lib/flight-search";
const criteria = (query: string): FlightSearch => {
  const result = parseFlightSearch(new URLSearchParams(query));
  if (!result.success) throw result.error;
  return result.data;
};
const flights: (SearchableFlight & { id: string })[] = [
  {
    id: "a",
    departureTime: "2026-11-01T09:00:00Z",
    durationMinutes: 400,
    stops: 0,
    airlineCode: "BA",
    refundable: true,
    basePrice: 800,
    premiumEconomyPrice: 1000,
    businessPrice: 2200,
    firstPrice: 4000,
  },
  {
    id: "b",
    departureTime: "2026-11-01T22:00:00Z",
    durationMinutes: 500,
    stops: 1,
    airlineCode: "AA",
    refundable: false,
    basePrice: 500,
    premiumEconomyPrice: 1200,
    businessPrice: 2000,
    firstPrice: 3500,
  },
];
describe("flight search", () => {
  it("accepts legacy homepage date/cabin parameters without losing the choice", () => {
    expect(
      criteria(
        "from=jfk&to=lhr&departure=2026-11-01&class=BUSINESS&passengers=3",
      ),
    ).toMatchObject({
      from: "JFK",
      to: "LHR",
      date: "2026-11-01",
      cabin: "BUSINESS",
      passengers: 3,
    });
  });
  it.each([
    "date=2026-02-30",
    "date=garbage",
    "from=JFK&to=JFK",
    "passengers=0",
    "passengers=1.5",
    "passengers=10",
    "maxPrice=NaN",
    "maxPrice=-2",
    "minPrice=900&maxPrice=400",
    "cabin=unknown",
    "stops=nope",
  ])("rejects invalid criteria: %s", (query) => {
    expect(parseFlightSearch(new URLSearchParams(query)).success).toBe(false);
  });
  it("uses the correct cabin's fare when sorting and applying the budget", () => {
    expect(
      filterAndSortFlights(
        flights,
        criteria("cabin=BUSINESS&maxPrice=2100&sort=cheapest"),
      ).map((flight) => flight.id),
    ).toEqual(["b"]);
    expect(
      filterAndSortFlights(flights, criteria("sort=cheapest")).map(
        (flight) => flight.id,
      ),
    ).toEqual(["b", "a"]);
  });
  it("applies combined airline, stop, refund, and UTC time filters", () => {
    expect(
      filterAndSortFlights(
        flights,
        criteria("stops=0&airlines=BA&refundable=true&timeWindow=morning"),
      ),
    ).toHaveLength(1);
    expect(
      filterAndSortFlights(flights, criteria("stops=0&maxPrice=600")),
    ).toHaveLength(0);
    expect(
      filterAndSortFlights(flights, criteria("timeWindow=night")),
    ).toHaveLength(0);
  });
  it("never mutates the original inventory order", () => {
    filterAndSortFlights(flights, criteria("sort=latest"));
    expect(flights.map((flight) => flight.id)).toEqual(["a", "b"]);
  });
  it("maps premium and first cabins to their own capacity fields", () => {
    expect(CABIN_FIELDS.PREMIUM_ECONOMY.seats).toBe(
      "premiumEconomySeatsAvailable",
    );
    expect(CABIN_FIELDS.FIRST.seats).toBe("firstSeatsAvailable");
  });
});
