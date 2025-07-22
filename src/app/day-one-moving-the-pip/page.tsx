import AppLayout from "@/components/AppLayout";
import YouTubeEmbed from "@/components/YouTubeEmbed";

export default function DayOnePage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">📚</span>
          <h1 className="text-3xl font-bold text-white">
            Day One - Moving the Pip
          </h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Welcome to your first day of pilot training. Today we'll learn the
          fundamentals of moving your ship's targeting pip.
        </p>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Lesson Overview
          </h2>
          <p className="text-gray-300 mb-4">
            The targeting pip is your primary tool for aiming and navigation.
            Mastering its movement is essential for all pilot operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">Mouse Control</h3>
              <p className="text-sm text-gray-400">
                Use your mouse to move the pip smoothly across the targeting
                interface.
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-md">
              <h3 className="font-medium text-red-400 mb-2">
                Keyboard Control
              </h3>
              <p className="text-sm text-gray-400">
                Fine-tune your aim using keyboard inputs for precise targeting.
              </p>
            </div>
          </div>
        </div>

        {/* Video Tutorial */}
        <YouTubeEmbed
          videoId="OetHKLhj8rk"
          title="Pip Movement Tutorial"
          startTime={21}
          height="500px"
          className="mb-6"
        />

        {/* Practice Exercises */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Practice Exercises
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Basic Targeting
                </h3>
                <p className="text-sm text-gray-400">
                  Practice moving the pip to stationary targets in the training
                  arena.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Moving Targets
                </h3>
                <p className="text-sm text-gray-400">
                  Track and aim at targets that are moving in predictable
                  patterns.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Precision Shooting
                </h3>
                <p className="text-sm text-gray-400">
                  Focus on accuracy over speed - hit small targets consistently.
                </p>
              </div>
              <div className="bg-black/30 p-4 rounded-md">
                <h3 className="font-medium text-red-400 mb-2">
                  Speed Training
                </h3>
                <p className="text-sm text-gray-400">
                  Increase your reaction time while maintaining accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips and Tricks */}
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-600 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">Pro Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-gray-300">
                Start with slow, deliberate movements to build muscle memory.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-gray-300">
                Practice in short sessions to avoid fatigue and maintain focus.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-gray-300">
                Gradually increase difficulty as your skills improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
