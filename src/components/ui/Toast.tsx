"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}
const ToastContext = createContext<{
  notify: (message: string, kind?: ToastKind) => void;
}>({ notify: () => {} });
export const useToast = () => useContext(ToastContext);
let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const notify = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = nextId++;
      setToasts((current) => [...current.slice(-2), { id, kind, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), kind === "error" ? 8000 : 5000),
      );
    },
    [dismiss],
  );
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-label="Notifications" className="toast-stack">
        {toasts.map((toast) => {
          const Icon =
            toast.kind === "error"
              ? AlertCircle
              : toast.kind === "success"
                ? CheckCircle2
                : Info;
          return (
            <div
              key={toast.id}
              role={toast.kind === "error" ? "alert" : "status"}
              className="toast-message"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${toast.kind === "error" ? "text-rose-600" : toast.kind === "success" ? "text-emerald-600" : "text-sky-600"}`}
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-700">
                {toast.message}
              </p>
              <button
                type="button"
                aria-label="Dismiss notification"
                className="-mr-1 shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => dismiss(toast.id)}
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
