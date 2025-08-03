import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-zinc-800 rounded",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-lg border border-red-600 p-4 shadow-lg">
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}