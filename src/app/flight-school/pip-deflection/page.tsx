import AppLayout from "@/components/AppLayout";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function PipDeflectionPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        {/* PIP Deflection Overview */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-semibold text-white mb-3">
            <>PIP Deflection</>
          </h1>
          <p className="text-gray-300 mb-4">
            <>
              PIP deflection is a defensive-oriented technique that shifts your
              ship's momentum in a direction not parallel to your current
              trajectory. Unlike PIP extension (which moves along your current
              path), deflection creates lateral movement that makes you
              significantly harder to track and hit.
            </>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Defensive Tool</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Primarily used to avoid incoming fire by creating
                  unpredictable movement patterns that disrupt enemy aim
                  predictions.
                </>
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Momentum Shift</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Changes your inertia direction without following your nose,
                  making your flight path harder to anticipate.
                </>
              </p>
            </div>
          </div>
        </div>

        {/* How to Perform PIP Deflection */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>How to Perform PIP Deflection</>
          </h2>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Step 1: Neutralize First</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>
                  Always neutralize the PIP before attempting deflection. The
                  closer to neutral, the more effective your deflection will be.
                </>
              </p>
              <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded mt-2">
                <p className="text-sm text-yellow-300">
                  <>
                    <strong>Warning:</strong> If you don't neutralize first,
                    your PIP will only gradually move towards your new
                    direction, making you an easier target.
                  </>
                </p>
              </div>
            </div>

            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Step 2: Roll for Optimal Strafe</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Roll your ship to align your stronger strafe rates with the
                  direction you want to deflect. Most ships have stronger
                  vertical strafe than lateral.
                </>
              </p>
            </div>

            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Step 3: Apply Strafe Input</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Apply strong strafe in your chosen direction to shift your
                  momentum vector away from your current trajectory.
                </>
              </p>
            </div>
          </div>
        </div>

        {/* Video Tutorial */}
        <YouTubeEmbed
          videoId="19yHuv0TgiY"
          title="PIP Deflection Tutorial"
          className="mb-6"
        />

        {/* When to Use PIP Deflection */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Tactical Application</>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Effective Scenarios</>
              </h3>
              <ul className="text-md text-gray-400 space-y-2">
                <>
                  <li>• Long-range engagements (easier to dodge)</li>
                  <li>• Knife fighting (quick direction changes)</li>
                  <li>• Breaking enemy lock during jousts</li>
                  <li>• Escaping focus fire from multiple enemies</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Speed Wall Consideration</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>
                  The closer you are to the speed wall, the more prominent the
                  deflection effect becomes.
                </>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• High speed = stronger deflection</li>
                  <li>• Low speed = weaker deflection</li>
                  <li>• Plan deflections based on current velocity</li>
                </>
              </ul>
            </div>
          </div>
          <div className="bg-red-900/20 border border-red-700 p-4 rounded-md mt-4">
            <p className="text-md text-red-300">
              <>
                <strong>Critical:</strong> Use deflection sparingly! Constant
                deflecting won't prevent the majority of damage and will throw
                off your own aim. Time your deflections strategically.
              </>
            </p>
          </div>
        </div>

        {/* Practice Exercises */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            <>Practice Drills</>
          </h2>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Drill 1: Basic Deflection Timing</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Practice the neutralize-deflect sequence:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Fly at various speeds and practice neutralizing</li>
                  <li>
                    • Once neutral, apply strong strafe in different directions
                  </li>
                  <li>
                    • Observe how quickly your vector changes at different
                    speeds
                  </li>
                  <li>• Return to neutral between each deflection</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Drill 2: Combat Deflection</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Apply deflection under fire:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>• Engage a practice partner at medium range</li>
                  <li>• When they achieve good aim, neutralize and deflect</li>
                  <li>• Practice maintaining your own aim during deflection</li>
                  <li>• Work on quick recovery to offensive positioning</li>
                </>
              </ul>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                <>Drill 3: Combined Techniques</>
              </h3>
              <p className="text-md text-gray-400 mb-2">
                <>Mix deflection with other PIP techniques:</>
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <>
                  <li>
                    • Alternate between neutralization, extension, and
                    deflection
                  </li>
                  <li>
                    • Create unpredictable patterns using all three techniques
                  </li>
                  <li>• Practice smooth transitions between techniques</li>
                  <li>
                    • Focus on maintaining combat effectiveness throughout
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
                <>❌ Deflecting without neutralizing</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Skipping neutralization makes your deflection gradual and
                  predictable, defeating the purpose of the technique.
                </>
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Constant deflection</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Over-using deflection makes you erratic but not necessarily
                  harder to hit. Use it strategically, not constantly.
                </>
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Ignoring your own aim</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Don't sacrifice all offensive capability for defense. The best
                  pilots deflect while maintaining firing solutions.
                </>
              </p>
            </div>
            <div className="bg-red-900/20 p-4 rounded-md border border-red-700">
              <h3 className="font-medium text-red-400 mb-2">
                <>❌ Poor roll management</>
              </h3>
              <p className="text-md text-gray-400">
                <>
                  Failing to roll and align your ship for optimal strafe
                  direction limits the effectiveness of your deflection.
                  Understand and utilize your ship's strongest strafe axes.
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
                  <strong>Combine techniques</strong> - Mix deflection with
                  extension and neutralization to create complex evasion
                  patterns that are nearly impossible to predict.
                </>
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Time your deflections</strong> - Don't spam
                  deflection. Use it when you see enemy shots converging or when
                  breaking through a joust.
                </>
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Maintain offensive pressure</strong> - The goal is to
                  dodge while not compromising your own aim. Practice deflecting
                  while keeping guns on target.
                </>
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-sm font-bold">4</span>
              </div>
              <p className="text-gray-300">
                <>
                  <strong>Know your ship</strong> - Different ships have
                  different strafe capabilities. Learn your ship's strongest
                  strafe axes for optimal deflection.
                </>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
