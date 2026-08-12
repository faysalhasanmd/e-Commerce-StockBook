export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e2ddd1] border-t-[#a9772e]" />
        <p className="font-medium tracking-[0.18em] text-[#6b6862] uppercase text-xs">
          Loading...
        </p>
      </div>
    </div>
  );
}
