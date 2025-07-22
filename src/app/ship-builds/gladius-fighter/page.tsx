import AppLayout from "@/components/AppLayout";
import IframeDisplay from "@/components/IframeDisplay";
import Link from "next/link";

export default function GladiusFighterPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">⚔️</span>
          <h1 className="text-3xl font-bold text-white">
            Gladius Fighter Build
          </h1>
        </div>

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link
            href="/ship-builds"
            className="hover:text-red-400 transition-colors"
          >
            Ship Builds
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Gladius Fighter</span>
        </nav>

        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          A versatile light fighter build optimized for dogfighting and escort
          missions. This build focuses on agility and firepower while
          maintaining good survivability.
        </p>

        {/* Build Details */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Build Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Role</h3>
                <p className="text-sm text-gray-400">Light Fighter / Escort</p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Difficulty</h3>
                <p className="text-sm text-gray-400">Beginner Friendly</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Strengths</h3>
                <p className="text-sm text-gray-400">
                  High agility, good firepower, cost-effective
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Weaknesses</h3>
                <p className="text-sm text-gray-400">
                  Limited cargo, low armor
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Best For</h3>
                <p className="text-sm text-gray-400">
                  Dogfighting, escort missions, bounty hunting
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">Price Range</h3>
                <p className="text-sm text-gray-400">Affordable to mid-range</p>
              </div>
            </div>
          </div>
        </div>

        {/* Erkul Loadout */}
        <IframeDisplay
          src="https://www.erkul.games/loadout/KXHBgPy1"
          title="Gladius Fighter Loadout"
          height="800px"
          className="mb-6"
        />

        {/* Build Strategy */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Combat Strategy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Engagement Tactics
                </h3>
                <p className="text-sm text-gray-400">
                  Use your superior agility to outmaneuver larger ships. Stay
                  mobile and avoid head-on confrontations with heavy fighters.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Weapon Management
                </h3>
                <p className="text-sm text-gray-400">
                  Focus on precision shots rather than sustained fire. Use your
                  weapons efficiently to maximize damage output.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Defensive Maneuvers
                </h3>
                <p className="text-sm text-gray-400">
                  Keep your shields up and use evasive maneuvers when under
                  heavy fire. Don't be afraid to disengage if outnumbered.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Team Coordination
                </h3>
                <p className="text-sm text-gray-400">
                  Work with wingmen to focus fire on priority targets. Use your
                  speed to provide support where needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Upgrades */}
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-600 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recommended Upgrades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-red-400">
                Priority 1 (Essential)
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Military-grade shields for better survivability</li>
                <li>• High-quality power plant for weapon efficiency</li>
                <li>• Improved cooling systems</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-red-400">
                Priority 2 (Recommended)
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Enhanced targeting systems</li>
                <li>• Better quantum drive for faster travel</li>
                <li>• Advanced missile racks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-red-600/30">
          <div className="flex justify-between items-center">
            <Link
              href="/ship-builds"
              className="inline-flex items-center px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-md hover:bg-zinc-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Builds
            </Link>
            <Link
              href="/ship-builds/arrow-interceptor"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Next Build
              <svg
                className="w-4 h-4 ml-2"
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
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
