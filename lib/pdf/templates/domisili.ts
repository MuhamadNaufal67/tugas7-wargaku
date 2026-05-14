import { LETTER_TEMPLATE_META } from "@/constants/templateSurat";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";

export function buildDomisiliTemplate(
  item: LetterPdfRecord,
  nomorSurat: string,
  signatureDate: string,
) : LetterTemplateContent {
  const meta = LETTER_TEMPLATE_META.domisili;

  return {
    bodyParagraphs: [
      "Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 02 / Rukun Warga (RW) 05 Kelurahan Mangunsari, Kecamatan Sidomukti, Kota Salatiga, menerangkan bahwa:",
      "Berdasarkan data administrasi warga dan hasil verifikasi lingkungan, nama tersebut benar merupakan warga yang berdomisili tetap pada alamat sebagaimana tercantum di bawah ini.",
    ],
    closingParagraph:
      "Demikian surat keterangan domisili ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.",
    fields: [
      { label: "Nama Lengkap", value: item.nama },
      { label: "NIK / Nomor KTP", value: item.nik },
      { label: "Alamat Domisili", value: item.alamat },
      { label: "Tanggal Pengajuan", value: signatureDate },
      { label: "Status Permohonan", value: item.status },
    ],
    footerNote: meta.footerNote,
    nomorSurat,
    purposeText: meta.purposeLabel,
    signatureDate,
    summaryLine: "Keterangan domisili resmi untuk verifikasi tempat tinggal warga.",
    templateDescription: meta.description,
    templateKey: "domisili",
    title: meta.fullTitle,
  };
}

