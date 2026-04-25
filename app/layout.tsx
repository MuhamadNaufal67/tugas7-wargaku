import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export const metadata: Metadata = {
  title: "WargaKu | Administrasi RT Digital",
  description:
    "Company profile WargaKu, aplikasi administrasi RT digital untuk surat, status pengajuan, dan pengumuman warga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="antialiased">
      <body className="min-h-screen bg-[var(--color-surface)] text-slate-900">
        <div className="relative flex min-h-screen flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(45,129,193,0.16),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(255,138,61,0.14),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef5fb_100%)]" />
          <header className="sticky top-0 z-30 border-b border-white/70 bg-white/88 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-13 w-13 items-center justify-center rounded-[1.75rem] bg-[linear-gradient(180deg,_#2d81c1_0%,_#1d5f95_100%)] text-white shadow-[0_14px_35px_rgba(45,129,193,0.25)]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3a5 5 0 0 0-5 5c0 4 5 11 5 11s5-7 5-11a5 5 0 0 0-5-5Z" />
                    <path d="M9.5 10.2c.5-1 1.3-1.5 2.5-1.5s2 .5 2.5 1.5" />
                    <circle cx="10" cy="8.4" r=".8" fill="currentColor" stroke="none" />
                    <circle cx="14" cy="8.4" r=".8" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span>
                  <span className="block text-2xl font-extrabold tracking-tight text-[var(--color-primary)]">
                    Warga<span className="text-[var(--color-accent)]">Ku</span>
                  </span>
                  <span className="block text-xs font-medium text-slate-500">
                    Administrasi RT Digital
                  </span>
                </span>
              </Link>

              <nav aria-label="Main navigation" className="hidden md:block">
                <ul className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/75 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 lg:px-8">
            {children}
          </main>

          <footer className="border-t border-slate-200/70 bg-white/92">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  WargaKu untuk administrasi RT yang lebih tertata.
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  Solusi digital untuk pengajuan surat, pemantauan status, dan
                  distribusi informasi warga dalam satu platform yang rapi.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
