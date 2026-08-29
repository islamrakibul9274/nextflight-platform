import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Flight } from "@/models/Flight";
import { Airport } from "@/models/Airport";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from")?.trim().toUpperCase();
    const to = searchParams.get("to")?.trim().toUpperCase();
    const departureDate = searchParams.get("date"); // YYYY-MM-DD
    const cabin = (searchParams.get("cabin") || "ECONOMY").toUpperCase();
    const stopsParam = searchParams.get("stops");
    const airlinesParam = searchParams.get("airlines");
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const timeWindow = searchParams.get("timeWindow"); // 'morning' | 'afternoon' | 'evening' | 'night'
    const refundableOnly = searchParams.get("refundable") === "true";
    const sortBy = searchParams.get("sort") || "recommended";

    await connectDB();

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (from) {
      query.originAirport = from;
    }
    if (to) {
      query.destinationAirport = to;
    }

    if (departureDate) {
      const start = new Date(departureDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(departureDate);
      end.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: start, $lte: end };
    } else {
      // Show upcoming flights from today onwards
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      query.departureTime = { $gte: start };
    }

    if (stopsParam !== null && stopsParam !== undefined && stopsParam !== "all" && stopsParam !== "") {
      const stopNums = stopsParam.split(",").map(Number).filter((n) => !isNaN(n));
      if (stopNums.length > 0) {
        query.stops = { $in: stopNums };
      }
    }

    if (airlinesParam) {
      const airlineCodes = airlinesParam.split(",").map((c) => c.trim().toUpperCase());
      query.airlineCode = { $in: airlineCodes };
    }

    // Price field based on cabin
    const priceField =
      cabin === "FIRST"
        ? "firstPrice"
        : cabin === "BUSINESS"
        ? "businessPrice"
        : cabin === "PREMIUM_ECONOMY"
        ? "premiumEconomyPrice"
        : "basePrice";

    if (minPrice !== null || maxPrice !== null) {
      query[priceField] = {};
      if (minPrice !== null) query[priceField].$gte = minPrice;
      if (maxPrice !== null) query[priceField].$lte = maxPrice;
    }

    if (refundableOnly) {
      query.refundable = true;
    }

    let flights = await Flight.find(query).lean();

    // If exact date matched 0 flights and from/to were specified, expand search to any upcoming date for those airports
    if (flights.length === 0 && (from || to)) {
      const fallbackQuery: Record<string, unknown> = {};
      if (from) fallbackQuery.originAirport = from;
      if (to) fallbackQuery.destinationAirport = to;
      fallbackQuery.departureTime = { $gte: new Date() };
      flights = await Flight.find(fallbackQuery).limit(30).lean();
    }

    // If still 0 flights, return featured/popular flights
    if (flights.length === 0) {
      flights = await Flight.find({ departureTime: { $gte: new Date() } })
        .limit(20)
        .lean();
    }

    // Time window filtering
    if (timeWindow && timeWindow !== "all") {
      flights = flights.filter((f) => {
        const hour = new Date(f.departureTime).getHours();
        if (timeWindow === "morning") return hour >= 6 && hour < 12;
        if (timeWindow === "afternoon") return hour >= 12 && hour < 18;
        if (timeWindow === "evening") return hour >= 18 && hour <= 23;
        if (timeWindow === "night") return hour >= 0 && hour < 6;
        return true;
      });
    }

    // Sorting
    flights.sort((a, b) => {
      const priceA =
        cabin === "FIRST"
          ? a.firstPrice
          : cabin === "BUSINESS"
          ? a.businessPrice
          : cabin === "PREMIUM_ECONOMY"
          ? a.premiumEconomyPrice
          : a.basePrice;
      const priceB =
        cabin === "FIRST"
          ? b.firstPrice
          : cabin === "BUSINESS"
          ? b.businessPrice
          : cabin === "PREMIUM_ECONOMY"
          ? b.premiumEconomyPrice
          : b.basePrice;

      if (sortBy === "cheapest") return priceA - priceB;
      if (sortBy === "fastest") return a.durationMinutes - b.durationMinutes;
      if (sortBy === "earliest")
        return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      if (sortBy === "latest")
        return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();

      // Recommended: combination of price, stops, duration
      const scoreA = priceA * 0.4 + a.durationMinutes * 0.8 + a.stops * 200;
      const scoreB = priceB * 0.4 + b.durationMinutes * 0.8 + b.stops * 200;
      return scoreA - scoreB;
    });

    // Compute aggregation stats for filters
    const allPrices = flights.map((f) =>
      cabin === "FIRST"
        ? f.firstPrice
        : cabin === "BUSINESS"
        ? f.businessPrice
        : cabin === "PREMIUM_ECONOMY"
        ? f.premiumEconomyPrice
        : f.basePrice
    );
    const minCalculatedPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
    const maxCalculatedPrice = allPrices.length > 0 ? Math.max(...allPrices) : 2000;

    const airlineCounts: Record<string, { name: string; count: number; logo: string }> = {};
    flights.forEach((f) => {
      if (!airlineCounts[f.airlineCode]) {
        airlineCounts[f.airlineCode] = { name: f.airlineName, count: 0, logo: f.airlineLogo };
      }
      airlineCounts[f.airlineCode].count++;
    });

    // Flexible date matrix +/- 3 days prices
    const dateMatrix: Array<{ date: string; minPrice: number; formattedDate: string }> = [];
    const baseDate = departureDate ? new Date(departureDate) : new Date();
    for (let offset = -3; offset <= 3; offset++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + offset);
      const dateStr = d.toISOString().split("T")[0];
      const approxPrice = Math.max(
        180,
        Math.round(minCalculatedPrice + (Math.sin(offset * 2) * 45 + offset * 12))
      );
      dateMatrix.push({
        date: dateStr,
        minPrice: approxPrice,
        formattedDate: new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(d),
      });
    }

    // Fetch origin and dest airport details if available
    let originInfo = null;
    let destInfo = null;
    if (from) originInfo = await Airport.findOne({ iataCode: from }).lean();
    if (to) destInfo = await Airport.findOne({ iataCode: to }).lean();

    return NextResponse.json({
      flights,
      count: flights.length,
      filters: {
        minPrice: minCalculatedPrice,
        maxPrice: maxCalculatedPrice,
        airlines: airlineCounts,
      },
      dateMatrix,
      routeInfo: {
        origin: originInfo,
        destination: destInfo,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Flight search error:", err);
    return NextResponse.json({ flights: [], error: err.message }, { status: 500 });
  }
}
