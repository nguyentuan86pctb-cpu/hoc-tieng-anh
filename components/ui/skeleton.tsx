export function Skeleton() {
  return (
    <div className="space-y-3 rounded-[28px] bg-white p-5 shadow-soft">
      <div className="h-5 w-2/3 animate-pulse rounded-full bg-ink/10" />
      <div className="h-24 animate-pulse rounded-3xl bg-ink/10" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 animate-pulse rounded-2xl bg-ink/10" />
        <div className="h-10 animate-pulse rounded-2xl bg-ink/10" />
      </div>
    </div>
  );
}
