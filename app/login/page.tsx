"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const demoCredentials = {
  username: "admin",
  password: "wargaku123",
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectPath] = useState(() => {
    if (typeof window === "undefined") {
      return "/status";
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/status";
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    if (
      username.trim() !== demoCredentials.username ||
      password !== demoCredentials.password
    ) {
      setErrorMessage("Username atau password tidak valid.");
      setIsSubmitting(false);
      return;
    }

    document.cookie = "isLoggedIn=true; path=/; max-age=86400; samesite=lax";
    router.replace(redirectPath);
    router.refresh();
  }

  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md rounded-[2.25rem] border border-white/80 bg-white/95 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Login WargaKu
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950">
            Masuk untuk mengakses status pengajuan.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Gunakan akun demo untuk melanjutkan ke halaman yang dilindungi
            middleware.
          </p>
          <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Demo: <span className="font-semibold text-slate-700">admin</span> /
            <span className="font-semibold text-slate-700"> wargaku123</span>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
              placeholder="Masukkan password"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(255,138,61,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
