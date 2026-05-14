import type { User } from "@supabase/supabase-js";
import { getSupabaseClient, type AppRole, type ProfileRow } from "@/lib/supabaseClient";
import { logAuthError } from "@/lib/supabaseAuthErrors";

export type ProfileDraftOverrides = {
  alamat?: string | null;
  email?: string | null;
  full_name?: string | null;
  nik?: string | null;
  role?: AppRole;
};

type UpsertProfileOptions = {
  logErrors?: boolean;
};

export function buildProfileDraft(
  user: User,
  overrides: ProfileDraftOverrides = {},
) {
  return {
    id: user.id,
    alamat:
      overrides.alamat ??
      (typeof user.user_metadata.alamat === "string"
        ? user.user_metadata.alamat
        : null),
    email: overrides.email ?? user.email ?? null,
    full_name:
      overrides.full_name ??
      (typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : typeof user.user_metadata.name === "string"
          ? user.user_metadata.name
          : null),
    nik:
      overrides.nik ??
      (typeof user.user_metadata.nik === "string"
        ? user.user_metadata.nik
        : null),
    role: overrides.role ?? "user",
  };
}

export function buildFallbackProfileRow(
  user: User,
  overrides: ProfileDraftOverrides = {},
): ProfileRow {
  const draft = buildProfileDraft(user, overrides);

  return {
    ...draft,
    created_at: null,
    updated_at: null,
  };
}

export async function upsertCurrentUserProfile(
  user: User,
  overrides: ProfileDraftOverrides = {},
  options: UpsertProfileOptions = {},
) {
  const supabase = getSupabaseClient();
  const payload = buildProfileDraft(user, overrides);
  const shouldLogErrors = options.logErrors ?? true;

  try {
    const response = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select("*")
      .single();
    const { data, error } = response;

    if (error) {
      if (shouldLogErrors) {
        logAuthError("profiles.upsert failed", error, response);
      }
      throw error;
    }

    return data satisfies ProfileRow;
  } catch (error) {
    if (shouldLogErrors) {
      logAuthError("profiles.upsert catch", error, {
        payload,
        user: {
          email: user.email ?? null,
          id: user.id,
        },
      });
    }
    throw error;
  }
}
