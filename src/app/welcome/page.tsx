import AppLayout from "@/components/AppLayout";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl mr-4">⚔️</span>
          <h1 className="text-4xl font-bold text-white">
            <>Schola Volandi</>
          </h1>
        </div>
        <p className="text-xl text-red-400 font-medium mb-2">
          <>School of Flight</>
        </p>
        <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
          <>
            Welcome to the premier combat flight training academy in the 'Verse.
            Master the art of dogfighting through proven techniques and
            structured training.
          </>
        </p>
      </div>

      {/* What is Schola Volandi */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          <>About Schola Volandi</>
        </h2>
        <p className="text-gray-300 mb-4">
          <>
            Schola Volandi is a comprehensive combat training program designed
            to transform novice pilots into skilled combatants. Our curriculum
            focuses on practical, battle-tested techniques that work in real
            combat scenarios.
          </>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Structured Learning</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                Progressive training modules from fundamentals to advanced
                tactics
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Combat Proven</>
            </h3>
            <p className="text-sm text-gray-400">
              <>
                Techniques refined through countless engagements in the 'Verse
              </>
            </p>
          </div>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Practical Focus</>
            </h3>
            <p className="text-sm text-gray-400">
              <>Learn what works in real fights, not just theory</>
            </p>
          </div>
        </div>
      </div>

      {/* Training Philosophy */}
      <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-600 p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          <>Training Philosophy</>
        </h2>
        <div className="space-y-4">
          <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-300">
            <>
              "In Master Modes, victory belongs to those who control the
              micro-battles. Every quarter-second of advantage compounds into
              dominance."
            </>
          </blockquote>
          <p className="text-gray-300">
            <>
              Our approach emphasizes understanding the{" "}
              <strong className="text-red-400">why</strong> behind each
              technique. You'll learn not just what to do, but when and why to
              do it. This deeper understanding allows you to adapt techniques to
              your personal flying style and ship capabilities.
            </>
          </p>
        </div>
      </div>

      {/* Curriculum Overview */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          <>Combat Curriculum</>
        </h2>
        <div className="space-y-4">
          {/* Day One */}
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">
              <>Day One: Fundamentals</>
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              <>
                Master the core techniques that form the foundation of all
                advanced combat maneuvers.
              </>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/day-one/the-binary-circle" className="group">
                <div className="bg-zinc-800 p-3 rounded hover:bg-zinc-700 transition-colors border border-zinc-700 group-hover:border-red-600">
                  <h4 className="text-white font-medium text-sm mb-1">
                    <>The Binary Circle</>
                  </h4>
                  <p className="text-xs text-gray-400">
                    <>
                      The meta technique for Master Modes combat - control
                      engagement distance and win DPS races
                    </>
                  </p>
                </div>
              </Link>
              <Link href="/day-one/pip-neutralization" className="group">
                <div className="bg-zinc-800 p-3 rounded hover:bg-zinc-700 transition-colors border border-zinc-700 group-hover:border-red-600">
                  <h4 className="text-white font-medium text-sm mb-1">
                    <>PIP Neutralization</>
                  </h4>
                  <p className="text-xs text-gray-400">
                    <>
                      Increase hit probability by matching velocity vectors and
                      minimizing projectile travel time
                    </>
                  </p>
                </div>
              </Link>
              <Link href="/day-one/pip-deflection" className="group">
                <div className="bg-zinc-800 p-3 rounded hover:bg-zinc-700 transition-colors border border-zinc-700 group-hover:border-red-600">
                  <h4 className="text-white font-medium text-sm mb-1">
                    <>PIP Deflection</>
                  </h4>
                  <p className="text-xs text-gray-400">
                    <>
                      Deflect incoming projectiles by neutralizing and then
                      applying a strong strafe input in the direction of the
                      projectile's trajectory
                    </>
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-600 p-6 text-center">
        <h2 className="text-xl font-semibold text-white mb-3">
          <>Ready to Master Combat?</>
        </h2>
        <p className="text-gray-300 mb-6">
          <>
            Begin your journey with Day One fundamentals. Each lesson builds on
            the previous, creating a complete combat system.
          </>
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/day-one/the-binary-circle"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            <>Start with The Binary Circle</>
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
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
