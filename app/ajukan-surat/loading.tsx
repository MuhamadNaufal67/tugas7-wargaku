export default function Loading() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-3xl animate-pulse rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-10 w-44 rounded-full bg-[var(--color-primary-soft)]" />
          <div className="mx-auto mt-5 h-12 w-full max-w-xl rounded-[1.2rem] bg-slate-200/80" />
          <div className="mx-auto mt-4 h-5 w-full rounded-full bg-slate-200/70" />
          <div className="mx-auto mt-2 h-5 w-4/5 rounded-full bg-slate-200/70" />
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
              <div className="mb-2 h-4 w-28 rounded-full bg-slate-200/80" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
            </div>
            <div>
              <div className="mb-2 h-4 w-36 rounded-full bg-slate-200/80" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <div className="h-12 w-40 rounded-full bg-[var(--color-accent)]/20" />
            <div className="h-12 w-28 rounded-full bg-slate-200/80" />
          </div>
        </div>
      </div>
    </section>
  );
}
