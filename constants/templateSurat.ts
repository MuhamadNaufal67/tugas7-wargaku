export type LetterTemplateKey =
  | "domisili"
  | "usaha"
  | "tidak_mampu"
  | "pengantar_rt"
  | "umum";

export type LetterTemplateMeta = {
  aliases: string[];
  code: string;
  description: string;
  footerNote: string;
  fullTitle: string;
  purposeLabel: string;
  shortTitle: string;
};

export const LETTER_HEAD_OFFICE = {
  address: "Sekretariat Jl. Cendana No. 12, Mangunsari, Sidomukti, Kota Salatiga",
  district: "KELURAHAN MANGUNSARI",
  logoLabel: "WargaKu",
  phone: "(0298) 321456",
  regency: "PEMERINTAH KOTA SALATIGA",
  rt: "02",
  rw: "05",
  subdistrict: "KECAMATAN SIDOMUKTI",
} as const;

export const LETTER_SIGNATORIES = {
  acknowledgedBy: "SOLIHIN",
  acknowledgedRole: "Ketua RW 05",
  mainSigner: "SUNAR WIBOWO",
  mainSignerRole: "Ketua RT 02",
} as const;

export const LETTER_TEMPLATE_META: Record<LetterTemplateKey, LetterTemplateMeta> = {
  domisili: {
    aliases: ["domisili", "surat domisili", "surat keterangan domisili"],
    code: "SKD",
    description: "Keterangan domisili resmi warga untuk administrasi kependudukan.",
    footerNote:
      "Surat domisili ini diterbitkan untuk keperluan administrasi sesuai data warga yang tercatat pada sistem RT.",
    fullTitle: "SURAT KETERANGAN DOMISILI",
    purposeLabel: "Keperluan administrasi domisili dan verifikasi tempat tinggal.",
    shortTitle: "Surat Domisili",
  },
  usaha: {
    aliases: ["usaha", "surat usaha", "surat keterangan usaha"],
    code: "SKU",
    description: "Keterangan usaha warga untuk pengurusan administrasi dan perizinan.",
    footerNote:
      "Surat ini dapat digunakan sebagai dokumen pendukung pengajuan administrasi usaha warga.",
    fullTitle: "SURAT KETERANGAN USAHA",
    purposeLabel: "Keperluan administrasi usaha dan pengajuan dokumen pendukung.",
    shortTitle: "Surat Keterangan Usaha",
  },
  tidak_mampu: {
    aliases: [
      "tidak mampu",
      "sktm",
      "surat keterangan tidak mampu",
      "surat tidak mampu",
    ],
    code: "SKTM",
    description: "Keterangan kondisi ekonomi warga untuk bantuan atau administrasi sosial.",
    footerNote:
      "Keterangan ini disusun berdasarkan data pengajuan warga dan verifikasi pengurus RT untuk kebutuhan sosial.",
    fullTitle: "SURAT KETERANGAN TIDAK MAMPU",
    purposeLabel: "Keperluan bantuan sosial, pendidikan, atau layanan administrasi terkait.",
    shortTitle: "Surat Keterangan Tidak Mampu",
  },
  pengantar_rt: {
    aliases: [
      "pengantar",
      "surat pengantar",
      "surat pengantar rt",
      "surat pengantar rw",
    ],
    code: "SPRT",
    description: "Surat pengantar resmi RT/RW untuk proses lanjutan ke instansi lain.",
    footerNote:
      "Surat pengantar ini diterbitkan sebagai pengesahan awal dari pengurus lingkungan sebelum proses lanjutan.",
    fullTitle: "SURAT PENGANTAR RT",
    purposeLabel: "Keperluan pengantar administrasi ke kelurahan, kecamatan, atau instansi terkait.",
    shortTitle: "Surat Pengantar RT",
  },
  umum: {
    aliases: [
      "umum",
      "surat umum",
      "surat keterangan",
      "surat keterangan umum",
    ],
    code: "SKUm",
    description: "Surat keterangan umum untuk kebutuhan administratif warga.",
    footerNote:
      "Dokumen ini berlaku sebagai surat keterangan umum dari pengurus RT selama digunakan sesuai tujuan yang tercantum.",
    fullTitle: "SURAT KETERANGAN UMUM",
    purposeLabel: "Keperluan administrasi umum sesuai kebutuhan pemohon.",
    shortTitle: "Surat Keterangan Umum",
  },
} as const;

