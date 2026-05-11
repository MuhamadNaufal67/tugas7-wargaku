export default async function Loading() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="space-y-8 animate-pulse">
      <section className="rounded-[2.5rem] border border-white/80 bg-white/92 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="h-10 w-40 rounded-full bg-[var(--color-primary-soft)]" />

        <div className="mt-5 h-14 w-4/5 rounded-[1.5rem] bg-slate-200/80" />

        <div className="mt-6 h-5 w-full rounded-full bg-slate-200/70" />
        <div className="mt-3 h-5 w-5/6 rounded-full bg-slate-200/70" />
        <div className="mt-3 h-5 w-4/6 rounded-full bg-slate-200/70" />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-8 w-32 rounded-full bg-slate-200/80" />

          {[1, 2, 3].map((item) => (
            <article
              key={item}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="h-11 w-11 rounded-xl bg-[var(--color-primary-soft)]" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-full rounded-full bg-slate-200/70" />
                <div className="h-5 w-5/6 rounded-full bg-slate-200/70" />
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-8 w-32 rounded-full bg-slate-200/80" />

          {[1, 2, 3].map((item) => (
            <article
              key={item}
              className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-[linear-gradient(135deg,_#fff4ea_0%,_#ffffff_60%)] px-6 py-5 shadow-[0_8px_24px_rgba(255,138,61,0.08)]"
            >
              <div className="h-11 w-11 rounded-xl bg-orange-100" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-full rounded-full bg-slate-200/70" />
                <div className="h-5 w-5/6 rounded-full bg-slate-200/70" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}