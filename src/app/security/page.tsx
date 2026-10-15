export const metadata = {
  title: "Security Standards — NextFlight",
  description: "How NextFlight protects accounts, bookings, and payments.",
};

export default function SecurityPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-extrabold text-slate-900">Security Standards</h1>
      <div className="mt-6 space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>Passwords are hashed with bcrypt (cost 10). Auth cookies are httpOnly, Secure in production, SameSite Lax, and expire after 1–7 days depending on Remember me.</p>
        <p>Admin APIs require an ADMIN role verified against the database on every request. Auth endpoints are rate-limited. Error responses never include stack traces in production.</p>
        <p>Payments are verified server-side with Stripe before a booking is marked PAID. Unverified bookings stay PENDING/UNPAID.</p>
      </div>
    </main>
  );
}
