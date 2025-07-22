import AppLayout from "@/components/AppLayout";

export default function WelcomePage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🚀</span>
          <h1 className="text-3xl font-bold text-white">Welcome</h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed">Hello World</p>
      </div>

      {/* Content Cards */}
      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">
            Getting Started
          </h2>
          <p className="text-gray-300 mb-4">
            Welcome to the Pilot's Guide to the 'Verse. This comprehensive guide
            will help you navigate the universe and become a skilled pilot.
          </p>
          <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-300">
                  <strong>Next:</strong> Begin your journey with Day One -
                  Moving the Pip
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">
                  Basic Flight Controls
                </h3>
                <p className="text-sm text-gray-400">
                  Master the fundamental controls for piloting spacecraft
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Navigation Systems</h3>
                <p className="text-sm text-gray-400">
                  Learn to navigate through space using various systems
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Ship Systems</h3>
                <p className="text-sm text-gray-400">
                  Understand various spacecraft systems and components
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-4 h-4 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white">Reference Materials</h3>
                <p className="text-sm text-gray-400">
                  Access comprehensive databases and star maps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg border border-red-600 p-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Ready to Begin?
          </h2>
          <p className="text-gray-300 mb-4">
            Start your pilot training with our foundational course.
          </p>
          <a
            href="/day-one-moving-the-pip"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Start Day One - Moving the Pip
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
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
