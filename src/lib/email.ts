import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendBookingConfirmationEmail({
  to,
  passengerName,
  pnr,
  flightNumber,
  origin,
  destination,
  departureTime,
  cabinClass,
  seatNumber,
  totalAmount,
  currency = "USD",
}: {
  to: string;
  passengerName: string;
  pnr: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  cabinClass: string;
  seatNumber?: string;
  totalAmount: number;
  currency?: string;
}) {
  if (!resend) {
    console.log(`[Email Mock] Booking confirmation for PNR ${pnr} sent to ${to}`);
    return { success: true, mock: true };
  }

  try {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; padding: 28px 32px; color: #ffffff;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.1em;">NEXTFLIGHT</h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Electronic Flight Ticket & Boarding Pass</p>
        </div>
        
        <div style="padding: 32px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Booking Reference (PNR)</div>
            <div style="font-size: 28px; font-weight: 800; color: #2563eb; letter-spacing: 0.15em; margin-top: 4px;">${pnr}</div>
            <div style="font-size: 13px; color: #334155; margin-top: 4px;">Status: <strong>CONFIRMED & ISSUED</strong></div>
          </div>

          <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 0;">Flight Itinerary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Flight</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; font-size: 14px; text-align: right;">${flightNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Route</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; font-size: 14px; text-align: right;">${origin} → ${destination}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Departure</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; font-size: 14px; text-align: right;">${departureTime}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Passenger</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; font-size: 14px; text-align: right;">${passengerName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Cabin Class</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #0f172a; font-size: 14px; text-align: right;">${cabinClass}</td>
            </tr>
            ${
              seatNumber
                ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Assigned Seat</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #2563eb; font-size: 14px; text-align: right;">${seatNumber}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Total Paid</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0f172a; font-size: 15px; text-align: right;">$${totalAmount} ${currency}</td>
            </tr>
          </table>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #1e40af; line-height: 1.5;">
            <strong>Important Traveler Notice:</strong> Online check-in opens 24 hours prior to scheduled departure. Please arrive at the airport at least 2.5 hours before departure for international flights.
          </div>
        </div>

        <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; font-size: 12px; color: #94a3b8; text-align: center;">
          © 2026 NextFlight Aviation Technologies Inc. All rights reserved.<br />
          Need assistance? Visit our 24/7 Concierge at <a href="http://localhost:3000/help" style="color: #2563eb;">nextflight.aero/help</a>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: "NextFlight Concierge <onboarding@resend.dev>",
      to: [to],
      subject: `E-Ticket Confirmed [${pnr}] — ${origin} to ${destination} | NextFlight`,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Resend confirmation email error:", error);
    return { success: false, error };
  }
}
