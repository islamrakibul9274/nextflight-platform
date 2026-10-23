export default function Loading() {
  return (
    <div
      className="page-container min-h-[65dvh] py-32"
      role="status"
      aria-label="Loading page"
    >
      <span className="sr-only">Getting things ready…</span>
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="h-3 w-28 rounded-full bg-slate-100" />
        <div className="h-10 w-3/4 max-w-lg rounded-xl bg-slate-100" />
        <div className="h-4 w-1/2 max-w-sm rounded-full bg-slate-100" />
        <div className="grid gap-4 pt-8 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 rounded-3xl border border-slate-100 bg-slate-50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
