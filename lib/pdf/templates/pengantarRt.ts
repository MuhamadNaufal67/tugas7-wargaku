import { LETTER_TEMPLATE_META } from "@/constants/templateSurat";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";

export function buildPengantarRtTemplate(
  item: LetterPdfRecord,
  nomorSurat: string,
  signatureDate: string,
) : LetterTemplateContent {
  const meta = LETTER_TEMPLATE_META.pengantar_rt;

  return {
    bodyParagraphs: [
      "Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 02 / Rukun Warga (RW) 05 Kelurahan Mangunsari, Kecamatan Sidomukti, Kota Salatiga, memberikan pengantar kepada warga berikut:",
      "Nama tersebut benar berdomisili di wilayah kami dan diberikan surat pengantar untuk melanjutkan proses administrasi ke instansi yang membutuhkan pengesahan awal dari pengurus RT/RW.",
    ],
    closingParagraph:
      "Demikian surat pengantar ini dibuat untuk dipergunakan sebagai dasar pengurusan administrasi lanjutan sebagaimana mestinya.",
    fields: [
      { label: "Nama Pemohon", value: item.nama },
      { label: "NIK / Nomor KTP", value: item.nik },
      { label: "Alamat", value: item.alamat },
      { label: "Tujuan Pengantar", value: "Administrasi lanjutan ke instansi terkait" },
      { label: "Tanggal Pengajuan", value: signatureDate },
    ],
    footerNote: meta.footerNote,
    nomorSurat,
    purposeText: meta.purposeLabel,
    signatureDate,
    summaryLine: "Surat pengantar RT/RW untuk proses lanjutan ke instansi lain.",
    templateDescription: meta.description,
    templateKey: "pengantar_rt",
    title: meta.fullTitle,
  };
}

