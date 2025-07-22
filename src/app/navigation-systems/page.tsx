import AppLayout from "@/components/AppLayout";

export default function NavigationSystemsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🎯</span>
          <h1 className="text-3xl font-bold text-white">Navigation Systems</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Learn to navigate through space using various advanced navigation
          systems and tools.
        </p>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Navigation Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Star Map</h3>
                <p className="text-sm text-gray-400">
                  Interactive 3D map showing star systems, jump points, and
                  trade routes.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Quantum Drive</h3>
                <p className="text-sm text-gray-400">
                  Long-distance travel system for crossing vast interstellar
                  distances.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Jump Points</h3>
                <p className="text-sm text-gray-400">
                  Natural wormholes connecting different star systems throughout
                  the universe.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Beacon Network
                </h3>
                <p className="text-sm text-gray-400">
                  Automated navigation beacons providing real-time location and
                  safety data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
