import { createClient, SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      pengajuan_surat: {
        Row: {
          alamat: string;
          created_at: string | null;
          dokumen: string | null;
          jenis_surat: string;
          nama: string;
          nik: string;
          status: string;
        };
        Insert: {
          alamat: string;
          created_at?: string | null;
          dokumen?: string | null;
          jenis_surat: string;
          nama: string;
          nik: string;
          status?: string;
        };
        Update: {
          alamat?: string;
          created_at?: string | null;
          dokumen?: string | null;
          jenis_surat?: string;
          nama?: string;
          nik?: string;
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}
