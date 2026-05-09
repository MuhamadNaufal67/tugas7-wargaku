"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminAuthButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }

    return document.cookie
      .split("; ")
      .some((cookie) => cookie === "isLoggedIn=true");
  });

  function handleLogout() {
    document.cookie = "isLoggedIn=; path=/; max-age=0; samesite=lax";
    setIsLoggedIn(false);
    router.replace("/login");
    router.refresh();
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      >
        Login Admin
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:border-red-200 hover:text-red-600"
    >
      Logout Admin
    </button>
  );
}
