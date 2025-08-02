import AppLayout from "@/components/AppLayout";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function DayOnePage() {
  return (
    <AppLayout>
      <div className="mb-8">
        {/* The Binary Circle Overview */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-semibold text-white mb-3">
            <>The Binary Circle</>
          </h1>
          <p className="text-gray-300 mb-4">
            <>
              The Binary Circle is the foundation of Master Modes combat. Unlike
              traditional knife fighting, this technique focuses on maintaining
              optimal positioning through controlled strafe inputs.
            </>
          </p>
          <div className="bg-black/30 p-4 rounded-md mb-4">
            <h3 className="font-medium text-red-400 mb-2">
              <>Core Movement Pattern</>
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              <ul className="text-md text-gray-400 space-y-2 flex-1">
                <>
                  <li>• Forward input at 50% throttle (modulate as needed)</li>
                  <li>• Down strafe at 25% input</li>
                </>
              </ul>
              <ul className="text-md text-gray-400 space-y-2 flex-1">
                <>
                  <li>• Modulate up/down strafe to control distance</li>
                  <li>• Minimal side strafe - only for micro-dodges</li>
                </>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Why It Works</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Master Modes punishes aggressive pushing. The Binary Circle
                  keeps you in the optimal 300m engagement range while
                  maintaining nose-on-target time.
                </>
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Key Principle</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Keep your pip centered on the enemy ship. Always return to
                  center after any dodge - this is your neutral position.
                </>
              </p>
            </div>
          </div>
        </div>

        {/* Video Tutorial */}
        <YouTubeEmbed
          videoId="OetHKLhj8rk"
          title="How To Beat Most Players in Master Modes"
          height="500px"
          className="mb-6"
        />

        {/* Key Concepts */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Critical Concepts</>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Advantage vs Disadvantage</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Recognize positioning immediately:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Neutral: Both ships facing away</li>
                  <li>• Advantage: Your nose on target first</li>
                  <li>• Disadvantage: Enemy has nose on you</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>When to Fight vs Dodge</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Make split-second decisions:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Equal position → Focus on DPS</li>
                  <li>• Advantage → Push and maintain</li>
                  <li>• Disadvantage → Side strafe dodge</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Speed Wall Management</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Don't fight the speed wall - it will punish you. At 300m,
                  focus purely on applying damage rather than maneuvering.
                </>
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Roll is Your Enemy</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Rolling pushes your pip away from target. Stay flat and use
                  strafe inputs only - no roll matching needed.
                </>
              </p>
            </div>
          </div>
        </div>

        {/* Practice Exercises */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Training Progression</>
          </h2>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Stage 1: Binary Circle Basics</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Practice against AI or less skilled opponents:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Maintain forward + down strafe constantly</li>
                  <li>• Keep pip centered without rolling</li>
                  <li>• Practice switching between up/down strafe</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Stage 2: Micro-Dodging</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Add defensive elements:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Quick left/right taps (quarter input only)</li>
                  <li>• Immediately return to center</li>
                  <li>• Time dodges when enemy has nose advantage</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Stage 3: Transition Mastery</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Handle merges and resets:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Down strafe + reverse on merge</li>
                  <li>• Immediate forward input after nose acquisition</li>
                  <li>
                    • Counter opponent's circle strafes with straight line
                    intercepts
                  </li>
                </>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Common Mistakes to Avoid</>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Over-strafing</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Holding strafe inputs too long breaks your positioning. Use
                  quick taps and return to center.
                </>
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Fighting the speed wall</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Trying to maneuver at 300m is futile. Accept the DPS trade and
                  focus on accuracy.
                </>
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Up-strafing on merge</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Up strafe cannot match opponent's back strafe. Always down
                  strafe + reverse on merge.
                </>
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Roll matching</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Rolling disrupts your aim. Stay flat and let strafe inputs
                  handle positioning.
                </>
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mt-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Combat Tips</>
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Circle strafes are dead</strong> - They only work at
                  long range with slow projectiles. In close combat, opponents
                  counter with simple lateral movement.
                </>
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Win micro-battles</strong> - Master Modes is about
                  winning fractions of fights. Every quarter-second of better
                  positioning adds up.
                </>
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Smooth inputs win</strong> - Jerky movements waste
                  energy. Use minimal stick movement - quarter inputs are
                  usually enough.
                </>
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Atmosphere advantage</strong> - The Binary Circle
                  works even better in atmosphere where knife fighting becomes
                  easier.
                </>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
