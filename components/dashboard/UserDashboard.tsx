"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  formatNotificationTime,
  getNotificationPengajuanId,
  isUnread,
} from "@/lib/notifications";
import type { NotificationRow, PengajuanRow } from "@/lib/supabaseClient";
import { LinkButton } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";

type UserDashboardState = {
  notifications: NotificationRow[];
  pengajuan: PengajuanRow[];
};

function countDone(items: PengajuanRow[]) {
  return items.filter((item) => item.status.toLowerCase() === "selesai").length;
}

export default function UserDashboard() {
  const router = useRouter();
  const { isAdmin, isLoading: isAuthLoading, supabase, user } = useAuth();
  const [data, setData] = useState<UserDashboardState>({
    notifications: [],
    pengajuan: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const [pengajuanResponse, notificationResponse] = await Promise.all([
      supabase
        .from("pengajuan_surat")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    setData({
      notifications: notificationResponse.data ?? [],
      pengajuan: pengajuanResponse.data ?? [],
    });
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    if (isAdmin) {
      router.replace("/admin");
      return;
    }

    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isAdmin, isAuthLoading, loadDashboard, router, user]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-[1.7rem] border border-white/80 bg-white/95 shadow-sm"
          />
        ))}
      </div>
    );
  }

  const latestPengajuan = data.pengajuan[0] ?? null;
  const unreadCount = data.notifications.filter(isUnread).length;
  const completedItems = data.pengajuan.filter(
    (item) => item.status.toLowerCase() === "selesai",
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-5">
            <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Dashboard User
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Pantau pengajuan, notifikasi, dan surat selesai Anda dalam satu tempat.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Dashboard ini memudahkan warga untuk mengirim surat baru,
                mengecek progres layanan, dan langsung mengunduh dokumen yang sudah selesai.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/ajukan-surat">Ajukan Surat Baru</LinkButton>
              <LinkButton href="/status" variant="secondary">
                Lihat Semua Status
              </LinkButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.35rem] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Total Pengajuan</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {data.pengajuan.length}
              </p>
            </div>
            <div className="rounded-[1.35rem] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Notifikasi Baru</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {unreadCount}
              </p>
            </div>
            <div className="rounded-[1.35rem] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Surat Selesai</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-950">
                {countDone(data.pengajuan)}
              </p>
            </div>
            <div className="rounded-[1.35rem] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Status Terakhir</p>
              <p className="mt-2 text-sm font-bold text-slate-900">
                {latestPengajuan ? latestPengajuan.jenis_surat : "Belum ada"}
              </p>
              {latestPengajuan ? (
                <div className="mt-2">
                  <StatusBadge status={latestPengajuan.status} />
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Riwayat Pengajuan</h2>
                <p className="text-sm text-slate-500">
                  Pengajuan terbaru milik Anda.
                </p>
              </div>
              <Link
                href="/status"
                className="text-sm font-semibold text-[var(--color-primary)]"
              >
                Lihat semua
              </Link>
            </div>

            {data.pengajuan.length === 0 ? (
              <EmptyState
                title="Belum ada pengajuan"
                description="Mulai dari surat pertama Anda agar progres administrasi bisa dipantau di dashboard ini."
                action={<LinkButton href="/ajukan-surat">Ajukan Sekarang</LinkButton>}
              />
            ) : (
              <div className="space-y-3">
                {data.pengajuan.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{item.jenis_surat}</p>
                        <p className="text-sm text-slate-500">
                          {item.nama} • NIK {item.nik}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/status?highlight=${item.id}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white"
                      >
                        Lihat Detail
                      </Link>
                      {item.status.toLowerCase() === "selesai" && item.file_surat ? (
                        <Link
                          href={`/status?highlight=${item.id}`}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
                        >
                          Download Surat
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Notifikasi Terbaru</h2>
                <p className="text-sm text-slate-500">
                  Update sistem yang paling relevan untuk akun Anda.
                </p>
              </div>
            </div>

            {data.notifications.length === 0 ? (
              <EmptyState
                title="Belum ada notifikasi"
                description="Notifikasi tentang pengajuan dan perubahan status akan muncul di sini."
              />
            ) : (
              <div className="space-y-3">
                {data.notifications.map((item) => {
                  const pengajuanId = getNotificationPengajuanId(item);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-[1.3rem] border p-4 ${
                        item.read
                          ? "border-slate-200 bg-white"
                          : "border-blue-200 bg-blue-50/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.message}
                          </p>
                        </div>
                        {!item.read ? (
                          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                            Baru
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-400">
                          {formatNotificationTime(item.created_at)}
                        </p>
                        {pengajuanId !== null ? (
                          <Link
                            href={`/status?highlight=${pengajuanId}`}
                            className="text-xs font-semibold text-[var(--color-primary)]"
                          >
                            Buka detail
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {completedItems.length > 0 ? (
        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Surat Siap Diunduh</h2>
                <p className="text-sm text-slate-500">
                  Akses cepat ke dokumen yang sudah selesai diproses.
                </p>
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {completedItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.3rem] border border-emerald-200 bg-emerald-50/70 p-4"
                >
                  <p className="font-bold text-slate-900">{item.jenis_surat}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Dokumen siap dibuka atau diunduh.
                  </p>
                  <div className="mt-3">
                    <Link
                      href={`/status?highlight=${item.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700"
                    >
                      Buka Surat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
