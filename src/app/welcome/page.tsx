import AppLayout from "@/components/AppLayout";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center bg-zinc-900 rounded-lg border border-red-600 p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            <>Welcome to the Pilot's Guide to the 'Verse</>
          </h1>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-red-600 p-4 sm:p-6 shadow-lg mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
          <>Flight School</>
        </h2>
        <p className="text-gray-300 mb-4">
          <>
            Master combat fundamentals through structured training. Learn proven
            techniques from basic maneuvers to advanced tactics.
          </>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>The Binary Circle</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                The Binary Circle is the foundation of Master Modes combat.
                Unlike traditional knife fighting, this technique focuses on
                maintaining optimal positioning through controlled strafe
                inputs.
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>PIP Neutralization</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                Master PIP Neutralization to maximize hit probability. Learn how
                to use PIP to control your ship's orientation and position
                relative to the enemy.
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>PIP Deflection</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                Master PIP Deflection to avoid incoming fire. Learn how to use
                PIP to control your ship's orientation and position relative to
                the enemy.
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <div className="mt-6 flex items-center justify-center text-red-400">
              <span className="text-sm font-medium">
                <Link href="/flight-school/the-binary-circle">
                  Start Training
                </Link>
              </span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-red-600 p-4 sm:p-6 shadow-lg mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
          <>Ship Builds</>
        </h2>
        <p className="text-gray-300 mb-4">
          <>
            Browse community-tested ship builds for every role. Find the perfect
            loadout for your playstyle and ship.
          </>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Gladius</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                The Gladius is a versatile ship that can be used for a variety
                of roles. It is a good all-rounder and is a good starting ship
                for new players.
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Arrow</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                The Arrow is a light fighter that is good for quick engagements
                and dogfighting. It is a good starting ship for new players.
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Super Hornet MK II</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                The Super Hornet MK II is a heavy fighter that is good for
                long-range engagements and dogfighting. It is a good starting
                ship for new players.
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <div className="mt-6 flex items-center justify-center text-red-400">
              <span className="text-sm font-medium">
                <Link href="/ship-builds">Browse Builds</Link>
              </span>
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
