"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning";

type ToastProps = {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  onDismiss: (id: number) => void;
};

const config = {
  success: {
    badge: "bg-emerald-50 text-emerald-700",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
    progress: "bg-emerald-500",
    ring: "shadow-[0_18px_40px_rgba(16,185,129,0.14)]",
    label: "Sukses",
  },
  error: {
    badge: "bg-rose-50 text-rose-700",
    border: "border-rose-100",
    iconBg: "bg-rose-100 text-rose-600",
    progress: "bg-rose-500",
    ring: "shadow-[0_18px_40px_rgba(244,63,94,0.14)]",
    label: "Gagal",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700",
    border: "border-amber-100",
    iconBg: "bg-amber-100 text-amber-700",
    progress: "bg-amber-500",
    ring: "shadow-[0_18px_40px_rgba(245,158,11,0.14)]",
    label: "Peringatan",
  },
} as const;

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 13 4 4L19 7" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d="M6 6 18 18" />
        <path d="M18 6 6 18" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
      <path d="M10.3 3.84 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.7 3.84a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

export function ToastItem({
  id,
  type,
  title,
  message,
  onDismiss,
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const currentStyle = config[type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onDismiss(id), 250);
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[1.4rem] border bg-white/98 transition-all duration-300 ease-out ${currentStyle.border} ${currentStyle.ring} ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-2 scale-[0.98] opacity-0"
      }`}
    >
      <div className="flex items-start gap-4 p-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${currentStyle.iconBg}`}
        >
          <ToastIcon type={type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] ${currentStyle.badge}`}
              >
                {currentStyle.label}
              </span>
              <p className="mt-2 text-base font-bold leading-5 text-slate-900">
                {title}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tutup notifikasi"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M6 6 18 18" />
                <path d="M18 6 6 18" />
              </svg>
            </button>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        </div>
      </div>

      <div className="h-1 w-full bg-slate-100">
        <div
          className={`h-full ${currentStyle.progress} animate-[shrink_4s_linear_forwards]`}
        />
      </div>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: { id: number; type: ToastType; title: string; message: string }[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[calc(100%-2rem)] max-w-[24rem] flex-col gap-3 sm:right-6 sm:top-24 sm:w-full">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
