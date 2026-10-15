"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: 48, textAlign: "center", fontFamily: "system-ui" }} role="alert">
          <h2>NextFlight crashed</h2>
          <p>{process.env.NODE_ENV === "production" ? "Reload to continue." : error.message}</p>
          <button onClick={reset}>Reload</button>
        </div>
      </body>
    </html>
  );
}
