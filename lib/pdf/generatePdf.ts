import {
  LETTER_HEAD_OFFICE,
  LETTER_SIGNATORIES,
  LETTER_TEMPLATE_META,
  type LetterTemplateKey,
} from "@/constants/templateSurat";
import { buildTemplateContent } from "@/lib/pdf/templates";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const PAGE_MARGIN_X = 54;
const PAGE_MARGIN_TOP = 56;
const PAGE_MARGIN_BOTTOM = 56;
const CONTENT_WIDTH = A4_WIDTH - PAGE_MARGIN_X * 2;

type FontKey = "bold" | "regular";

type PdfOperation =
  | { type: "line"; x1: number; x2: number; y1: number; y2: number; width?: number }
  | {
      align?: "center" | "left" | "right";
      font?: FontKey;
      size?: number;
      text: string;
      type: "text";
      x: number;
      y: number;
    };

type PreparedPdf = {
  bytes: Uint8Array;
  fileName: string;
  nomorSurat: string;
  template: LetterTemplateContent;
};

function sanitizePdfText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function estimateTextWidth(text: string, size: number, font: FontKey = "regular") {
  const factor = font === "bold" ? 0.57 : 0.52;
  return text.length * size * factor;
}

function wrapText(text: string, size: number, maxWidth: number, font: FontKey = "regular") {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [""];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = words[0] ?? "";

  for (let index = 1; index < words.length; index += 1) {
    const next = `${current} ${words[index]}`;
    if (estimateTextWidth(next, size, font) <= maxWidth) {
      current = next;
      continue;
    }

    lines.push(current);
    current = words[index] ?? "";
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function getMonthRoman(date: Date) {
  const months = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  return months[date.getMonth()] ?? "I";
}

function formatIndonesianDate(dateValue: string | null) {
  const date = dateValue ? new Date(dateValue) : new Date();
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeJenisSurat(jenisSurat: string): LetterTemplateKey {
  const normalized = jenisSurat.trim().toLowerCase();
  const entries = Object.entries(LETTER_TEMPLATE_META) as Array<
    [LetterTemplateKey, (typeof LETTER_TEMPLATE_META)[LetterTemplateKey]]
  >;

  const exactMatch = entries.find(([, meta]) =>
    meta.aliases.some((alias) => alias === normalized),
  );
  if (exactMatch) {
    return exactMatch[0];
  }

  const partialMatch = entries.find(([, meta]) =>
    meta.aliases.some((alias) => normalized.includes(alias)),
  );
  return partialMatch?.[0] ?? "umum";
}

function buildNomorSurat(item: Pick<LetterPdfRecord, "created_at" | "id" | "jenis_surat">) {
  const date = item.created_at ? new Date(item.created_at) : new Date();
  const templateKey = normalizeJenisSurat(item.jenis_surat);
  const code = LETTER_TEMPLATE_META[templateKey].code;
  return `${String(item.id).padStart(3, "0")}/${code}/RT-${LETTER_HEAD_OFFICE.rt}/${getMonthRoman(
    date,
  )}/${date.getFullYear()}`;
}

function buildFileName(item: Pick<LetterPdfRecord, "file_surat" | "id" | "jenis_surat" | "nama">) {
  if (item.file_surat?.trim()) {
    return item.file_surat.trim();
  }

  const templateKey = normalizeJenisSurat(item.jenis_surat);
  const safeName = item.nama.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${templateKey}-${safeName}-${String(item.id).padStart(3, "0")}.pdf`;
}

function pushWrappedText(
  operations: PdfOperation[],
  text: string,
  options: {
    align?: "center" | "left" | "right";
    font?: FontKey;
    lineHeight?: number;
    maxWidth?: number;
    size?: number;
    x?: number;
    y: number;
  },
) {
  const font = options.font ?? "regular";
  const size = options.size ?? 11;
  const maxWidth = options.maxWidth ?? CONTENT_WIDTH;
  const x = options.x ?? PAGE_MARGIN_X;
  const lines = wrapText(text, size, maxWidth, font);
  let y = options.y;

  lines.forEach((line) => {
    operations.push({
      align: options.align,
      font,
      size,
      text: line,
      type: "text",
      x,
      y,
    });
    y -= options.lineHeight ?? size + 5;
  });

  return y;
}

function ensurePageSpace(y: number, neededHeight: number, operations: PdfOperation[]) {
  if (y - neededHeight >= PAGE_MARGIN_BOTTOM) {
    return y;
  }

  operations.push({
    font: "regular",
    size: 10,
    text: "Halaman dilanjutkan",
    type: "text",
    x: A4_WIDTH - PAGE_MARGIN_X,
    y: PAGE_MARGIN_BOTTOM,
    align: "right",
  });
  return PAGE_MARGIN_BOTTOM + neededHeight;
}

function buildOperations(template: LetterTemplateContent, item: LetterPdfRecord) {
  const operations: PdfOperation[] = [];
  let y = A4_HEIGHT - PAGE_MARGIN_TOP;

  operations.push({ type: "line", width: 1.5, x1: PAGE_MARGIN_X, x2: A4_WIDTH - PAGE_MARGIN_X, y1: y - 68, y2: y - 68 });
  operations.push({ type: "line", width: 0.7, x1: PAGE_MARGIN_X, x2: A4_WIDTH - PAGE_MARGIN_X, y1: y - 72, y2: y - 72 });

  operations.push({ type: "line", width: 1, x1: PAGE_MARGIN_X + 2, x2: PAGE_MARGIN_X + 52, y1: y - 6, y2: y - 6 });
  operations.push({ type: "line", width: 1, x1: PAGE_MARGIN_X + 52, x2: PAGE_MARGIN_X + 52, y1: y - 6, y2: y - 56 });
  operations.push({ type: "line", width: 1, x1: PAGE_MARGIN_X + 52, x2: PAGE_MARGIN_X + 2, y1: y - 56, y2: y - 56 });
  operations.push({ type: "line", width: 1, x1: PAGE_MARGIN_X + 2, x2: PAGE_MARGIN_X + 2, y1: y - 56, y2: y - 6 });
  operations.push({
    align: "center",
    font: "bold",
    size: 11,
    text: LETTER_HEAD_OFFICE.logoLabel,
    type: "text",
    x: PAGE_MARGIN_X + 27,
    y: y - 28,
  });
  operations.push({
    align: "center",
    font: "regular",
    size: 9,
    text: `RT ${LETTER_HEAD_OFFICE.rt}`,
    type: "text",
    x: PAGE_MARGIN_X + 27,
    y: y - 42,
  });

  operations.push({
    align: "center",
    font: "bold",
    size: 14,
    text: LETTER_HEAD_OFFICE.regency,
    type: "text",
    x: A4_WIDTH / 2 + 20,
    y: y - 8,
  });
  operations.push({
    align: "center",
    font: "bold",
    size: 12,
    text: LETTER_HEAD_OFFICE.district,
    type: "text",
    x: A4_WIDTH / 2 + 20,
    y: y - 24,
  });
  operations.push({
    align: "center",
    font: "bold",
    size: 12,
    text: `RUKUN TETANGGA (RT) ${LETTER_HEAD_OFFICE.rt} - RUKUN WARGA (RW) ${LETTER_HEAD_OFFICE.rw}`,
    type: "text",
    x: A4_WIDTH / 2 + 20,
    y: y - 40,
  });
  operations.push({
    align: "center",
    font: "regular",
    size: 10,
    text: `${LETTER_HEAD_OFFICE.subdistrict} | ${LETTER_HEAD_OFFICE.address} | Telp. ${LETTER_HEAD_OFFICE.phone}`,
    type: "text",
    x: A4_WIDTH / 2 + 20,
    y: y - 56,
  });

  y -= 110;

  operations.push({
    align: "center",
    font: "bold",
    size: 16,
    text: template.title,
    type: "text",
    x: A4_WIDTH / 2,
    y,
  });
  y -= 16;
  operations.push({
    align: "center",
    font: "regular",
    size: 11,
    text: `Nomor: ${template.nomorSurat}`,
    type: "text",
    x: A4_WIDTH / 2,
    y,
  });
  y -= 26;

  template.bodyParagraphs.forEach((paragraph) => {
    y = pushWrappedText(operations, paragraph, {
      lineHeight: 17,
      maxWidth: CONTENT_WIDTH,
      size: 11,
      x: PAGE_MARGIN_X,
      y,
    });
    y -= 6;
  });

  y -= 6;

  template.fields.forEach((field) => {
    y = ensurePageSpace(y, 24, operations);
    const wrappedValue = wrapText(field.value, 11, CONTENT_WIDTH - 165);
    operations.push({
      font: "regular",
      size: 11,
      text: `${field.label}`,
      type: "text",
      x: PAGE_MARGIN_X + 8,
      y,
    });
    operations.push({
      font: "regular",
      size: 11,
      text: ":",
      type: "text",
      x: PAGE_MARGIN_X + 150,
      y,
    });
    wrappedValue.forEach((line, index) => {
      operations.push({
        font: index === 0 ? "regular" : "regular",
        size: 11,
        text: line,
        type: "text",
        x: PAGE_MARGIN_X + 165,
        y: y - index * 16,
      });
    });
    y -= Math.max(18, wrappedValue.length * 16);
  });

  y -= 8;
  y = pushWrappedText(operations, `Keperluan surat ini: ${template.purposeText}`, {
    lineHeight: 17,
    maxWidth: CONTENT_WIDTH,
    size: 11,
    x: PAGE_MARGIN_X,
    y,
  });
  y -= 8;
  y = pushWrappedText(operations, template.closingParagraph, {
    lineHeight: 17,
    maxWidth: CONTENT_WIDTH,
    size: 11,
    x: PAGE_MARGIN_X,
    y,
  });

  y -= 10;
  const signatureTop = Math.max(y, 188);
  operations.push({
    font: "regular",
    size: 11,
    text: "Pemohon,",
    type: "text",
    x: PAGE_MARGIN_X + 22,
    y: signatureTop,
  });
  operations.push({
    align: "center",
    font: "regular",
    size: 11,
    text: `Salatiga, ${template.signatureDate}`,
    type: "text",
    x: A4_WIDTH - PAGE_MARGIN_X - 120,
    y: signatureTop,
  });
  operations.push({
    align: "center",
    font: "regular",
    size: 11,
    text: LETTER_SIGNATORIES.mainSignerRole,
    type: "text",
    x: A4_WIDTH - PAGE_MARGIN_X - 120,
    y: signatureTop - 18,
  });
  operations.push({
    font: "bold",
    size: 12,
    text: item.nama.toUpperCase(),
    type: "text",
    x: PAGE_MARGIN_X + 22,
    y: signatureTop - 90,
  });
  operations.push({ type: "line", width: 0.6, x1: PAGE_MARGIN_X + 16, x2: PAGE_MARGIN_X + 160, y1: signatureTop - 72, y2: signatureTop - 72 });
  operations.push({
    align: "center",
    font: "bold",
    size: 12,
    text: LETTER_SIGNATORIES.mainSigner,
    type: "text",
    x: A4_WIDTH - PAGE_MARGIN_X - 120,
    y: signatureTop - 90,
  });
  operations.push({
    align: "center",
    font: "regular",
    size: 11,
    text: "Mengetahui,",
    type: "text",
    x: A4_WIDTH / 2,
    y: signatureTop - 110,
  });
  operations.push({
    align: "center",
    font: "regular",
    size: 11,
    text: LETTER_SIGNATORIES.acknowledgedRole,
    type: "text",
    x: A4_WIDTH / 2,
    y: signatureTop - 126,
  });
  operations.push({
    align: "center",
    font: "bold",
    size: 12,
    text: LETTER_SIGNATORIES.acknowledgedBy,
    type: "text",
    x: A4_WIDTH / 2,
    y: signatureTop - 198,
  });

  operations.push({ type: "line", width: 0.7, x1: PAGE_MARGIN_X, x2: A4_WIDTH - PAGE_MARGIN_X, y1: 86, y2: 86 });
  operations.push({
    font: "regular",
    size: 9,
    text: `Keterangan: ${template.footerNote}`,
    type: "text",
    x: PAGE_MARGIN_X,
    y: 70,
  });
  operations.push({
    font: "regular",
    size: 9,
    text: `Dokumen WargaKu | ${template.summaryLine} | Status: ${item.status}`,
    type: "text",
    x: PAGE_MARGIN_X,
    y: 56,
  });

  return operations;
}

function operationToPdf(operation: PdfOperation) {
  if (operation.type === "line") {
    return `${operation.width ?? 1} w\n${operation.x1} ${operation.y1} m\n${operation.x2} ${operation.y2} l\nS`;
  }

  const fontName = operation.font === "bold" ? "F1" : "F2";
  const text = sanitizePdfText(operation.text);
  const width = estimateTextWidth(operation.text, operation.size ?? 11, operation.font ?? "regular");
  let x = operation.x;

  if (operation.align === "center") {
    x = operation.x - width / 2;
  } else if (operation.align === "right") {
    x = operation.x - width;
  }

  return `BT\n/${fontName} ${operation.size ?? 11} Tf\n1 0 0 1 ${x.toFixed(2)} ${operation.y.toFixed(2)} Tm\n(${text}) Tj\nET`;
}

function buildPdfBytesFromOperations(operations: PdfOperation[]) {
  const streamContent = operations.map(operationToPdf).join("\n");
  const streamLength = new TextEncoder().encode(streamContent).length;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    `3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4_WIDTH} ${A4_HEIGHT}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj`,
    `4 0 obj << /Length ${streamLength} >> stream\n${streamContent}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj",
    "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${object}\n`;
  });

  const xrefStart = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

export function getLetterTemplateKey(jenisSurat: string) {
  return normalizeJenisSurat(jenisSurat);
}

export function getLetterTemplateMeta(jenisSurat: string) {
  const templateKey = normalizeJenisSurat(jenisSurat);
  return {
    templateKey,
    ...LETTER_TEMPLATE_META[templateKey],
  };
}

export function prepareSubmissionPdf(item: LetterPdfRecord): PreparedPdf {
  const signatureDate = formatIndonesianDate(item.created_at);
  const nomorSurat = buildNomorSurat(item);
  const templateKey = normalizeJenisSurat(item.jenis_surat);
  const template = buildTemplateContent(templateKey, item, nomorSurat, signatureDate);
  const operations = buildOperations(template, item);
  const bytes = buildPdfBytesFromOperations(operations);

  return {
    bytes,
    fileName: buildFileName(item),
    nomorSurat,
    template,
  };
}

