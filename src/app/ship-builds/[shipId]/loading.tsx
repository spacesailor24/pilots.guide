import AppLayout from "@/components/AppLayout";

export default function Loading() {
  return (
    <AppLayout>
      <div className="mb-8">
        {/* Ship Overview Skeleton */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 flex-shrink-0 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="flex-1">
              <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-full max-w-md bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Build Skeleton */}
        <div className="mb-8">
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
            <div className="mb-4">
              <div className="h-6 w-64 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-full max-w-xl bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="flex items-center space-x-4">
                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
            {/* Iframe placeholder */}
            <div className="h-[600px] bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Other Builds Grid Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 rounded-lg border border-red-600 p-4 shadow-lg"
              >
                <div className="h-5 w-3/4 bg-zinc-800 rounded animate-pulse mb-3" />
                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="h-9 w-full bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}