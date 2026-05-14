export default function AdminLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded-[1.7rem] border border-white/80 bg-white/95 shadow-sm ${
            index < 4 ? "h-36" : "h-64"
          }`}
        />
      ))}
    </div>
  );
}
