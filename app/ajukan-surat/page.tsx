"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { getSupabaseClient } from "@/lib/supabaseClient";

type FormState = {
  nama: string;
  nik: string;
  alamat: string;
  jenis_surat: string;
  dokumen: string;
};

type FormErrors = {
  nama?: string;
  nik?: string;
  alamat?: string;
  jenis_surat?: string;
};

const initialFormState: FormState = {
  nama: "",
  nik: "",
  alamat: "",
  jenis_surat: "",
  dokumen: "",
};

const jenisSuratOptions = [
  "Surat Pengantar",
  "Surat Domisili",
  "Surat Keterangan Usaha",
  "Surat Keterangan Tidak Mampu",
];

export default function AjukanSuratPage() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toasts, showToast, dismiss } = useToast();

  function validateField(name: keyof FormErrors, value: string) {
    const trimmedValue = value.trim();

    if (name === "nama") {
      if (!trimmedValue) return "Nama wajib diisi.";
      if (!/^[A-Za-z\s]+$/.test(trimmedValue)) {
        return "Nama hanya boleh berisi huruf dan spasi.";
      }
      return "";
    }

    if (name === "nik") {
      if (!trimmedValue) return "NIK wajib diisi.";
      if (!/^\d+$/.test(trimmedValue)) return "NIK hanya boleh berisi angka.";
      if (trimmedValue.length !== 16) return "NIK harus terdiri dari 16 digit.";
      return "";
    }

    if (name === "alamat") {
      if (!trimmedValue) return "Alamat wajib diisi.";
      if (trimmedValue.length < 5) return "Alamat minimal 5 karakter.";
      return "";
    }

    if (name === "jenis_surat") {
      if (!trimmedValue) return "Jenis surat wajib dipilih.";
      return "";
    }

    return "";
  }

  function validateForm() {
    const nextErrors: FormErrors = {
      nama: validateField("nama", formData.nama),
      nik: validateField("nik", formData.nik),
      alamat: validateField("alamat", formData.alamat),
      jenis_surat: validateField("jenis_surat", formData.jenis_surat),
    };

    const normalizedErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => value),
    ) as FormErrors;

    setFieldErrors(normalizedErrors);
    return Object.keys(normalizedErrors).length === 0;
  }

  function getInputClassName(hasError: boolean) {
    return `w-full rounded-2xl bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:bg-white ${
      hasError
        ? "border border-red-300 focus:border-red-500"
        : "border border-slate-200 focus:border-[var(--color-primary)]"
    }`;
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name in fieldErrors || name === "nama" || name === "nik" || name === "alamat" || name === "jenis_surat") {
      const error = validateField(name as keyof FormErrors, value);
      setFieldErrors((current) => ({
        ...current,
        [name]: error || undefined,
      }));
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const fileName = event.target.files?.[0]?.name ?? "";

    setFormData((current) => ({
      ...current,
      dokumen: fileName,
    }));
  }

  function resetForm() {
    setFormData(initialFormState);
    setErrorMessage("");
    setFieldErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      const message = "Periksa kembali field yang masih belum valid.";
      setErrorMessage(message);
      showToast("warning", "Perlu diperiksa", message);
      return;
    }

    setIsSubmitting(true);

    let error: { message: string } | null = null;

    try {
      const supabase = getSupabaseClient();
      const result = await supabase.from("pengajuan_surat").insert([
        {
          nama: formData.nama.trim(),
          nik: formData.nik.trim(),
          alamat: formData.alamat.trim(),
          jenis_surat: formData.jenis_surat,
          dokumen: formData.dokumen || "",
          status: "pending",
        },
      ]);

      error = result.error;
    } catch (clientError) {
      error = {
        message:
          clientError instanceof Error
            ? clientError.message
            : "Terjadi kesalahan saat menghubungkan ke Supabase.",
      };
    }

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      const toastMessage =
        error.message || "Terjadi kesalahan saat mengirim.";
      showToast("error", "Gagal", toastMessage);
      return;
    }

    showToast("success", "Berhasil", "Pengajuan berhasil dikirim");
    resetForm();
  }

  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-3xl rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Form Pengajuan Surat
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Ajukan surat secara digital dengan proses yang lebih rapi.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Isi data warga, pilih jenis surat, lalu kirim pengajuan ke sistem
            WargaKu untuk diproses oleh pengurus RT.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="nama"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                value={formData.nama}
                onChange={handleChange}
                className={getInputClassName(Boolean(fieldErrors.nama))}
                placeholder="Masukkan nama lengkap"
                aria-invalid={Boolean(fieldErrors.nama)}
              />
              {fieldErrors.nama ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {fieldErrors.nama}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="nik"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                NIK
              </label>
              <input
                id="nik"
                name="nik"
                type="text"
                value={formData.nik}
                onChange={handleChange}
                className={getInputClassName(Boolean(fieldErrors.nik))}
                placeholder="Masukkan NIK"
                aria-invalid={Boolean(fieldErrors.nik)}
              />
              {fieldErrors.nik ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {fieldErrors.nik}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="alamat"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Alamat
            </label>
            <textarea
              id="alamat"
              name="alamat"
              rows={4}
              value={formData.alamat}
              onChange={handleChange}
              className={`w-full rounded-[1.5rem] bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:bg-white ${
                fieldErrors.alamat
                  ? "border border-red-300 focus:border-red-500"
                  : "border border-slate-200 focus:border-[var(--color-primary)]"
              }`}
              placeholder="Masukkan alamat lengkap"
              aria-invalid={Boolean(fieldErrors.alamat)}
            />
            {fieldErrors.alamat ? (
              <p className="mt-2 text-xs font-medium text-red-600">
                {fieldErrors.alamat}
              </p>
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="jenis_surat"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Jenis Surat
              </label>
              <select
                id="jenis_surat"
                name="jenis_surat"
                value={formData.jenis_surat}
                onChange={handleChange}
                className={getInputClassName(Boolean(fieldErrors.jenis_surat))}
                aria-invalid={Boolean(fieldErrors.jenis_surat)}
              >
                <option value="">Pilih jenis surat</option>
                {jenisSuratOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {fieldErrors.jenis_surat ? (
                <p className="mt-2 text-xs font-medium text-red-600">
                  {fieldErrors.jenis_surat}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="dokumen"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Dokumen Pendukung
              </label>
              <input
                ref={fileInputRef}
                id="dokumen"
                name="dokumen"
                type="file"
                onChange={handleFileChange}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-primary-soft)] file:px-4 file:py-2 file:font-semibold file:text-[var(--color-primary)] hover:file:bg-[#d8ebfb]"
              />
              <p className="mt-2 text-xs text-slate-500">
                Opsional. Saat ini nama file akan disimpan sebagai teks.
              </p>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(255,138,61,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </section>
  );
}
