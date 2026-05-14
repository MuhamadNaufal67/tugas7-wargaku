"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  formatNotificationTime,
  getNotificationPengajuanId,
  isUnread,
} from "@/lib/notifications";
import { logAuthWarning } from "@/lib/supabaseAuthErrors";
import type { NotificationRow } from "@/lib/supabaseClient";

export default function Notification() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, supabase, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleNotifications = user ? notifications : [];

  const unreadCount = visibleNotifications.filter(isUnread).length;

  const loadNotifications = useCallback(async () => {
    if (!user) {
      return;
    }

    setIsFetching(true);

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        throw error;
      }

      setNotifications(data ?? []);
    } catch (error) {
      logAuthWarning("notifications.load failed", error, {
        userId: user.id,
      });
    } finally {
      setIsFetching(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadNotifications, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          void loadNotifications();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadNotifications, supabase, user]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (!isOpen) {
      return;
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function markAllAsRead() {
    if (!user || unreadCount === 0) {
      return;
    }

    try {
      const unreadIds = notifications.filter(isUnread).map((item) => item.id);
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);

      if (error) {
        throw error;
      }

      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true })),
      );
    } catch (error) {
      logAuthWarning("notifications.markAllAsRead failed", error, {
        unreadCount,
        userId: user.id,
      });
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
      );
    } catch (error) {
      logAuthWarning("notifications.markAsRead failed", error, {
        id,
      });
    }
  }

  async function handleNotificationClick(item: NotificationRow) {
    if (!item.read) {
      await markAsRead(item.id);
    }

    setIsOpen(false);
    const pengajuanId = getNotificationPengajuanId(item);

    if (pengajuanId !== null) {
      const targetPath = `/status?highlight=${pengajuanId}`;
      if (pathname === "/status") {
        router.replace(targetPath, { scroll: false });
      } else {
        router.push(targetPath);
      }
      return;
    }

    if (pathname !== "/status") {
      router.push("/status");
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((value) => !value);
          if (!isOpen) {
            void loadNotifications();
          }
        }}
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[0.6rem] font-bold leading-none text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/98 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                Notifikasi
              </span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-bold text-[var(--color-primary)]">
                  {unreadCount} baru
                </span>
              ) : null}
            </div>

            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                Tandai semua
              </button>
            ) : null}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading || isFetching ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Memuat notifikasi...
              </p>
            ) : !user ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Login untuk melihat notifikasi.
              </p>
            ) : visibleNotifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Belum ada notifikasi.
              </p>
            ) : (
              visibleNotifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void handleNotificationClick(item)}
                  className={`flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3.5 text-left transition last:border-0 hover:bg-slate-50 ${
                    item.read ? "bg-white" : "bg-blue-50/60"
                  }`}
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.read ? "bg-slate-200" : "bg-[var(--color-primary)]"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${
                        item.read
                          ? "text-slate-500"
                          : "font-semibold text-slate-800"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-slate-500">
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatNotificationTime(item.created_at)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[0.65rem] font-semibold text-slate-500">
                    {item.read ? "Lihat" : "Baca"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
