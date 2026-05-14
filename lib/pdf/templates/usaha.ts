import { LETTER_TEMPLATE_META } from "@/constants/templateSurat";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";

export function buildUsahaTemplate(
  item: LetterPdfRecord,
  nomorSurat: string,
  signatureDate: string,
) : LetterTemplateContent {
  const meta = LETTER_TEMPLATE_META.usaha;
  const lampiran =
    item.dokumen?.trim()
      ? `Lampiran pendukung yang diserahkan pemohon tercatat sebagai ${item.dokumen.trim()}.`
      : "Pemohon telah melampirkan data pendukung usaha sesuai kebutuhan verifikasi administrasi RT.";

  return {
    bodyParagraphs: [
      "Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 02 / Rukun Warga (RW) 05 Kelurahan Mangunsari, Kecamatan Sidomukti, Kota Salatiga, menerangkan bahwa:",
      `Nama tersebut benar merupakan warga kami yang menjalankan kegiatan usaha di lingkungan domisili pemohon. ${lampiran}`,
    ],
    closingParagraph:
      "Surat keterangan usaha ini dibuat untuk dipergunakan sebagai kelengkapan administrasi usaha dan kebutuhan lain yang relevan.",
    fields: [
      { label: "Nama Pelaku Usaha", value: item.nama },
      { label: "NIK / Nomor KTP", value: item.nik },
      { label: "Alamat Usaha / Domisili", value: item.alamat },
      { label: "Jenis Keperluan", value: "Administrasi usaha warga" },
      { label: "Tanggal Pengajuan", value: signatureDate },
    ],
    footerNote: meta.footerNote,
    nomorSurat,
    purposeText: meta.purposeLabel,
    signatureDate,
    summaryLine: "Keterangan usaha warga untuk administrasi dan perizinan.",
    templateDescription: meta.description,
    templateKey: "usaha",
    title: meta.fullTitle,
  };
}

