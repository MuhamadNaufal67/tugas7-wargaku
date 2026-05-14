import { LETTER_TEMPLATE_META } from "@/constants/templateSurat";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";

export function buildUmumTemplate(
  item: LetterPdfRecord,
  nomorSurat: string,
  signatureDate: string,
) : LetterTemplateContent {
  const meta = LETTER_TEMPLATE_META.umum;

  return {
    bodyParagraphs: [
      "Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 02 / Rukun Warga (RW) 05 Kelurahan Mangunsari, Kecamatan Sidomukti, Kota Salatiga, menerangkan bahwa:",
      "Nama tersebut benar merupakan warga yang tercatat di lingkungan kami dan membutuhkan surat keterangan umum sebagai dokumen pendukung keperluan administrasi.",
    ],
    closingParagraph:
      "Demikian surat keterangan umum ini dibuat dengan sebenarnya dan dapat dipergunakan untuk keperluan yang sah.",
    fields: [
      { label: "Nama Lengkap", value: item.nama },
      { label: "NIK / Nomor KTP", value: item.nik },
      { label: "Alamat", value: item.alamat },
      { label: "Keperluan", value: "Administrasi umum warga" },
      { label: "Tanggal Pengajuan", value: signatureDate },
    ],
    footerNote: meta.footerNote,
    nomorSurat,
    purposeText: meta.purposeLabel,
    signatureDate,
    summaryLine: "Surat keterangan umum untuk kebutuhan administrasi warga.",
    templateDescription: meta.description,
    templateKey: "umum",
    title: meta.fullTitle,
  };
}

