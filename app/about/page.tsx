const benefitItems = [
  "Mempercepat proses administrasi RT tanpa antrean manual.",
  "Mengurangi risiko data tercecer karena semua proses tercatat digital.",
  "Meningkatkan transparansi layanan antara pengurus RT dan warga.",
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-white/80 bg-white/92 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <span className="inline-flex rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
          Tentang WargaKu
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Platform administrasi RT digital yang dibuat agar layanan warga lebih
          cepat dan tertata.
        </h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">
          WargaKu adalah aplikasi administrasi RT digital yang membantu proses
          pengajuan surat, pemantauan status layanan, dan distribusi pengumuman
          RT dalam satu sistem yang mudah digunakan. Tampilan dan alurnya
          dirancang agar ramah untuk warga sekaligus efisien untuk pengurus.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <h2 className="text-2xl font-bold text-slate-900">Tujuan</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            WargaKu hadir untuk memodernisasi layanan administrasi tingkat RT
            agar lebih cepat, terdokumentasi, dan responsif. Sistem ini
            membantu RT beradaptasi dengan kebutuhan warga yang menginginkan
            proses praktis dan akses informasi yang mudah.
          </p>
        </article>

        <article className="rounded-[2rem] bg-[linear-gradient(135deg,_#fff4ea_0%,_#ffffff_45%,_#eef6fd_100%)] p-8 shadow-[0_18px_50px_rgba(255,138,61,0.12)]">
          <h2 className="text-2xl font-bold text-slate-900">Manfaat</h2>
          <ul className="mt-5 space-y-4">
            {benefitItems.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
