import { LETTER_TEMPLATE_META } from "@/constants/templateSurat";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";

export function buildTidakMampuTemplate(
  item: LetterPdfRecord,
  nomorSurat: string,
  signatureDate: string,
) : LetterTemplateContent {
  const meta = LETTER_TEMPLATE_META.tidak_mampu;

  return {
    bodyParagraphs: [
      "Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 02 / Rukun Warga (RW) 05 Kelurahan Mangunsari, Kecamatan Sidomukti, Kota Salatiga, menerangkan bahwa:",
      "Sepanjang pengetahuan pengurus lingkungan dan berdasarkan data pengajuan yang tersedia, nama tersebut termasuk warga yang memerlukan dukungan administrasi untuk pengajuan bantuan atau layanan sosial.",
    ],
    closingParagraph:
      "Demikian surat keterangan tidak mampu ini dibuat agar dapat dipergunakan sebagaimana mestinya untuk keperluan yang sah.",
    fields: [
      { label: "Nama Lengkap", value: item.nama },
      { label: "NIK / Nomor KTP", value: item.nik },
      { label: "Alamat", value: item.alamat },
      { label: "Keperluan", value: "Pengajuan bantuan atau administrasi sosial" },
      { label: "Tanggal Pengajuan", value: signatureDate },
    ],
    footerNote: meta.footerNote,
    nomorSurat,
    purposeText: meta.purposeLabel,
    signatureDate,
    summaryLine: "Keterangan kondisi ekonomi warga untuk kebutuhan sosial.",
    templateDescription: meta.description,
    templateKey: "tidak_mampu",
    title: meta.fullTitle,
  };
}

