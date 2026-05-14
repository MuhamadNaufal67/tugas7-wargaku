export default function GlobalLoading() {
  return (
    <section className="space-y-6">
      <div className="animate-pulse rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-sm sm:p-8">
        <div className="h-8 w-48 rounded-full bg-[var(--color-primary-soft)]" />
        <div className="mt-5 h-12 w-full max-w-3xl rounded-[1.4rem] bg-slate-200/80" />
        <div className="mt-3 h-5 w-5/6 rounded-full bg-slate-200/70" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[1.7rem] border border-white/80 bg-white/95 shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}
