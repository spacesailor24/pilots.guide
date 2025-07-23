import AppLayout from "@/components/AppLayout";
import IframeDisplay from "@/components/IframeDisplay";
import Link from "next/link";
import Image from "next/image";

interface ShipBuild {
  id: string;
  buildName: string;
  creator: string;
  thumbsUp: number;
  thumbsDown: number;
  erkulUrl: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
}

const gladiusBuilds: ShipBuild[] = [
  {
    id: "meta-gladius",
    buildName: "Meta Gladius",
    creator: "AcePilot_42",
    thumbsUp: 127,
    thumbsDown: 3,
    erkulUrl: "https://www.erkul.games/loadout/KXHBgPy1",
    difficulty: "Beginner",
    description:
      "A versatile light fighter build optimized for dogfighting and escort missions.",
  },
  {
    id: "stealth-gladius",
    buildName: "Stealth Gladius",
    creator: "Shadow_Pilot",
    thumbsUp: 98,
    thumbsDown: 5,
    erkulUrl: "https://www.erkul.games/loadout/example-stealth-gladius",
    difficulty: "Intermediate",
    description: "Stealth-focused build with electronic warfare capabilities.",
  },
  {
    id: "speed-gladius",
    buildName: "Speed Demon Gladius",
    creator: "Velocity_King",
    thumbsUp: 87,
    thumbsDown: 8,
    erkulUrl: "https://www.erkul.games/loadout/example-speed-gladius",
    difficulty: "Intermediate",
    description: "High-speed interceptor build for hit-and-run tactics.",
  },
  {
    id: "tank-gladius",
    buildName: "Tank Gladius",
    creator: "Iron_Pilot",
    thumbsUp: 76,
    thumbsDown: 12,
    erkulUrl: "https://www.erkul.games/loadout/example-tank-gladius",
    difficulty: "Advanced",
    description: "Heavy armor build sacrificing speed for survivability.",
  },
  {
    id: "newbie-gladius",
    buildName: "Newbie Friendly",
    creator: "Mentor_Pilot",
    thumbsUp: 65,
    thumbsDown: 2,
    erkulUrl: "https://www.erkul.games/loadout/example-newbie-gladius",
    difficulty: "Beginner",
    description: "Simple, forgiving build perfect for new pilots.",
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-600/20 text-green-400 border-green-600/30";
    case "Intermediate":
      return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30";
    case "Advanced":
      return "bg-red-600/20 text-red-400 border-red-600/30";
    default:
      return "bg-gray-600/20 text-gray-400 border-gray-600/30";
  }
};

export default function GladiusPage() {
  const topBuild = gladiusBuilds[0]; // Meta Gladius is already sorted first
  const otherBuilds = gladiusBuilds.slice(1);

  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">⚔️</span>
          <h1 className="text-3xl font-bold text-white">
            <>Gladius Builds</>
          </h1>
        </div>

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6">
          <Link
            href="/ship-builds"
            className="hover:text-red-400 transition-colors"
          >
            <>Ship Builds</>
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">
            <>Gladius</>
          </span>
        </nav>

        {/* Ship Overview */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <div className="flex items-start space-x-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src="/images/gladius.png"
                alt="Gladius"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                <>Gladius</>
              </h2>
              <p className="text-gray-300 mb-4">
                <>
                  A versatile light fighter known for its agility and balanced
                  performance. Perfect for new pilots and experienced
                  dogfighters alike.
                </>
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">
                    <>Category:</>
                  </span>
                  <span className="text-white ml-2">
                    <>Fighter</>
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">
                    <>Max Crew:</>
                  </span>
                  <span className="text-white ml-2">
                    <>1</>
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">
                    <>Difficulty:</>
                  </span>
                  <span className="text-white ml-2">
                    <>Beginner</>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Build */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              <>Top Rated Build</>
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">👍 {topBuild.thumbsUp}</span>
              <span className="text-red-400">👎 {topBuild.thumbsDown}</span>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {topBuild.buildName}
                </h3>
                <p className="text-gray-300 mb-2">{topBuild.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">
                    <>by {topBuild.creator}</>
                  </span>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      topBuild.difficulty
                    )}`}
                  >
                    {topBuild.difficulty}
                  </div>
                </div>
              </div>
            </div>

            {/* Erkul Loadout */}
            <IframeDisplay
              src={topBuild.erkulUrl}
              title={`${topBuild.buildName} Loadout`}
              height="600px"
              className="mb-4"
            />
          </div>
        </div>

        {/* Other Builds Carousel */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            <>Other Builds</>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherBuilds.map((build) => (
              <div
                key={build.id}
                className="bg-zinc-900 rounded-lg border border-red-600 p-4 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">
                    {build.buildName}
                  </h3>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      build.difficulty
                    )}`}
                  >
                    {build.difficulty}
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {build.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    <>by {build.creator}</>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">👍 {build.thumbsUp}</span>
                    <span className="text-red-400">👎 {build.thumbsDown}</span>
                  </div>
                </div>

                <button className="w-full mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                  <>View Build</>
                </button>
              </div>
            ))}
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
              <>Back to Ships</>
            </Link>
            <Link
              href="/ship-builds/arrow"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              <>Next Ship</>
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
