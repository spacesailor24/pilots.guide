import AppLayout from "@/components/AppLayout";

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
      </div>
    </AppLayout>
  );
}
