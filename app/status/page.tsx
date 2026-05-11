"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
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
type UpdatableStatus = "pending" | "diproses" | "selesai";

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

const updateStatusOptions: { value: UpdatableStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
];

function formatTanggal(createdAt: string | null) {
  if (!createdAt) return "-";
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

function getPengajuanKey(
  item: Pick<PengajuanSurat, "nik" | "created_at" | "jenis_surat">,
) {
  return `${item.nik}-${item.created_at ?? "tanpa-tanggal"}-${item.jenis_surat}`;
}

export default function StatusPage() {
  const router = useRouter();
  const [dataPengajuan, setDataPengajuan] = useState<PengajuanSurat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("semua");
  const [searchQuery, setSearchQuery] = useState(""); // ← BARU: state search
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanSurat | null>(null);

const [updatingStatusMap, setUpdatingStatusMap] = useState<Record<string, UpdatableStatus | undefined>>({});

  const [isAdminLoggedIn] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.cookie
      .split("; ")
      .some((cookie) => cookie === "isLoggedIn=true");
  });

  const { toasts, showToast, dismiss } = useToast();

  function handleLogout() {
    document.cookie = "isLoggedIn=; path=/; max-age=0; samesite=lax";
    router.replace("/login");
    router.refresh();
  }

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
        if (error) throw error;
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

  // ← BARU: filter status + search digabung
  const filteredPengajuan = dataPengajuan.filter((item) => {
    const normalizedStatus = item.status.toLowerCase();

    const lolosFilter =
      activeFilter === "semua"
        ? true
        : activeFilter === "selesai"
          ? normalizedStatus === "selesai" || normalizedStatus === "diterima"
          : normalizedStatus === activeFilter;

    const keyword = searchQuery.toLowerCase().trim();
    const lolosSearch =
      keyword === "" ||
      item.nama.toLowerCase().includes(keyword) ||
      item.nik.toLowerCase().includes(keyword) ||
      item.jenis_surat.toLowerCase().includes(keyword) ||
      item.alamat.toLowerCase().includes(keyword);

    return lolosFilter && lolosSearch;
  });

  async function handleStatusUpdate(
    item: PengajuanSurat,
    nextStatus: UpdatableStatus,
  ) {
    if (!isAdminLoggedIn) {
      showToast(
        "warning",
        "Akses terbatas",
        "Silakan login sebagai admin untuk memperbarui status.",
      );
      return;
    }

    const itemKey = getPengajuanKey(item);
    const previousStatus = item.status;

    if (previousStatus.toLowerCase() === nextStatus) return;

    setUpdatingStatusMap((current) => ({ ...current, [itemKey]: nextStatus }));

    setDataPengajuan((current) =>
      current.map((pengajuan) =>
        getPengajuanKey(pengajuan) === itemKey
          ? { ...pengajuan, status: nextStatus }
          : pengajuan,
      ),
    );

    try {
      const supabase = getSupabaseClient();

      let query = supabase
        .from("pengajuan_surat")
        .update({ status: nextStatus })
        .eq("nik", item.nik)
        .eq("jenis_surat", item.jenis_surat);

      if (item.created_at) {
        query = query.eq("created_at", item.created_at);
      }

      const { error } = await query;
      if (error) throw error;

      showToast(
        "success",
        "Status diperbarui",
        `Status berhasil diubah ke ${getStatusLabel(nextStatus)}.`,
      );
    } catch (error) {
      setDataPengajuan((current) =>
        current.map((pengajuan) =>
          getPengajuanKey(pengajuan) === itemKey
            ? { ...pengajuan, status: previousStatus }
            : pengajuan,
        ),
      );

      showToast(
        "error",
        "Gagal memperbarui",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui status.",
      );
    } finally {
      setUpdatingStatusMap((current) => ({ ...current, [itemKey]: undefined }));
    }
  }

  async function handleDeletePengajuan(item: PengajuanSurat) {
    const confirmDelete = window.confirm(
      "Yakin ingin menghapus pengajuan ini?",
    );

    if (!confirmDelete) {
      return;
    }

    const previousData = dataPengajuan;

    setDataPengajuan((current) =>
      current.filter(
        (pengajuan) =>
          getPengajuanKey(pengajuan) !== getPengajuanKey(item),
      ),
    );

    try {
      const supabase = getSupabaseClient();

      let query = supabase
        .from("pengajuan_surat")
        .delete()
        .eq("nik", item.nik)
        .eq("jenis_surat", item.jenis_surat);

      if (item.created_at) {
        query = query.eq("created_at", item.created_at);
      }

      const { error } = await query;

      if (error) {
        throw error;
      }

      showToast(
        "success",
        "Berhasil dihapus",
        "Pengajuan berhasil dihapus.",
      );
    } catch (error) {
      setDataPengajuan(previousData);

      showToast(
        "error",
        "Gagal menghapus",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus.",
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              Status Pengajuan
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Pantau progres pengajuan surat warga secara real-time.
            </h1>
          </div>

          {isAdminLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Logout Admin
            </button>
          ) : null}
        </div>
      </section>

      <section className="space-y-5">

        {/* ← BARU: Search Bar */}
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama, NIK, jenis surat, atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-base text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)] outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
          />
          {/* Tombol hapus search */}
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Hapus pencarian"
            >
              <svg
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
          ) : null}
        </div>

        {/* Filter Status */}
        <div className="flex flex-wrap items-center gap-3">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white text-slate-600"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Info jumlah hasil */}
        {!isLoading && !errorMessage ? (
          <p className="text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-semibold text-slate-700">
              {filteredPengajuan.length}
            </span>{" "}
            pengajuan
            {searchQuery ? (
              <>
                {" "}untuk kata kunci{" "}
                <span className="font-semibold text-[var(--color-primary)]">
                  &quot;{searchQuery}&quot;
                </span>
              </>
            ) : null}
          </p>
        ) : null}

        {/* Loading */}
        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-base font-medium text-slate-500">
            Loading...
          </div>
        ) : null}

        {/* Error */}
        {!isLoading && errorMessage ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-8 text-base text-red-600 shadow-[0_14px_35px_rgba(239,68,68,0.08)]">
            {errorMessage}
          </div>
        ) : null}

        {/* Kosong */}
        {!isLoading && !errorMessage && filteredPengajuan.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-base font-medium text-slate-500 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}"`
              : "Belum ada pengajuan"}
          </div>
        ) : null}

        {/* List Pengajuan */}
        {!isLoading && !errorMessage
          ? filteredPengajuan.map((item) => (
              <article
                key={getPengajuanKey(item)}
                className="rounded-[2rem] border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-950">
                      {item.jenis_surat}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
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

                    <p className="mt-4 text-base text-slate-600">
                      {item.alamat}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPengajuan(item)}
                        className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        Lihat Detail
                      </button>

                    {isAdminLoggedIn ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {updateStatusOptions.map((statusOption) => {
                          const itemKey = getPengajuanKey(item);
                          const activeUpdate = updatingStatusMap[itemKey];
                          const isUpdating =
                            activeUpdate === statusOption.value;
                          const isDisabled = Boolean(activeUpdate);
                          const isActive =
                            item.status.toLowerCase() === statusOption.value;

                          return (
                            <button
                              key={statusOption.value}
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(item, statusOption.value)
                              }
                              disabled={isDisabled}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
                                isActive
                                  ? `${getStatusClassName(statusOption.value)} shadow-[0_10px_24px_rgba(15,23,42,0.08)]`
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                              }`}
                            >
                              {isUpdating ? (
                                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                              ) : null}
                              <span>
                                {isUpdating
                                  ? "Menyimpan..."
                                  : statusOption.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Login admin diperlukan untuk memperbarui status
                        pengajuan.
                      </p>
                    )}
                    </div>
                  </div>

                  <div className="flex shrink-0">
                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getStatusClassName(item.status)}`}
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

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
