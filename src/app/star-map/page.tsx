import AppLayout from "@/components/AppLayout";

export default function StarMapPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🌟</span>
          <h1 className="text-3xl font-bold text-white">Star Map</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Interactive 3D star map showing all known star systems, jump points,
          and trade routes throughout the universe.
        </p>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Map Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Star Systems</h3>
                <p className="text-sm text-gray-400">
                  Explore hundreds of unique star systems with their own planets
                  and resources.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Jump Points</h3>
                <p className="text-sm text-gray-400">
                  Navigate through natural wormholes connecting distant regions
                  of space.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Trade Routes</h3>
                <p className="text-sm text-gray-400">
                  Discover profitable trading paths between different systems
                  and stations.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Danger Zones</h3>
                <p className="text-sm text-gray-400">
                  Identify areas with high pirate activity or hazardous
                  conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
