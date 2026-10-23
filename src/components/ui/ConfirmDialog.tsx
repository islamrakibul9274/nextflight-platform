"use client";

import { useId, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./primitives";
import { Dialog } from "./Dialog";

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const errorId = useId();
  return (
    <Dialog
      title={title}
      onClose={onCancel}
      dismissible={!busy}
      className="max-w-sm space-y-5"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <AlertTriangle size={21} aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{message}</p>
      </div>
      {error && (
        <p role="alert" id={errorId} className="text-sm text-rose-600">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={busy}
          autoFocus
        >
          {cancelLabel}
        </Button>
        <Button
          variant="danger"
          disabled={busy}
          aria-busy={busy}
          aria-describedby={error ? errorId : undefined}
          onClick={async () => {
            if (busy) return;
            setBusy(true);
            setError("");
            try {
              await onConfirm();
            } catch {
              setError("Something went wrong. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Working…" : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
