import AppLayout from "@/components/AppLayout";

export default function ShipSystemsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">⚙️</span>
          <h1 className="text-3xl font-bold text-white">Ship Systems</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Understand various spacecraft systems and components essential for
          pilot operations.
        </p>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Core Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Power Plant</h3>
                <p className="text-sm text-gray-400">
                  The heart of your ship, providing energy to all onboard
                  systems.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Shield Generators
                </h3>
                <p className="text-sm text-gray-400">
                  Protective barriers that absorb damage and protect your hull.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Life Support</h3>
                <p className="text-sm text-gray-400">
                  Maintains breathable atmosphere and comfortable conditions.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Cooling Systems
                </h3>
                <p className="text-sm text-gray-400">
                  Prevents overheating of critical components during operation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
