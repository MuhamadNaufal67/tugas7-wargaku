export default async function Loading() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] animate-pulse">
      <section className="rounded-[2.25rem] bg-[linear-gradient(160deg,_#1f6ba5_0%,_#2d81c1_55%,_#69addf_100%)] p-8 text-white shadow-[0_20px_70px_rgba(31,107,165,0.24)] lg:p-10">
        <div className="h-8 w-28 rounded-full bg-white/20" />
        <div className="mt-5 h-12 w-4/5 rounded-2xl bg-white/20" />
        <div className="mt-6 h-5 w-full rounded-full bg-white/20" />
        <div className="mt-3 h-5 w-3/4 rounded-full bg-white/20" />
      </section>

      <section className="rounded-[2.25rem] border border-white/80 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <h1 className="text-3xl font-bold text-slate-800">
          Loading...
        </h1>

        <p className="mt-2 text-slate-500">
          Mohon tunggu sebentar
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <div className="mb-2 h-4 w-20 rounded-full bg-slate-200" />
            <div className="h-14 w-full rounded-2xl bg-slate-100" />
          </div>

          <div>
            <div className="mb-2 h-4 w-20 rounded-full bg-slate-200" />
            <div className="h-14 w-full rounded-2xl bg-slate-100" />
          </div>

          <div>
            <div className="mb-2 h-4 w-20 rounded-full bg-slate-200" />
            <div className="h-36 w-full rounded-[1.5rem] bg-slate-100" />
          </div>

          <div className="h-12 w-40 rounded-full bg-[var(--color-accent)]/20" />
        </div>
      </section>
    </div>
  );
}