"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

type PengajuanSurat = {
  alamat: string;
  created_at: string | null;
  jenis_surat: string;
  nama: string;
  nik: string;
  status: string;
};

type StatusFilter = "semua" | "pending" | "diproses" | "selesai" | "ditolak";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  diproses: "bg-blue-100 text-blue-700",
  selesai: "bg-emerald-100 text-emerald-700",
  diterima: "bg-emerald-100 text-emerald-700",
  ditolak: "bg-red-100 text-red-700",
} as const;

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

function formatTanggal(createdAt: string | null) {
  if (!createdAt) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

function getStatusClassName(status: string) {
  const normalizedStatus = status.toLowerCase() as keyof typeof statusStyles;
  return statusStyles[normalizedStatus] ?? "bg-slate-100 text-slate-700";
}

function getStatusLabel(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "pending") return "Pending";
  if (normalizedStatus === "diproses") return "Diproses";
  if (normalizedStatus === "selesai") return "Selesai";
  if (normalizedStatus === "diterima") return "Diterima";
  if (normalizedStatus === "ditolak") return "Ditolak";

  return status;
}

export default function StatusPage() {
  const [dataPengajuan, setDataPengajuan] = useState<PengajuanSurat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("semua");
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanSurat | null>(null);

  useEffect(() => {
    async function fetchPengajuanSurat() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const supabase = getSupabaseClient();

        // Ambil semua data pengajuan surat dari Supabase dan urutkan dari terbaru.
        const { data, error } = await supabase
          .from("pengajuan_surat")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setDataPengajuan((data ?? []) as PengajuanSurat[]);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data pengajuan.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPengajuanSurat();
  }, []);

  const filteredPengajuan = dataPengajuan.filter((item) => {
    if (activeFilter === "semua") {
      return true;
    }

    const normalizedStatus = item.status.toLowerCase();

    if (activeFilter === "selesai") {
      return normalizedStatus === "selesai" || normalizedStatus === "diterima";
    }

    return normalizedStatus === activeFilter;
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Status Pengajuan
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Pantau progres pengajuan surat warga secara real-time.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            Data pada halaman ini diambil langsung dari Supabase dan
            ditampilkan dalam bentuk card agar proses pengajuan lebih mudah
            dipantau.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-[0_12px_28px_rgba(45,129,193,0.18)]"
                    : "bg-white text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                }`}
              >
                {filter.label}
                {isActive ? (
                  <span className="absolute inset-x-4 -bottom-1 h-1 rounded-full bg-white/85" />
                ) : null}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-base font-medium text-slate-500 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            Loading...
          </div>
        ) : null}

        {!isLoading && errorMessage ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-8 text-base text-red-600 shadow-[0_14px_35px_rgba(239,68,68,0.08)]">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && filteredPengajuan.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-base font-medium text-slate-500 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            Belum ada pengajuan
          </div>
        ) : null}

        {!isLoading && !errorMessage
          ? filteredPengajuan.map((item) => (
              <article
                key={`${item.nik}-${item.created_at ?? item.jenis_surat}`}
                className="rounded-[2rem] border border-slate-200/90 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] p-6 shadow-[0_16px_42px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(15,23,42,0.08)] sm:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                      {item.jenis_surat}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Diajukan {formatTanggal(item.created_at)}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21a8 8 0 0 0-16 0" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {item.nama}
                        </p>
                        <p className="text-sm text-slate-500">
                          NIK {item.nik}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                      {item.alamat}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedPengajuan(item)}
                      className="mt-5 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(45,129,193,0.18)] hover:-translate-y-0.5 hover:bg-[#236fa8]"
                    >
                      Lihat Detail
                    </button>
                  </div>

                  <div className="flex shrink-0">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getStatusClassName(
                        item.status,
                      )}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
              </article>
            ))
          : null}
      </section>

      {selectedPengajuan ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/28 px-4 py-8 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                  Detail Pengajuan
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  {selectedPengajuan.jenis_surat}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPengajuan(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup detail pengajuan"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
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

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Nama
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedPengajuan.nama}
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  NIK
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {selectedPengajuan.nik}
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Tanggal Pengajuan
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {formatTanggal(selectedPengajuan.created_at)}
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Status
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${getStatusClassName(
                      selectedPengajuan.status,
                    )}`}
                  >
                    {getStatusLabel(selectedPengajuan.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Alamat
              </p>
              <p className="mt-2 text-base leading-7 text-slate-700">
                {selectedPengajuan.alamat}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPengajuan(null)}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
