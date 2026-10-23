import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Flight } from "@/models/Flight";
import { Airport } from "@/models/Airport";
import {
  CABIN_FIELDS,
  filterAndSortFlights,
  parseFlightSearch,
} from "@/lib/flight-search";

export async function GET(req: Request) {
  const parsed = parseFlightSearch(new URL(req.url).searchParams);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid search criteria." },
      { status: 400 },
    );
  }
  try {
    const criteria = parsed.data;
    const { from, to, date, cabin, passengers } = criteria;
    const now = new Date();
    const start = date
      ? new Date(`${date}T00:00:00Z`)
      : new Date(now.toISOString().slice(0, 10) + "T00:00:00Z");
    const end = new Date(start.getTime() + 86400000);
    const priceField = CABIN_FIELDS[cabin].price;
    // Route, date, capacity, and operational status always constrain results.
    const baseQuery = {
      ...(from ? { originAirport: from } : {}),
      ...(to ? { destinationAirport: to } : {}),
      status: { $in: ["SCHEDULED", "BOARDING", "DELAYED"] as const },
      [CABIN_FIELDS[cabin].seats]: { $gte: passengers },
      [priceField]: { $gt: 0 },
    };
    await connectDB();
    const matrixStart = new Date(
      Math.max(start.getTime() - 3 * 86400000, now.getTime()),
    );
    const matrixEnd = new Date(start.getTime() + 4 * 86400000);
    const [candidates, nearby, origin, destination] = await Promise.all([
      Flight.find({
        ...baseQuery,
        departureTime: {
          $gte: new Date(Math.max(start.getTime(), now.getTime())),
          ...(date ? { $lt: end } : {}),
        },
      }).lean(),
      Flight.find({
        ...baseQuery,
        departureTime: { $gte: matrixStart, $lt: matrixEnd },
      }).lean(),
      from ? Airport.findOne({ iataCode: from }).lean() : null,
      to ? Airport.findOne({ iataCode: to }).lean() : null,
    ]);
    const flights = filterAndSortFlights(candidates, criteria);
    // Filter options come from route/date inventory, so choosing a filter doesn't erase other options.
    const prices = candidates.map((flight) => flight[priceField]);
    const airlines: Record<
      string,
      { name: string; count: number; logo: string }
    > = {};
    for (const flight of candidates) {
      airlines[flight.airlineCode] ??= {
        name: flight.airlineName,
        count: 0,
        logo: flight.airlineLogo,
      };
      airlines[flight.airlineCode].count++;
    }
    const nearbyMatches = filterAndSortFlights(nearby, criteria);
    const dateMatrix = [];
    for (let offset = -3; offset <= 3; offset++) {
      const day = new Date(start.getTime() + offset * 86400000);
      const dateString = day.toISOString().slice(0, 10);
      if (dateString < now.toISOString().slice(0, 10)) continue;
      const fares = nearbyMatches
        .filter(
          (flight) =>
            new Date(flight.departureTime).toISOString().slice(0, 10) ===
            dateString,
        )
        .map((flight) => flight[priceField]);
      dateMatrix.push({
        date: dateString,
        minPrice: fares.length ? Math.min(...fares) : null,
        formattedDate: new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }).format(day),
      });
    }
    return NextResponse.json({
      flights,
      count: flights.length,
      filters: {
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
        airlines,
      },
      dateMatrix,
      routeInfo: { origin, destination },
    });
  } catch (error: unknown) {
    const { serverError } = await import("@/lib/api-error");
    return serverError("Flight search error", error);
  }
}
