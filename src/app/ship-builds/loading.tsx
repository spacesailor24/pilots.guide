import AppLayout from "@/components/AppLayout";
import SubmitBuildCard from "@/components/SubmitBuildCard";

export default function Loading() {
  return (
    <AppLayout>
      <div className="mb-8">
        {/* Ship Builds Overview */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-semibold text-white mb-3">
            Ship Builds
          </h1>
          <p className="text-gray-300 mb-4">
            Explore optimized ship builds for different roles and playstyles.
          </p>
        </div>

        {/* Ship Builds Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-6">
            {/* Add a Build Card */}
            <SubmitBuildCard />

            {/* Skeleton Ship Cards */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg"
              >
                {/* Top Section - Ship Image Skeleton */}
                <div className="relative h-48 bg-zinc-800 animate-pulse" />

                {/* Bottom Section - Ship Info Skeleton */}
                <div className="bg-gradient-to-r to-red-900/80 from-black p-4">
                  <div className="h-6 w-3/4 bg-zinc-800 rounded animate-pulse mb-2" />
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                    <span className="text-white">/</span>
                    <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                    <span className="text-white">/</span>
                    <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}