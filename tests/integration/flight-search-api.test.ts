import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const { find, airportFind, connect } = vi.hoisted(() => ({
  find: vi.fn(),
  airportFind: vi.fn(),
  connect: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ connectDB: connect }));
vi.mock("@/models/Flight", () => ({ Flight: { find } }));
vi.mock("@/models/Airport", () => ({ Airport: { findOne: airportFind } }));
import { GET } from "@/app/api/flights/search/route";
const flight = {
  _id: "test-flight",
  airlineCode: "BA",
  airlineName: "British Airways",
  airlineLogo: "BA",
  departureTime: new Date("2026-11-01T09:00:00Z"),
  durationMinutes: 400,
  stops: 0,
  refundable: true,
  basePrice: 800,
  premiumEconomyPrice: 1000,
  businessPrice: 2200,
  firstPrice: 4000,
};
describe("flight search API", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-24T12:00:00Z"));
    find.mockReset().mockImplementation(() => ({ lean: async () => [] }));
    airportFind
      .mockReset()
      .mockImplementation(() => ({ lean: async () => null }));
    connect.mockReset().mockResolvedValue(undefined);
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("validates inputs before connecting to the database", async () => {
    const response = await GET(
      new Request("http://localhost/api/flights/search?date=2026-02-30"),
    );
    expect(response.status).toBe(400);
    expect(connect).not.toHaveBeenCalled();
  });
  it("returns an empty exact search without broadening to unrelated flights", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/flights/search?from=JFK&to=LHR&date=2026-11-01&cabin=FIRST&passengers=3",
      ),
    );
    expect((await response.json()).flights).toEqual([]);
    expect(find).toHaveBeenCalledTimes(2); // Exact inventory plus nearby-date inventory only.
    expect(find.mock.calls[0][0]).toMatchObject({
      originAirport: "JFK",
      destinationAirport: "LHR",
      firstSeatsAvailable: { $gte: 3 },
      status: { $in: ["SCHEDULED", "BOARDING", "DELAYED"] },
      departureTime: {
        $gte: new Date("2026-11-01T00:00:00Z"),
        $lt: new Date("2026-11-02T00:00:00Z"),
      },
    });
  });
  it("shows real nearby fares and null for dates without matching flights", async () => {
    find.mockImplementation(() => ({ lean: async () => [flight] }));
    const response = await GET(
      new Request(
        "http://localhost/api/flights/search?from=JFK&to=LHR&date=2026-11-01&cabin=BUSINESS",
      ),
    );
    const body = await response.json();
    expect(
      body.dateMatrix.find((day: { date: string }) => day.date === "2026-11-01")
        .minPrice,
    ).toBe(2200);
    expect(
      body.dateMatrix.find((day: { date: string }) => day.date === "2026-11-02")
        .minPrice,
    ).toBeNull();
  });
  it("keeps available airline options when a budget filters every result", async () => {
    find.mockImplementation(() => ({ lean: async () => [flight] }));
    const response = await GET(
      new Request(
        "http://localhost/api/flights/search?from=JFK&to=LHR&date=2026-11-01&maxPrice=100",
      ),
    );
    const body = await response.json();
    expect(body.flights).toEqual([]);
    expect(body.filters.airlines.BA.count).toBe(1);
    expect(body.filters.maxPrice).toBe(800);
  });
});
