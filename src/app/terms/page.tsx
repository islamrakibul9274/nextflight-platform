export const metadata = {
  title: "Conditions of Carriage — NextFlight",
  description: "Fare rules, changes, cancellations, and refunds.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-extrabold text-slate-900">Conditions of Carriage</h1>
      <p className="text-sm text-slate-500 mt-1">Fare rules in plain language.</p>
      <div className="mt-6 space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>Economy cancellations: 85% refund minus a $50 administrative fee. Business, First, and insured trips: full refund to the original payment method.</p>
        <p>Name changes must match a valid passport. No-shows forfeit the fare unless the fare is marked refundable on the flight details page.</p>
        <p>Schedule changes by airlines are rebooked automatically where possible; you can accept, change, or cancel for credit.</p>
      </div>
    </main>
  );
}
