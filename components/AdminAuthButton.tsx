"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminAuthButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, profile, signOut, user } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <span className="inline-flex min-h-10 items-center rounded-full border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-400 shadow-sm">
        Memuat...
      </span>
    );
  }

  if (!user) {
    const nextPath =
      pathname && pathname !== "/login" ? `?redirect=${pathname}` : "";

    return (
      <Link
        href={`/login${nextPath}`}
        className="inline-flex min-h-10 items-center rounded-full border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      >
        Login
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`inline-flex min-h-10 items-center rounded-full border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
        profile?.role === "admin"
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-slate-200 text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
      }`}
    >
      {profile?.role === "admin" ? "Logout Admin" : "Logout"}
    </button>
  );
}
