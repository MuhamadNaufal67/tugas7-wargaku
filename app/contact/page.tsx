export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2.25rem] bg-[linear-gradient(160deg,_#1f6ba5_0%,_#2d81c1_55%,_#69addf_100%)] p-8 text-white shadow-[0_20px_70px_rgba(31,107,165,0.24)] lg:p-10">
        <span className="inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/84">
          Contact
        </span>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Hubungi tim WargaKu.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
          Gunakan formulir di samping untuk mengirim pertanyaan, kerja sama,
          atau kebutuhan presentasi terkait website company profile WargaKu.
        </p>
      </section>

      <section className="rounded-[2.25rem] border border-white/80 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <h2 className="text-2xl font-bold text-slate-900">Form Pesan</h2>
        <form className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nama
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Masukkan nama Anda"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Masukkan email Anda"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Tulis pesan Anda"
              className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_35px_rgba(255,138,61,0.28)] transition hover:-translate-y-0.5"
          >
            Kirim Pesan
          </button>
        </form>
      </section>
    </div>
  );
}
