export default async function Loading() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-3xl animate-pulse rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Loading...
          </h1>

          <p className="mt-3 text-slate-500">
            Mohon tunggu sebentar
          </p>

          <div className="mx-auto mt-6 h-10 w-40 rounded-full bg-[var(--color-primary-soft)]" />
          <div className="mx-auto mt-5 h-12 w-4/5 rounded-[1.2rem] bg-slate-200/80" />
          <div className="mx-auto mt-4 h-5 w-full rounded-full bg-slate-200/70" />
          <div className="mx-auto mt-2 h-5 w-3/4 rounded-full bg-slate-200/70" />
        </div>

        <div className="mt-10 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 h-4 w-20 rounded-full bg-slate-200/80" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
            </div>

            <div>
              <div className="mb-2 h-4 w-20 rounded-full bg-slate-200/80" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
            </div>
          </div>

          <div>
            <div className="mb-2 h-4 w-24 rounded-full bg-slate-200/80" />
            <div className="h-32 w-full rounded-[1.5rem] bg-slate-100" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 h-4 w-24 rounded-full bg-slate-200/80" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
            </div>

            <div>
              <div className="mb-2 h-4 w-32 rounded-full bg-slate-200/80" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <div className="h-12 w-40 rounded-full bg-[var(--color-accent)]/20" />
            <div className="h-12 w-32 rounded-full bg-slate-200/70" />
          </div>
        </div>
      </div>
    </section>
  );
}