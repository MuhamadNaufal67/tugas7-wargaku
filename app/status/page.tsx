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
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanSurat | null>(null);

  const [updatingStatusMap, setUpdatingStatusMap] = useState<
    Record<string, UpdatableStatus | undefined>
  >({});

  const [isAdminLoggedIn] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }

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

    if (previousStatus.toLowerCase() === nextStatus) {
      return;
    }

    setUpdatingStatusMap((current) => ({
      ...current,
      [itemKey]: nextStatus,
    }));

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

      if (error) {
        throw error;
      }

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
      setUpdatingStatusMap((current) => ({
        ...current,
        [itemKey]: undefined,
      }));
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

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 text-base font-medium text-slate-500">
            Loading...
          </div>
        ) : null}

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

                    <div className="mt-5">
                      <p className="text-lg font-bold text-slate-900">
                        {item.nama}
                      </p>

                      <p className="text-sm text-slate-500">
                        NIK {item.nik}
                      </p>
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

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(item, "diproses")
                        }
                        className="inline-flex rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        Diproses
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusUpdate(item, "selesai")
                        }
                        className="inline-flex rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        Selesai
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePengajuan(item)}
                        className="inline-flex rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                      >
                        Hapus Pengajuan
                      </button>
                    </div>
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

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}