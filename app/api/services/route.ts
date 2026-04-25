const services = [
  {
    id: 1,
    title: "Ajukan Surat",
    description:
      "Warga dapat mengajukan surat pengantar atau dokumen administrasi RT secara online melalui formulir yang terstruktur.",
    detail:
      "Alur pengajuan dibuat sederhana agar warga dapat mengirim data dengan cepat dan pengurus RT lebih mudah memeriksa kelengkapan.",
  },
  {
    id: 2,
    title: "Status Pengajuan",
    description:
      "Setiap permohonan surat memiliki status yang dapat dipantau secara realtime sehingga warga mengetahui progres layanannya.",
    detail:
      "Fitur ini membantu transparansi proses administrasi dan mengurangi pertanyaan berulang karena status selalu tersedia dalam dashboard.",
  },
  {
    id: 3,
    title: "Pengumuman RT",
    description:
      "Informasi penting seperti jadwal rapat, kegiatan warga, dan pengumuman lingkungan ditampilkan dalam satu pusat informasi.",
    detail:
      "Pengurus RT dapat menyampaikan update secara cepat, sedangkan warga memperoleh informasi terbaru tanpa harus menunggu pemberitahuan manual.",
  },
];

export async function GET() {
  return Response.json(services);
}
