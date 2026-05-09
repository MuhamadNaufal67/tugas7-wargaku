export default function Loading() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md animate-pulse rounded-[2.25rem] border border-white/80 bg-white/95 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="text-center">
          <div className="mx-auto h-10 w-36 rounded-full bg-[var(--color-primary-soft)]" />
          <div className="mx-auto mt-5 h-12 w-4/5 rounded-[1.2rem] bg-slate-200/80" />
          <div className="mx-auto mt-4 h-5 w-full rounded-full bg-slate-200/70" />
          <div className="mx-auto mt-2 h-5 w-3/4 rounded-full bg-slate-200/70" />
          <div className="mx-auto mt-4 h-14 w-full rounded-2xl bg-slate-100" />
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <div className="mb-2 h-4 w-24 rounded-full bg-slate-200/80" />
            <div className="h-14 w-full rounded-2xl bg-slate-100" />
          </div>

          <div>
            <div className="mb-2 h-4 w-24 rounded-full bg-slate-200/80" />
            <div className="h-14 w-full rounded-2xl bg-slate-100" />
          </div>

          <div className="h-12 w-full rounded-full bg-[var(--color-accent)]/20" />
        </div>
      </div>
    </section>
  );
}
