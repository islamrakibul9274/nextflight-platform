# ✈️ NextFlight - Modern Flight Discovery & Aviation Intelligence Platform

A high-performance, production-grade **Next.js 16** application designed for seamless global flight search, real-time seat selection, and authoritative booking management. NextFlight features a clean, minimalist 2026 architectural user interface, strict role-based authentication, interactive visual cabin seat maps, Groq Llama-3 AI Travel Concierge, Stripe payments, and a full-featured admin operations console.

---

## 🚀 Live Links

* **Production Application (Netlify):** [https://nextflight-platform-2026.netlify.app/](https://nextflight-platform-2026.netlify.app/)
* **GitHub Repository:** [https://github.com/islamrakibul9274/nextflight-platform](https://github.com/islamrakibul9274/nextflight-platform)

---

## ✨ Key Features

### 🔍 Flight Discovery & Search Engine
* **Unified Command Capsule:** Modern Google Flights-style connected airway search console with interactive origin/destination swap and fuzzy IATA autocomplete.
* **Flexible Date Matrix:** Real-time +/- 3 days dynamic fare matrix for rapid low-fare corridor discovery.
* **Multi-Parameter Filtering:** Real-time filtering by stops (Nonstop, 1-stop), max price slider, airline carriers, departure time windows, and refundable fare policies.
* **High-Frequency Corridors:** Instant 1-click popular direct routes with live pricing (JFK ⇄ LHR, SFO ⇄ HND, DXB ⇄ SIN, LHR ⇄ CDG).

### 💺 Interactive Cabin Maps & Aircraft Telemetry
* **Visual Seat Selection Engine:** Real-time visual seat map supporting Boeing 787-9, Airbus A350-1000, and Airbus A380-800 configurations with direct aisle indicators, exit rows, and 180° lie-flat suites.
* **Aircraft Telemetry Specs:** In-depth aircraft telemetry displaying seat pitch (32" Economy to 78" Lie-flat), cabin layouts, cruise speed, and carbon footprint (kg CO2e).
* **Transparent Add-Ons:** Configurable checked baggage allowances, in-flight gourmet meals, travel protection insurance, and Gold Standard carbon offset contributions.

### 💳 Complete End-to-End Booking Engine
* **6-Step Progressive Booking Flow:** Structured flow covering Fare Tier Selection (Basic Saver, Standard Flex, Flex Plus VIP), Passenger Information, Interactive Seat Selection, Fare Review with Coupon Validation (`FLYFIRST`), and Stripe Checkout.
* **Authoritative Price Lock:** 15-minute price locking engine ensuring zero price jumps during payment processing.
* **Printable E-Tickets & Boarding Passes:** High-resolution digital boarding passes with dynamic QR codes, gate telemetry, and automated Resend email delivery.

### 🤖 AI Travel Concierge (Groq Llama-3.3)
* **24/7 Aviation Intelligence:** Integrated Groq Llama-3.3 70B AI assistant answering queries about baggage allowances, visa rules, aircraft fleet dimensions, and Stratosphere Club perks.

### 👤 Self-Service Traveler Portal (`/my-trips`)
* **PNR Management:** Direct lookups and management of upcoming voyages, e-ticket downloads, and seat re-assignments.
* **Instant Cancellation & Refund Engine:** Automated refund calculator providing instant refunds based on fare policy without voucher lock-in.
* **Stratosphere Loyalty Club:** Tiered membership privileges (Silver Voyager, Gold Stratosphere, Apex Black) with automated discount calculations.

### 🛠 Enterprise Operations Console (`/admin/*`)
* **Analytics & Performance:** Real-time telemetry monitoring total revenue, booking conversion rates, load factors, and route yield.
* **Flight Inventory Manager:** Full CRUD interface for scheduling flights, adjusting base fares, and managing cabin seat capacity.
* **Airports & Gateways Directory:** Global IATA airport directory with operational status and coordinate mapping.
* **Manifest & Booking Ledger:** Comprehensive PNR manifests with search, filtering, and status updates.
* **Dynamic Pricing Engine:** Multiplier-based surge and discount rules based on demand and departure proximity.
* **Coupon Manager:** Promo code creation with percentage/flat discounts and expiration tracking.

---

## 💻 Tech Stack

**Frontend & Framework:**
* **Next.js 16** (App Router & Turbopack)
* **React 19** & **TypeScript**
* **Tailwind CSS v4** (Modern 2026 Minimalist Architectural Design)
* **Three.js** (Aeronautical 3D Visuals & Canvas)
* **Framer Motion** & **Canvas Confetti** (Micro-Interactions)
* **Lucide React** (Modern Iconography)
* **Recharts** (Admin Analytics Data Visualization)

**Backend & Database:**
* **Next.js Server Actions & API Routes**
* **MongoDB Atlas** (Primary Database with automatic in-memory fallback)
* **Mongoose ODM** (Schema Validation & Indexing)
* **JWT & Jose** (Edge-Compatible Authentication & Role Guard)
* **BcryptJS** (Password Security)
* **Stripe API** (Payment Intents & Elements Checkout)
* **Groq SDK** (Llama-3.3-70b-versatile AI Concierge)
* **Resend API** (Transactional E-Ticket Delivery)

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Admin** | `admin@aetheria.com` | `admin123456` | Full Access to `/admin/*` Operations Console |
| **Traveler** | `traveler@aetheria.com` | `traveler123` | USER Role / Gold Stratosphere Member / Pre-loaded Trips |

### Active Demo Promo Codes
* `FLYFIRST` — **20% Off** any flight booking
* `AETHERIA2026` — **$100 Flat Savings** on international corridors
* `STRATOSPHERE` — **15% Off** for Club Members

---

## 🛠 Local Setup Instructions

### 1. Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas connection string (or run with built-in standalone memory database)
* Stripe & Groq API Keys (optional for local testing)

### 2. Clone the Repository
```bash
git clone https://github.com/islamrakibul9274/nextflight-platform.git
cd nextflight-platform
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Authentication & Security
AUTH_SECRET=your_auth_secret_key
JWT_SECRET=your_jwt_secret_key
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AI Concierge (Groq)
GROQ_API_KEY=your_groq_api_key

# Transactional Emails (Resend)
RESEND_API_KEY=your_resend_api_key
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience NextFlight.

---

## ⚙️ Production Deployment

This application is fully optimized for continuous deployment on **Netlify** and **Vercel**. All routes, dynamic server functions, and edge-compatible API endpoints compile cleanly with Turbopack and the Next.js runtime.

---

## 👤 Author

**Rakibul Islam Rumel**
* GitHub: [@islamrakibul9274](https://github.com/islamrakibul9274)

---
