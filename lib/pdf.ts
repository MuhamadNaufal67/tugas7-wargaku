import { prepareSubmissionPdf } from "@/lib/pdf/generatePdf";
import type { PengajuanRow } from "@/lib/supabaseClient";

type PdfSubmission = Pick<
  PengajuanRow,
  | "alamat"
  | "created_at"
  | "dokumen"
  | "file_surat"
  | "id"
  | "jenis_surat"
  | "nama"
  | "nik"
  | "status"
>;

export function generateSubmissionPdfBytes(item: PdfSubmission) {
  return prepareSubmissionPdf(item).bytes;
}

export function getSubmissionPdfFileName(
  item: Pick<PdfSubmission, "file_surat" | "id" | "jenis_surat" | "nama">,
) {
  return prepareSubmissionPdf({
    alamat: "",
    created_at: null,
    dokumen: null,
    file_surat: item.file_surat,
    id: item.id,
    jenis_surat: item.jenis_surat,
    nama: item.nama,
    nik: "",
    status: "selesai",
  }).fileName;
}

export function downloadSubmissionPdf(item: PdfSubmission) {
  const prepared = prepareSubmissionPdf(item);
  const bytes = prepared.bytes;
  const fileName = prepared.fileName;
  const blob = new Blob([Uint8Array.from(bytes)], {
    type: "application/pdf",
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(objectUrl);
}

export { getLetterTemplateMeta, getLetterTemplateKey, prepareSubmissionPdf } from "@/lib/pdf/generatePdf";
