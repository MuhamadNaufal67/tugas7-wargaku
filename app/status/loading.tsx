function StatusCardSkeleton() {
  return (
    <div className="rounded-[2rem] border border-slate-200/90 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] p-6 shadow-[0_16px_42px_rgba(15,23,42,0.06)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl flex-1">
          <div className="h-8 w-52 rounded-full bg-slate-200/80" />
          <div className="mt-3 h-4 w-40 rounded-full bg-slate-200/70" />

          <div className="mt-5 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[var(--color-primary-soft)]" />
            <div className="space-y-2">
              <div className="h-5 w-36 rounded-full bg-slate-200/80" />
              <div className="h-4 w-28 rounded-full bg-slate-200/70" />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="h-4 w-full rounded-full bg-slate-200/70" />
            <div className="h-4 w-5/6 rounded-full bg-slate-200/70" />
          </div>

          <div className="mt-5 h-10 w-32 rounded-full bg-[var(--color-primary)]/20" />
        </div>

        <div className="h-10 w-28 rounded-full bg-slate-200/80" />
      </div>
    </div>
  );
}

export default async function Loading() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="animate-pulse space-y-8">
      <section className="rounded-[2.5rem] border border-white/80 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="max-w-3xl">
          <div className="h-10 w-40 rounded-full bg-[var(--color-primary-soft)]" />
          <div className="mt-5 h-12 w-full max-w-2xl rounded-[1.2rem] bg-slate-200/80" />
          <div className="mt-4 h-5 w-full max-w-3xl rounded-full bg-slate-200/70" />
          <div className="mt-2 h-5 w-4/5 max-w-2xl rounded-full bg-slate-200/70" />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 w-24 rounded-full bg-[var(--color-primary)]/20" />
          <div className="h-10 w-24 rounded-full bg-slate-200/70" />
          <div className="h-10 w-24 rounded-full bg-slate-200/70" />
          <div className="h-10 w-24 rounded-full bg-slate-200/70" />
          <div className="h-10 w-24 rounded-full bg-slate-200/70" />
        </div>

        <StatusCardSkeleton />
        <StatusCardSkeleton />
        <StatusCardSkeleton />
      </section>
    </div>
  );
}