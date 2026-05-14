export default function DashboardLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-[1.7rem] border border-white/80 bg-white/95 shadow-sm ${
            index < 3 ? "h-36" : "h-64"
          }`}
        />
      ))}
    </div>
  );
}
