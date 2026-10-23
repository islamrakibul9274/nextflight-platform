"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

let openDialogs = 0;
let previousOverflow = "";

/** Native modal semantics provide focus containment and make the background inert. */
export function Dialog({
  title,
  onClose,
  dismissible = true,
  className,
  children,
}: {
  title: string;
  onClose: () => void;
  dismissible?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement;
    if (openDialogs++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    dialog.showModal();
    return () => {
      dialog.close();
      if (--openDialogs === 0) document.body.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement && opener.isConnected)
        opener.focus({ preventScroll: true });
    };
  }, []);

  // This component is mounted by an interaction, never during server rendering.
  if (typeof document === "undefined") return null;
  return createPortal(
    <dialog
      ref={ref}
      aria-label={title}
      className="dialog-overlay"
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && dismissible) onClose();
      }}
    >
      <div
        className={cn(
          "dialog-panel w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl",
          className,
        )}
      >
        {children}
      </div>
    </dialog>,
    document.body,
  );
}
