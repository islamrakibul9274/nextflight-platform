export const metadata = {
  title: "Privacy Policy — NextFlight",
  description: "How NextFlight collects, uses, and protects traveler data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mt-1">Last updated: 2026</p>
      <div className="mt-6 space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>NextFlight stores only the data needed to operate bookings: account details, traveler profiles you save, bookings, and support messages.</p>
        <p>Passwords are hashed with bcrypt. Sessions use httpOnly cookies and are never stored in localStorage. Payment card data is processed by Stripe and never touches our servers in plain text.</p>
        <p>We never sell personal data. passport/DOB details you provide are used only for ticketing and are shown only to you and authorized operations staff.</p>
        <p>Contact support via the Help page to request export or deletion of your data.</p>
      </div>
    </main>
  );
}
