import {
  getSupabaseClient,
  type Json,
  type NotificationRow,
} from "@/lib/supabaseClient";

type CreateNotificationInput = {
  message: string;
  metadata?: Json | null;
  title: string;
  type?: string;
  userId: string;
};

export async function createNotification({
  message,
  metadata = null,
  title,
  type = "info",
  userId,
}: CreateNotificationInput) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("notifications").insert({
    message,
    metadata,
    title,
    type,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export function formatNotificationTime(createdAt: string | null) {
  if (!createdAt) {
    return "Baru saja";
  }

  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} menit lalu`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} jam lalu`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lalu`;
}

export function isUnread(notification: NotificationRow) {
  return !notification.read;
}

export function getNotificationPengajuanId(notification: Pick<NotificationRow, "metadata">) {
  const metadata = notification.metadata;

  if (!metadata || Array.isArray(metadata) || typeof metadata !== "object") {
    return null;
  }

  const rawId = metadata.pengajuan_id;
  if (typeof rawId === "number" && Number.isFinite(rawId)) {
    return rawId;
  }

  if (typeof rawId === "string") {
    const parsed = Number(rawId);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}
