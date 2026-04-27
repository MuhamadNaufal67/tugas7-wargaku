const tujuanItems = [
  "Memodernisasi layanan administrasi tingkat RT agar lebih cepat dan terdokumentasi.",
  "Membantu RT beradaptasi dengan kebutuhan warga yang menginginkan proses praktis.",
  "Memberikan akses informasi yang mudah bagi seluruh warga secara digital.",
];

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

     
      <section className="grid gap-8 lg:grid-cols-2">

    
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Tujuan</h2>
          {tujuanItems.map((item, index) => (
            <article
              key={index}
              className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-sm font-bold text-[var(--color-primary)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col justify-center">
                <p className="text-base leading-7 text-slate-600">{item}</p>
              </div>
            </article>
          ))}
        </div>

      
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Manfaat</h2>
          {benefitItems.map((item, index) => (
            <article
              key={index}
              className="flex w-full items-start gap-4 rounded-2xl border border-orange-100 bg-[linear-gradient(135deg,_#fff4ea_0%,_#ffffff_60%)] px-6 py-5 shadow-[0_8px_24px_rgba(255,138,61,0.08)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col justify-center">
                <p className="text-base leading-7 text-slate-600">{item}</p>
              </div>
            </article>
          ))}
        </div>

      </section>
    </div>
  );
}