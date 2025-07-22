import AppLayout from "@/components/AppLayout";

export default function BasicFlightControlsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">✈️</span>
          <h1 className="text-3xl font-bold text-white">
            Basic Flight Controls
          </h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Master the fundamental controls for piloting spacecraft through the
          vastness of space.
        </p>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Primary Flight Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Thrust Control
                </h3>
                <p className="text-sm text-gray-400">
                  Manage your ship's forward momentum and acceleration.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Pitch & Roll</h3>
                <p className="text-sm text-gray-400">
                  Control your ship's orientation in three-dimensional space.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Yaw Control</h3>
                <p className="text-sm text-gray-400">
                  Steer your ship left and right while maintaining forward
                  momentum.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Stabilization</h3>
                <p className="text-sm text-gray-400">
                  Keep your ship steady during complex maneuvers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
