import type { LetterTemplateKey } from "@/constants/templateSurat";
import { buildDomisiliTemplate } from "@/lib/pdf/templates/domisili";
import { buildPengantarRtTemplate } from "@/lib/pdf/templates/pengantarRt";
import type { LetterTemplateContent, LetterPdfRecord } from "@/lib/pdf/templates/types";
import { buildTidakMampuTemplate } from "@/lib/pdf/templates/tidakMampu";
import { buildUmumTemplate } from "@/lib/pdf/templates/umum";
import { buildUsahaTemplate } from "@/lib/pdf/templates/usaha";

export function buildTemplateContent(
  templateKey: LetterTemplateKey,
  item: LetterPdfRecord,
  nomorSurat: string,
  signatureDate: string,
): LetterTemplateContent {
  switch (templateKey) {
    case "domisili":
      return buildDomisiliTemplate(item, nomorSurat, signatureDate);
    case "usaha":
      return buildUsahaTemplate(item, nomorSurat, signatureDate);
    case "tidak_mampu":
      return buildTidakMampuTemplate(item, nomorSurat, signatureDate);
    case "pengantar_rt":
      return buildPengantarRtTemplate(item, nomorSurat, signatureDate);
    case "umum":
    default:
      return buildUmumTemplate(item, nomorSurat, signatureDate);
  }
}

