import type { LetterTemplateKey } from "@/constants/templateSurat";

export type LetterPdfRecord = {
  alamat: string;
  created_at: string | null;
  dokumen: string | null;
  file_surat: string | null;
  id: number;
  jenis_surat: string;
  nama: string;
  nik: string;
  status: string;
};

export type LetterField = {
  label: string;
  value: string;
};

export type LetterTemplateContent = {
  bodyParagraphs: string[];
  closingParagraph: string;
  fields: LetterField[];
  footerNote: string;
  nomorSurat: string;
  purposeText: string;
  signatureDate: string;
  summaryLine: string;
  templateDescription: string;
  templateKey: LetterTemplateKey;
  title: string;
};

