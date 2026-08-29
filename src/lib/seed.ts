import { connectDB } from "./db";
import { User } from "@/models/User";
import { Airport } from "@/models/Airport";
import { Airline } from "@/models/Airline";
import { Aircraft } from "@/models/Aircraft";
import { Flight } from "@/models/Flight";
import { Coupon } from "@/models/Coupon";
import { MembershipPlan } from "@/models/MembershipPlan";
import { Review } from "@/models/Review";
import { Booking } from "@/models/Booking";
import { Traveler } from "@/models/Traveler";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  await connectDB();

  console.log("✈️ Starting AETHERIA database seeding...");

  // 1. Seed Airports
  await Airport.deleteMany({});
  const airports = await Airport.insertMany([
    {
      iataCode: "JFK",
      icaoCode: "KJFK",
      name: "John F. Kennedy International Airport",
      city: "New York",
      country: "United States",
      countryCode: "US",
      timezone: "America/New_York",
      latitude: 40.6413,
      longitude: -73.7781,
      terminals: 8,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    },
    {
      iataCode: "LHR",
      icaoCode: "EGLL",
      name: "London Heathrow Airport",
      city: "London",
      country: "United Kingdom",
      countryCode: "GB",
      timezone: "Europe/London",
      latitude: 51.47,
      longitude: -0.4543,
      terminals: 5,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    },
    {
      iataCode: "HND",
      icaoCode: "RJTT",
      name: "Tokyo Haneda Airport",
      city: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      timezone: "Asia/Tokyo",
      latitude: 35.5494,
      longitude: 139.7798,
      terminals: 3,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    },
    {
      iataCode: "NRT",
      icaoCode: "RJAA",
      name: "Narita International Airport",
      city: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      timezone: "Asia/Tokyo",
      latitude: 35.772,
      longitude: 140.3929,
      terminals: 3,
      isPopular: false,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    },
    {
      iataCode: "SIN",
      icaoCode: "WSSS",
      name: "Singapore Changi Airport",
      city: "Singapore",
      country: "Singapore",
      countryCode: "SG",
      timezone: "Asia/Singapore",
      latitude: 1.3644,
      longitude: 103.9915,
      terminals: 4,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    },
    {
      iataCode: "CDG",
      icaoCode: "LFPG",
      name: "Paris Charles de Gaulle Airport",
      city: "Paris",
      country: "France",
      countryCode: "FR",
      timezone: "Europe/Paris",
      latitude: 49.0097,
      longitude: 2.5479,
      terminals: 3,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    },
    {
      iataCode: "DXB",
      icaoCode: "OMDB",
      name: "Dubai International Airport",
      city: "Dubai",
      country: "United Arab Emirates",
      countryCode: "AE",
      timezone: "Asia/Dubai",
      latitude: 25.2532,
      longitude: 55.3657,
      terminals: 3,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    },
    {
      iataCode: "SFO",
      icaoCode: "KSFO",
      name: "San Francisco International Airport",
      city: "San Francisco",
      country: "United States",
      countryCode: "US",
      timezone: "America/Los_Angeles",
      latitude: 37.6213,
      longitude: -122.379,
      terminals: 4,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
    },
    {
      iataCode: "LAX",
      icaoCode: "KLAX",
      name: "Los Angeles International Airport",
      city: "Los Angeles",
      country: "United States",
      countryCode: "US",
      timezone: "America/Los_Angeles",
      latitude: 33.9416,
      longitude: -118.4085,
      terminals: 9,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&q=80",
    },
    {
      iataCode: "SYD",
      icaoCode: "YSSY",
      name: "Sydney Kingsford Smith Airport",
      city: "Sydney",
      country: "Australia",
      countryCode: "AU",
      timezone: "Australia/Sydney",
      latitude: -33.9461,
      longitude: 151.1772,
      terminals: 3,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
    },
    {
      iataCode: "FRA",
      icaoCode: "EDDF",
      name: "Frankfurt Airport",
      city: "Frankfurt",
      country: "Germany",
      countryCode: "DE",
      timezone: "Europe/Berlin",
      latitude: 50.0379,
      longitude: 8.5622,
      terminals: 2,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80",
    },
    {
      iataCode: "AMS",
      icaoCode: "EHAM",
      name: "Amsterdam Airport Schiphol",
      city: "Amsterdam",
      country: "Netherlands",
      countryCode: "NL",
      timezone: "Europe/Amsterdam",
      latitude: 52.3105,
      longitude: 4.7683,
      terminals: 1,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
    },
    {
      iataCode: "ZRH",
      icaoCode: "LSZH",
      name: "Zurich Airport",
      city: "Zurich",
      country: "Switzerland",
      countryCode: "CH",
      timezone: "Europe/Zurich",
      latitude: 47.4582,
      longitude: 8.5555,
      terminals: 2,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80",
    },
    {
      iataCode: "DOH",
      icaoCode: "OTHH",
      name: "Hamad International Airport",
      city: "Doha",
      country: "Qatar",
      countryCode: "QA",
      timezone: "Asia/Qatar",
      latitude: 25.2731,
      longitude: 51.6081,
      terminals: 1,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80",
    },
    {
      iataCode: "ICN",
      icaoCode: "RKSI",
      name: "Incheon International Airport",
      city: "Seoul",
      country: "South Korea",
      countryCode: "KR",
      timezone: "Asia/Seoul",
      latitude: 37.4602,
      longitude: 126.4407,
      terminals: 2,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80",
    },
    {
      iataCode: "HKG",
      icaoCode: "VHHH",
      name: "Hong Kong International Airport",
      city: "Hong Kong",
      country: "Hong Kong",
      countryCode: "HK",
      timezone: "Asia/Hong_Kong",
      latitude: 22.308,
      longitude: 113.9185,
      terminals: 2,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80",
    },
    {
      iataCode: "BCN",
      icaoCode: "LEBL",
      name: "Josep Tarradellas Barcelona-El Prat Airport",
      city: "Barcelona",
      country: "Spain",
      countryCode: "ES",
      timezone: "Europe/Madrid",
      latitude: 41.2974,
      longitude: 2.0833,
      terminals: 2,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    },
    {
      iataCode: "FCO",
      icaoCode: "LIRF",
      name: "Leonardo da Vinci–Fiumicino Airport",
      city: "Rome",
      country: "Italy",
      countryCode: "IT",
      timezone: "Europe/Rome",
      latitude: 41.8003,
      longitude: 12.2389,
      terminals: 4,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    },
    {
      iataCode: "YVR",
      icaoCode: "CYVR",
      name: "Vancouver International Airport",
      city: "Vancouver",
      country: "Canada",
      countryCode: "CA",
      timezone: "America/Vancouver",
      latitude: 49.1967,
      longitude: -123.1815,
      terminals: 3,
      isPopular: false,
      image: "https://images.unsplash.com/photo-1559511260-66a65e09b935?w=800&q=80",
    },
  ]);

  // 2. Seed Airlines
  await Airline.deleteMany({});
  const airlines = await Airline.insertMany([
    {
      code: "AE",
      name: "Aetheria Flagship Airways",
      logo: "✈️",
      country: "Global / United States",
      alliance: "Aetheria Sky Alliance",
      rating: 4.98,
      featured: true,
    },
    {
      code: "SQ",
      name: "Singapore Airlines",
      logo: "🇸🇬",
      country: "Singapore",
      alliance: "Star Alliance",
      rating: 4.92,
      featured: true,
    },
    {
      code: "EK",
      name: "Emirates",
      logo: "🇦🇪",
      country: "United Arab Emirates",
      alliance: "Emirates Group",
      rating: 4.9,
      featured: true,
    },
    {
      code: "QR",
      name: "Qatar Airways",
      logo: "🇶🇦",
      country: "Qatar",
      alliance: "oneworld",
      rating: 4.94,
      featured: true,
    },
    {
      code: "BA",
      name: "British Airways",
      logo: "🇬🇧",
      country: "United Kingdom",
      alliance: "oneworld",
      rating: 4.75,
      featured: true,
    },
    {
      code: "NH",
      name: "All Nippon Airways (ANA)",
      logo: "🇯🇵",
      country: "Japan",
      alliance: "Star Alliance",
      rating: 4.91,
      featured: true,
    },
    {
      code: "LH",
      name: "Lufthansa",
      logo: "🇩🇪",
      country: "Germany",
      alliance: "Star Alliance",
      rating: 4.78,
      featured: true,
    },
    {
      code: "DL",
      name: "Delta Air Lines",
      logo: "🇺🇸",
      country: "United States",
      alliance: "SkyTeam",
      rating: 4.79,
      featured: true,
    },
  ]);

  // 3. Seed Aircraft
  await Aircraft.deleteMany({});
  await Aircraft.insertMany([
    {
      model: "Boeing 787-9 Dreamliner",
      manufacturer: "Boeing",
      cabinLayout: "3-3-3",
      totalSeats: 290,
      economySeats: 218,
      premiumEconomySeats: 32,
      businessSeats: 32,
      firstSeats: 8,
      cruiseSpeedKmh: 913,
      seatPitchEconomyInches: 32,
      hasWifi: true,
      hasPower: true,
      hasLiveTv: true,
    },
    {
      model: "Airbus A350-1000 XWB",
      manufacturer: "Airbus",
      cabinLayout: "3-3-3",
      totalSeats: 369,
      economySeats: 275,
      premiumEconomySeats: 40,
      businessSeats: 46,
      firstSeats: 8,
      cruiseSpeedKmh: 905,
      seatPitchEconomyInches: 33,
      hasWifi: true,
      hasPower: true,
      hasLiveTv: true,
    },
    {
      model: "Airbus A380-800 Superjumbo",
      manufacturer: "Airbus",
      cabinLayout: "3-4-3",
      totalSeats: 516,
      economySeats: 399,
      premiumEconomySeats: 44,
      businessSeats: 60,
      firstSeats: 14,
      cruiseSpeedKmh: 945,
      seatPitchEconomyInches: 33,
      hasWifi: true,
      hasPower: true,
      hasLiveTv: true,
    },
  ]);

  // 4. Seed Membership Plans
  await MembershipPlan.deleteMany({});
  await MembershipPlan.insertMany([
    {
      tier: "VOYAGER",
      name: "Silver Voyager",
      tagline: "Essential privileges for modern travelers",
      monthlyPrice: 0,
      yearlyPrice: 0,
      flightDiscountPercent: 0,
      freeSeatSelection: false,
      freeExtraBaggage: false,
      loungeAccess: false,
      priorityBoarding: false,
      dedicatedConcierge: false,
      flexibleCancellations: false,
      badgeColor: "slate",
      isPopular: false,
    },
    {
      tier: "STRATOSPHERE",
      name: "Gold Stratosphere",
      tagline: "Unrestricted flexibility, lounge access, and guaranteed fare savings",
      monthlyPrice: 19,
      yearlyPrice: 190,
      flightDiscountPercent: 15,
      freeSeatSelection: true,
      freeExtraBaggage: true,
      loungeAccess: true,
      priorityBoarding: true,
      dedicatedConcierge: true,
      flexibleCancellations: true,
      badgeColor: "sky",
      isPopular: true,
    },
    {
      tier: "APEX",
      name: "Apex Black",
      tagline: "The absolute pinnacle of private-aviation tier bespoke global luxury",
      monthlyPrice: 49,
      yearlyPrice: 490,
      flightDiscountPercent: 20,
      freeSeatSelection: true,
      freeExtraBaggage: true,
      loungeAccess: true,
      priorityBoarding: true,
      dedicatedConcierge: true,
      flexibleCancellations: true,
      badgeColor: "indigo",
      isPopular: false,
    },
  ]);

  // 5. Seed Coupons
  await Coupon.deleteMany({});
  await Coupon.insertMany([
    {
      code: "FLYFIRST",
      description: "20% off all international flights across the network",
      discountType: "PERCENT",
      discountValue: 20,
      minOrderValue: 200,
      maxDiscount: 500,
      validUntil: new Date("2028-12-31"),
      usageLimit: 10000,
      timesUsed: 142,
      isActive: true,
    },
    {
      code: "AETHERIA2026",
      description: "$100 flat savings on long-haul transoceanic routes",
      discountType: "FIXED",
      discountValue: 100,
      minOrderValue: 400,
      validUntil: new Date("2028-12-31"),
      usageLimit: 5000,
      timesUsed: 89,
      isActive: true,
    },
    {
      code: "STRATOSPHERE",
      description: "15% off for Gold & Apex club members",
      discountType: "PERCENT",
      discountValue: 15,
      minOrderValue: 150,
      maxDiscount: 350,
      validUntil: new Date("2028-12-31"),
      usageLimit: 50000,
      timesUsed: 310,
      isActive: true,
    },
  ]);

  // 6. Seed Users
  await User.deleteMany({});
  const adminPassword = await hashPassword("admin123456");
  const travelerPassword = await hashPassword("traveler123");

  const adminUser = await User.create({
    name: "Aetheria Chief Admin",
    email: "admin@aetheria.com",
    passwordHash: adminPassword,
    role: "ADMIN",
    membershipTier: "APEX",
    phone: "+1 (555) 019-2834",
    nationality: "US",
    homeAirport: "JFK",
    preferredCurrency: "USD",
  });

  const travelerUser = await User.create({
    name: "Alex Thorne",
    email: "traveler@aetheria.com",
    passwordHash: travelerPassword,
    role: "USER",
    membershipTier: "STRATOSPHERE",
    phone: "+1 (555) 839-1029",
    nationality: "US",
    homeAirport: "SFO",
    preferredCurrency: "USD",
  });

  // 7. Seed Travelers
  await Traveler.deleteMany({});
  await Traveler.insertMany([
    {
      userId: travelerUser._id,
      title: "Mr",
      firstName: "Alex",
      lastName: "Thorne",
      dateOfBirth: "1992-04-14",
      gender: "MALE",
      nationality: "US",
      passportNumber: "US98234102A",
      passportExpiry: "2031-08-20",
      frequentFlyerAirline: "Aetheria Sky Alliance",
      frequentFlyerNumber: "AET-78902",
      isPrimary: true,
    },
    {
      userId: travelerUser._id,
      title: "Ms",
      firstName: "Elena",
      lastName: "Rostova",
      dateOfBirth: "1994-09-22",
      gender: "FEMALE",
      nationality: "US",
      passportNumber: "US54019283B",
      passportExpiry: "2032-02-15",
      frequentFlyerAirline: "Aetheria Sky Alliance",
      frequentFlyerNumber: "AET-78903",
      isPrimary: false,
    },
  ]);

  // 8. Seed Realistic Flights (120+ flights across next 90 days)
  await Flight.deleteMany({});

  const popularRoutes = [
    { from: "JFK", to: "LHR", dur: 420, base: 580, dist: 3450 },
    { from: "LHR", to: "JFK", dur: 470, base: 610, dist: 3450 },
    { from: "SFO", to: "HND", dur: 630, base: 820, dist: 5160 },
    { from: "HND", to: "SFO", dur: 580, base: 840, dist: 5160 },
    { from: "JFK", to: "CDG", dur: 450, base: 540, dist: 3620 },
    { from: "CDG", to: "JFK", dur: 495, base: 560, dist: 3620 },
    { from: "LHR", to: "DXB", dur: 410, base: 620, dist: 3400 },
    { from: "DXB", to: "LHR", dur: 460, base: 650, dist: 3400 },
    { from: "SIN", to: "HND", dur: 400, base: 490, dist: 3310 },
    { from: "HND", to: "SIN", dur: 415, base: 510, dist: 3310 },
    { from: "LAX", to: "SYD", dur: 890, base: 1180, dist: 7490 },
    { from: "SYD", to: "LAX", dur: 840, base: 1220, dist: 7490 },
    { from: "JFK", to: "SFO", dur: 360, base: 280, dist: 2580 },
    { from: "SFO", to: "JFK", dur: 330, base: 290, dist: 2580 },
    { from: "FRA", to: "JFK", dur: 510, base: 590, dist: 3850 },
    { from: "JFK", to: "FRA", dur: 465, base: 580, dist: 3850 },
    { from: "DXB", to: "SIN", dur: 440, base: 530, dist: 3630 },
    { from: "SIN", to: "DXB", dur: 465, base: 550, dist: 3630 },
    { from: "ZRH", to: "SIN", dur: 730, base: 890, dist: 6410 },
    { from: "LHR", to: "SIN", dur: 780, base: 920, dist: 6760 },
    { from: "DOH", to: "LHR", dur: 430, base: 640, dist: 3250 },
    { from: "ICN", to: "SFO", dur: 610, base: 790, dist: 5650 },
    { from: "BCN", to: "JFK", dur: 530, base: 520, dist: 3830 },
    { from: "FCO", to: "JFK", dur: 560, base: 540, dist: 4280 },
  ];

  const flightDocs = [];
  const airportMap = new Map(airports.map((a) => [a.iataCode, a]));

  const now = new Date();

  for (let dayOffset = 0; dayOffset <= 60; dayOffset++) {
    for (const route of popularRoutes) {
      const orig = airportMap.get(route.from);
      const dest = airportMap.get(route.to);
      if (!orig || !dest) continue;

      // Create 1-2 flights per route per day
      const times = [
        { hour: 8, min: 30, flightNum: `AE-${Math.floor(100 + Math.random() * 800)}`, airline: airlines[0] },
        {
          hour: 17,
          min: 45,
          flightNum: `${airlines[Math.floor(Math.random() * airlines.length)].code}-${Math.floor(200 + Math.random() * 700)}`,
          airline: airlines[Math.floor(Math.random() * airlines.length)],
        },
      ];

      for (const t of times) {
        const depTime = new Date(now);
        depTime.setDate(now.getDate() + dayOffset);
        depTime.setHours(t.hour, t.min, 0, 0);

        const arrTime = new Date(depTime.getTime() + route.dur * 60 * 1000);

        const isDirect = Math.random() > 0.25;
        const stops = isDirect ? 0 : 1;
        const stopAirports = isDirect ? [] : [route.from === "JFK" ? "DOH" : "FRA"];
        const adjustedDuration = isDirect ? route.dur : route.dur + 135;

        const base = route.base + Math.floor((Math.random() - 0.5) * 60);
        const premPrice = Math.round(base * 1.55);
        const bizPrice = Math.round(base * 3.4);
        const firstPrice = Math.round(base * 5.8);

        flightDocs.push({
          flightNumber: t.flightNum,
          airlineCode: t.airline.code,
          airlineName: t.airline.name,
          airlineLogo: t.airline.logo,
          originAirport: orig.iataCode,
          originCity: orig.city,
          destinationAirport: dest.iataCode,
          destinationCity: dest.city,
          departureTime: depTime,
          arrivalTime: arrTime,
          durationMinutes: adjustedDuration,
          stops,
          stopAirports,
          aircraftModel: route.dist > 5000 ? "Airbus A350-1000 XWB" : "Boeing 787-9 Dreamliner",
          basePrice: base,
          premiumEconomyPrice: premPrice,
          businessPrice: bizPrice,
          firstPrice: firstPrice,
          economySeatsAvailable: Math.floor(12 + Math.random() * 80),
          premiumEconomySeatsAvailable: Math.floor(4 + Math.random() * 18),
          businessSeatsAvailable: Math.floor(2 + Math.random() * 12),
          firstSeatsAvailable: Math.floor(1 + Math.random() * 4),
          baggageAllowance: {
            carryOn: "1x 8kg cabin bag",
            checked: base > 500 ? "2x 23kg checked bags" : "1x 23kg checked bag",
          },
          amenities: {
            wifi: true,
            power: true,
            entertainment: true,
            meal: true,
            lieFlatSeats: bizPrice > 1000,
          },
          status: dayOffset === 0 && t.hour < 12 ? "BOARDING" : "SCHEDULED",
          terminalDeparture: `T${Math.floor(1 + Math.random() * 4)}`,
          terminalArrival: `T${Math.floor(1 + Math.random() * 3)}`,
          gateDeparture: `A${Math.floor(1 + Math.random() * 24)}`,
          gateArrival: `B${Math.floor(1 + Math.random() * 18)}`,
          carbonKg: Math.round(route.dist * 0.082),
          refundable: true,
          featured: dayOffset < 7 && Math.random() > 0.6,
        });
      }
    }
  }

  const seededFlights = await Flight.insertMany(flightDocs);

  // 9. Seed Sample Bookings for Traveler
  await Booking.deleteMany({});
  if (seededFlights.length > 0) {
    const sampleFlight = seededFlights[0];
    await Booking.create({
      pnr: "AET-789X4K",
      userId: travelerUser._id,
      userEmail: travelerUser.email,
      contactName: travelerUser.name,
      contactEmail: travelerUser.email,
      contactPhone: travelerUser.phone,
      flightId: sampleFlight._id,
      tripType: "ONE_WAY",
      cabinClass: "BUSINESS",
      passengers: [
        {
          type: "ADULT",
          title: "Mr",
          firstName: "Alex",
          lastName: "Thorne",
          dateOfBirth: "1992-04-14",
          gender: "MALE",
          nationality: "US",
          passportNumber: "US98234102A",
          passportExpiry: "2031-08-20",
          seatNumber: "2A",
          mealPreference: "STANDARD",
          extraBaggageKg: 0,
          frequentFlyerNumber: "AET-78902",
        },
      ],
      baseFare: sampleFlight.businessPrice,
      taxesAndFees: Math.round(sampleFlight.businessPrice * 0.12),
      seatSelectionFee: 0,
      baggageFee: 0,
      addonsFee: 45,
      discountAmount: Math.round(sampleFlight.businessPrice * 0.15),
      couponCode: "STRATOSPHERE",
      totalAmount: Math.round(
        sampleFlight.businessPrice + sampleFlight.businessPrice * 0.12 + 45 - sampleFlight.businessPrice * 0.15
      ),
      currency: "USD",
      status: "CONFIRMED",
      paymentStatus: "PAID",
      stripePaymentIntentId: "pi_mock_1234567890",
      travelInsurance: true,
      carbonOffsetContribution: true,
      specialRequests: "Window suite requested",
    });
  }

  // 10. Seed Reviews
  await Review.deleteMany({});
  await Review.insertMany([
    {
      userName: "Jonathan Vance",
      userRole: "Founding Partner, Ridgeview Ventures",
      rating: 5,
      comment:
        "The most fluid, elegant booking engine I have ever used. From seat selection on the A350 to the seamless Apple Wallet sync, Aetheria is in a class of its own.",
      route: "SFO → HND",
      cabinClass: "First Class Sky Suite",
      verified: true,
      featured: true,
    },
    {
      userName: "Sophia Lin",
      userRole: "VP of Product, Stripe Alum",
      rating: 5,
      comment:
        "Transparent pricing with zero hidden baggage gotchas. The Three.js interactive journey visualization was so cinematic I booked my London flight on the spot.",
      route: "JFK → LHR",
      cabinClass: "Business Class",
      verified: true,
      featured: true,
    },
    {
      userName: "Marcus Aurel",
      userRole: "Architect & Frequent Traveler",
      rating: 5,
      comment:
        "Gold Stratosphere membership has already paid for itself threefold with lounge access and 15% automatic flight discounts. Exceptional craft.",
      route: "DXB → SIN",
      cabinClass: "Business Class",
      verified: true,
      featured: true,
    },
  ]);

  console.log(`✅ AETHERIA database seeding complete!`);
  console.log(`✈️ Airports: ${airports.length}`);
  console.log(`✈️ Airlines: ${airlines.length}`);
  console.log(`✈️ Flights: ${seededFlights.length}`);
  console.log(`👤 Admin: admin@aetheria.com (pwd: admin123456)`);
  console.log(`👤 Traveler: traveler@aetheria.com (pwd: traveler123)`);

  return {
    success: true,
    stats: {
      airports: airports.length,
      airlines: airlines.length,
      flights: seededFlights.length,
    },
  };
}
