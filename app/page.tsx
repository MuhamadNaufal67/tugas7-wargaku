import Link from "next/link";

const featureCards = [
  {
    title: "Ajukan Surat",
    description:
      "Warga dapat mengirim permohonan surat secara online tanpa harus datang berkali-kali ke pengurus RT.",
  },
  {
    title: "Status Realtime",
    description:
      "Pantau progres pengajuan dengan jelas, dari diterima, diproses, sampai siap diunduh.",
  },
  {
    title: "Pengumuman RT",
    description:
      "Informasi agenda kerja bakti, rapat warga, dan pemberitahuan penting tampil dalam satu dashboard.",
  },
];

const highlightPoints = [
  "Dashboard modern dengan alur yang mudah dipahami semua warga",
  "Warna biru-oranye yang ramah, bersih, dan konsisten di seluruh halaman",
  "Tampilan responsif untuk kebutuhan presentasi company profile",
];

const cardClassName =
  "rounded-[1.75rem] border border-slate-200/80 bg-white/92 shadow-[0_18px_45px_rgba(15,23,42,0.07)]";

export default function HomePage() {
  return (
    <div className="space-y-14 pb-8 lg:space-y-16">
      <section className="grid items-start gap-12 pt-2 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-14 lg:pt-8">
        <div className="max-w-2xl space-y-8 pt-4">
          <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)] sm:text-sm">
            Solusi Administrasi RT Modern
          </span>
          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[3.8rem] lg:leading-[1.05]">
              Administrasi RT digital yang rapi, cepat, dan mudah dipakai
              warga.
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              WargaKu membantu pengurus RT dan warga mengelola surat, memantau
              status pengajuan, dan mengakses informasi lingkungan dalam satu
              dashboard yang modern dan responsif.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="rounded-full bg-[var(--color-accent)] px-7 py-3.5 text-base font-bold text-white shadow-[0_18px_38px_rgba(255,138,61,0.28)] hover:-translate-y-0.5"
            >
              Lihat Layanan
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-base font-bold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Hubungi Kami
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featureCards.map((feature) => (
              <article key={feature.title} className={`${cardClassName} p-6`}>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative lg:pl-2">
          <div className="rounded-[2.5rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_80px_rgba(45,129,193,0.16)] sm:p-5">
            <div className="rounded-[2rem] bg-[linear-gradient(180deg,_#f7fbff_0%,_#edf5fb_100%)] p-4 sm:p-5">
              <div className="inline-flex items-center gap-3 rounded-full bg-[var(--color-primary-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                Preview Dashboard Aplikasi
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white">
                <div className="grid min-h-[27rem] grid-cols-[4.5rem_1fr]">
                  <aside className="flex flex-col gap-4 border-r border-slate-100 bg-slate-50/90 p-4">
                    <span className="h-10 rounded-2xl bg-[var(--color-primary)]/18" />
                    <span className="h-10 rounded-2xl bg-[var(--color-primary)]/12" />
                    <span className="h-10 rounded-2xl bg-[var(--color-primary)]/12" />
                    <span className="h-10 rounded-2xl bg-[var(--color-primary)]/12" />
                  </aside>

                  <div className="p-4 sm:p-5">
                    <div className="rounded-[1.5rem] bg-[var(--color-dashboard)] p-5 text-slate-950 sm:p-6">
                      <div className="grid gap-5 md:grid-cols-[0.75fr_1fr] md:items-center">
                        <div className="relative h-48 overflow-hidden rounded-[1.5rem] bg-white/20">
                          <div className="absolute left-8 top-9 h-24 w-24 rounded-full bg-white/90" />
                          <div className="absolute left-4 top-16 h-28 w-20 rounded-full bg-[#6a5cff]" />
                          <div className="absolute left-20 top-24 h-20 w-12 rounded-full bg-[#ff648c]" />
                          <div className="absolute bottom-4 left-10 h-12 w-36 rounded-full bg-[#2d3759]" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/85">
                            Tampilan Utama
                          </p>
                          <h2 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                            Dashboard RT yang informatif
                          </h2>
                          <p className="text-sm leading-7 text-slate-800/80 sm:text-base">
                            Agenda RT, menu pengajuan surat, dan akses status
                            pengajuan tampil dalam satu layar seperti referensi
                            desain yang Anda lampirkan.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className={`${cardClassName} p-5`}>
                        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                          4 Modul Inti
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          Dashboard, pengajuan surat, cek status, dan unduh
                          surat dalam satu aplikasi.
                        </p>
                      </div>
                      <div className={`${cardClassName} p-5`}>
                        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                          Realtime
                        </p>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          Status pengajuan bisa dipantau langsung tanpa proses
                          manual yang berulang.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 right-2 hidden max-w-xs rounded-[2rem] border border-white/85 bg-white/95 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] lg:block">
            <span className="inline-flex rounded-full bg-[#d7f0df] px-4 py-2 text-sm font-semibold text-[#2d8b57]">
              Nilai Utama
            </span>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {highlightPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[2.5rem] bg-[linear-gradient(135deg,_#1f6ba5_0%,_#2d81c1_58%,_#5fa5da_100%)] p-8 text-white shadow-[0_20px_70px_rgba(31,107,165,0.22)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/75">
            Mengapa WargaKu
          </p>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Fitur singkat yang dibuat untuk kebutuhan administrasi lingkungan.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] bg-white/14 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-bold">Cepat</h3>
            <p className="mt-3 text-sm leading-7 text-white/82">
              Permohonan surat dikirim dalam hitungan menit tanpa alur yang
              membingungkan.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-white/14 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-bold">Transparan</h3>
            <p className="mt-3 text-sm leading-7 text-white/82">
              Pengurus dan warga dapat melihat status layanan dengan informasi
              yang lebih jelas.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-white/14 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-bold">Terpusat</h3>
            <p className="mt-3 text-sm leading-7 text-white/82">
              Pengumuman RT, layanan surat, dan arsip digital berada dalam satu
              ekosistem.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
