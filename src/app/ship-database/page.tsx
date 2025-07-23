import AppLayout from "@/components/AppLayout";

export default function ShipDatabasePage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📖</span>
          <h1 className="text-3xl font-bold text-white">
            <>Ship Database</>
          </h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          <>
            Comprehensive database of all available spacecraft with detailed
            specifications and capabilities.
          </>
        </p>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Ship Categories</>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  <>Fighters</>
                </h3>
                <p className="text-sm text-gray-400">
                  <>
                    Light, agile ships designed for combat and escort missions.
                  </>
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  <>Freighters</>
                </h3>
                <p className="text-sm text-gray-400">
                  <>
                    Heavy cargo ships for transporting goods across the
                    universe.
                  </>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  <>Explorers</>
                </h3>
                <p className="text-sm text-gray-400">
                  <>Long-range vessels equipped for deep space exploration.</>
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  <>Multi-Role</>
                </h3>
                <p className="text-sm text-gray-400">
                  <>
                    Versatile ships capable of handling various mission types.
                  </>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
