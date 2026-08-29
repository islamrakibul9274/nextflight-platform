import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Flight } from "@/models/Flight";
import { User } from "@/models/User";
import { Airport } from "@/models/Airport";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    // Allow in development or if role is ADMIN
    if (session && session.role !== "ADMIN" && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized access to admin portal" }, { status: 403 });
    }

    await connectDB();

    const [bookings, flights, users, airports] = await Promise.all([
      Booking.find({}).sort({ createdAt: -1 }).limit(100).lean(),
      Flight.find({}).lean(),
      User.find({}).lean(),
      Airport.find({}).lean(),
    ]);

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "PAID" || b.status === "CONFIRMED")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const activeBookingsCount = bookings.filter((b) => b.status === "CONFIRMED").length;
    const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
    const totalPassengers = bookings.reduce(
      (sum, b) => sum + (b.passengers?.length || 1),
      0
    );

    // Monthly revenue simulation data for charts
    const monthlyRevenue = [
      { month: "Jan", revenue: 420000, bookings: 380, loadFactor: 84 },
      { month: "Feb", revenue: 490000, bookings: 440, loadFactor: 86 },
      { month: "Mar", revenue: 610000, bookings: 530, loadFactor: 89 },
      { month: "Apr", revenue: 580000, bookings: 510, loadFactor: 87 },
      { month: "May", revenue: 720000, bookings: 640, loadFactor: 91 },
      { month: "Jun", revenue: 890000, bookings: 790, loadFactor: 94 },
      { month: "Jul", revenue: 980000, bookings: 880, loadFactor: 96 },
      { month: "Aug", revenue: 940000, bookings: 850, loadFactor: 95 },
    ];

    // Airline distribution
    const airlineShare = [
      { name: "Aetheria Flagship", share: 44, value: 520000 },
      { name: "Singapore Airlines", share: 18, value: 210000 },
      { name: "Emirates", share: 15, value: 180000 },
      { name: "Qatar Airways", share: 12, value: 140000 },
      { name: "Others", share: 11, value: 130000 },
    ];

    // Popular routes
    const popularRoutes = [
      { route: "JFK ⇄ LHR", volume: "1,420 trips", revenue: "$824,000", onTime: "96.4%" },
      { route: "SFO ⇄ HND", volume: "1,180 trips", revenue: "$967,600", onTime: "98.1%" },
      { route: "LAX ⇄ SYD", volume: "840 trips", revenue: "$991,200", onTime: "95.8%" },
      { route: "LHR ⇄ DXB", volume: "990 trips", revenue: "$613,800", onTime: "97.2%" },
      { route: "SIN ⇄ HND", volume: "780 trips", revenue: "$382,200", onTime: "99.0%" },
    ];

    return NextResponse.json({
      metrics: {
        totalRevenue,
        activeBookingsCount,
        cancelledCount,
        totalPassengers,
        totalFlights: flights.length,
        totalUsers: users.length,
        totalAirports: airports.length,
        conversionRate: "4.82%",
        averageLoadFactor: "91.4%",
      },
      monthlyRevenue,
      airlineShare,
      popularRoutes,
      recentBookings: bookings.slice(0, 10),
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch admin statistics" }, { status: 500 });
  }
}
