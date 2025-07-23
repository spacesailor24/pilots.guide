import AppLayout from "@/components/AppLayout";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function PipNeutralizationPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🎯</span>
          <h1 className="text-3xl font-bold text-white">
            Day One: PIP Neutralization
          </h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Master the fundamental technique of PIP neutralization to dramatically improve your hit rate and aiming precision in Star Citizen dogfighting. This essential skill reduces projectile travel time and increases combat effectiveness.
        </p>

        {/* PIP Neutralization Overview */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Understanding PIP Neutralization
          </h2>
          <p className="text-gray-300 mb-4">
            PIP neutralization is the technique of matching your opponent's velocity and direction to minimize the lead indicator offset. By reducing the distance between your crosshair and target, you increase hit probability and reduce the time enemies have to dodge.
          </p>
          <div className="bg-black/30 p-4 rounded-md">
            <h3 className="font-medium text-red-400 mb-2">Core Concept</h3>
            <p className="text-sm text-gray-400">
              When you match another ship's velocity and direction, the PIP (Predicted Impact Point) shifts back to being directly on top of your target, effectively "neutralizing" the lead indicator.
            </p>
          </div>
        </div>

        {/* How the PIP Moves */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            PIP Movement Mechanics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">Your Movement Effects</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Strafe left → PIP moves right</li>
                <li>• Strafe right → PIP moves left</li>
                <li>• Forward thrust → PIP moves closer to target</li>
                <li>• Backward thrust → PIP moves away from target</li>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">Opponent's Movement</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Enemy moves left → PIP shifts left</li>
                <li>• Enemy moves right → PIP shifts right</li>
                <li>• Matching their vector → PIP returns to center</li>
                <li>• Relative velocity determines PIP distance</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-md mt-4">
            <p className="text-sm text-yellow-300">
              <strong>Key Insight:</strong> The PIP represents where you need to aim based on the relative motion between you and your target. Understanding this relationship is crucial for effective neutralization.
            </p>
          </div>
        </div>

        {/* Video Tutorial */}
        <YouTubeEmbed
          videoId="ADkxWp21YBg"
          title="PIP Neutralization Tutorial"
          height="500px"
          className="mb-6"
        />

        {/* Benefits of PIP Neutralization */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Why Neutralize the PIP?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">Increased Hit Reliability</h3>
              <p className="text-sm text-gray-400 mb-2">
                Primary benefit: Reduced projectile travel time means less opportunity for enemies to change vector and dodge.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Shorter projectile flight time</li>
                <li>• Less prediction required</li>
                <li>• More consistent damage application</li>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">Enhanced Aim Control</h3>
              <p className="text-sm text-gray-400 mb-2">
                Use strafe to slide your crosshair into position without oversteering.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Supplement rotational aiming</li>
                <li>• Prevent pitch/yaw overshoot</li>
                <li>• Fine-tune aim with translation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Practice Exercises */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Practice Drills
          </h2>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                Drill 1: Static Target Practice
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                Start with a stationary target to understand PIP behavior:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Strafe in different directions and observe PIP movement</li>
                <li>• Practice returning PIP to center using counter-strafe</li>
                <li>• Combine forward/backward thrust with lateral movement</li>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                Drill 2: Moving Target Matching
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                Progress to matching a moving target's velocity:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Follow a friendly ship maintaining their speed</li>
                <li>• Keep PIP centered while they perform gentle maneuvers</li>
                <li>• Practice quick velocity matching after direction changes</li>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                Drill 3: Combat Application
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                Apply neutralization in combat scenarios:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Neutralize during jousting passes</li>
                <li>• Maintain neutralization through evasive maneuvers</li>
                <li>• Use strafe aiming to track erratic targets</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Pro Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-gray-300">
                <strong>Strafe aiming is supplemental</strong> - Use it to fine-tune your aim, not as your primary aiming method. Rotational forces should still do most of the work.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-gray-300">
                <strong>Predict enemy vector changes</strong> - Start matching velocity as they begin maneuvers, not after they complete them.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-gray-300">
                <strong>Combine with leading shots</strong> - Even with neutralization, some lead is often necessary. Use both techniques together.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <p className="text-gray-300">
                <strong>Practice in Arena Commander</strong> - Use Pirate Swarm or Free Flight to perfect your neutralization without risking your ship.
              </p>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">Common Mistakes to Avoid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">❌ Over-reliance on strafe</h3>
              <p className="text-sm text-gray-400">
                Don't try to aim entirely with strafe. Your ship's rotation is still the primary aiming tool.
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">❌ Ignoring relative velocity</h3>
              <p className="text-sm text-gray-400">
                Remember it's about matching their vector, not just their speed. Direction matters as much as velocity.
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">❌ Static positioning</h3>
              <p className="text-sm text-gray-400">
                Don't become predictable. Neutralize for shots, then vary your movement to avoid return fire.
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">❌ Forgetting combat basics</h3>
              <p className="text-sm text-gray-400">
                PIP neutralization is a tool, not a complete strategy. Maintain situational awareness and defensive flying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}