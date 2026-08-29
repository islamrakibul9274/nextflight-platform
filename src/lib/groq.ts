import { Groq } from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

export const groq = apiKey ? new Groq({ apiKey }) : null;

export async function askNextFlightConcierge(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  if (!groq) {
    return "NextFlight AI Concierge: I'm currently in demo mode. You can ask about baggage policies (1x 8kg cabin + 1x 23kg checked), refundable fares, Stratosphere member perks (up to 20% discount + free lounge pass), or flight routes across JFK, LHR, HND, DXB, and SIN.";
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are the NextFlight AI Travel Concierge, a highly sophisticated, polite, and aviation-savvy digital assistant for NextFlight and its global partner airline network.
          
Key facts about NextFlight:
- Premium flight booking and aviation intelligence platform.
- Global hub network: JFK (New York), LHR (London), HND/NRT (Tokyo), SIN (Singapore), DXB (Dubai), CDG (Paris), SFO (San Francisco), LAX (Los Angeles), SYD (Sydney), FRA (Frankfurt), ZRH (Zurich).
- Fleet: Boeing 787-9 Dreamliners, Airbus A350-1000s, Airbus A380-800s with ultra-quiet cabins, Starlink high-speed in-flight WiFi, and chef-curated dining.
- Cabin Classes: Economy, Premium Economy (38" pitch), Business Class (Lie-flat suites with direct aisle access), First Class (Private sky suites).
- Memberships: Silver Voyager (Standard), Gold Stratosphere (15% discount + free lounge access + extra 23kg bag), Apex Black (20% discount + private chauffeur + unlimited VIP lounges + 0 change fees).
- Active Promo Code: "FLYFIRST" for 20% discount on any booking; "AETHERIA2026" for $100 off long-haul flights.
- Baggage: Standard Economy allows 1 cabin bag (8kg) + 1 checked bag (23kg). Flex tickets allow 2 checked bags (23kg each).
- Refund Policy: Flex and Business tickets are 100% refundable up to 2 hours before departure.

Provide concise, elegant, and helpful answers formatted with clean markdown. Keep your tone polished, warm, and authoritative.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    return response.choices[0]?.message?.content || "I am at your service. How may I assist your voyage today?";
  } catch (error) {
    console.error("Groq AI Concierge error:", error);
    return "Our concierge network is currently operating at high altitude. Please feel free to search our route network or browse flight options directly.";
  }
}
