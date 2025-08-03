import AppLayout from "@/components/AppLayout";
import IframeDisplay from "@/components/IframeDisplay";
import Image from "next/image";

interface ShipBuild {
  id: string;
  buildName: string;
  creator: string;
  erkulUrl: string;
  description: string;
}

const gladiusBuilds: ShipBuild[] = [
  {
    id: "meta-gladius",
    buildName: "Meta Gladius",
    creator: "AcePilot_42",
    erkulUrl: "https://www.erkul.games/loadout/KXHBgPy1",
    description:
      "A versatile light fighter build optimized for dogfighting and escort missions.",
  },
  {
    id: "stealth-gladius",
    buildName: "Stealth Gladius",
    creator: "Shadow_Pilot",
    erkulUrl: "https://www.erkul.games/loadout/example-stealth-gladius",
    description: "Stealth-focused build with electronic warfare capabilities.",
  },
  {
    id: "speed-gladius",
    buildName: "Speed Demon Gladius",
    creator: "Velocity_King",
    erkulUrl: "https://www.erkul.games/loadout/example-speed-gladius",
    description: "High-speed interceptor build for hit-and-run tactics.",
  },
  {
    id: "tank-gladius",
    buildName: "Tank Gladius",
    creator: "Iron_Pilot",
    erkulUrl: "https://www.erkul.games/loadout/example-tank-gladius",
    description: "Heavy armor build sacrificing speed for survivability.",
  },
];

export default function GladiusPage() {
  const topBuild = gladiusBuilds[0];
  const otherBuilds = gladiusBuilds.slice(1);

  return (
    <AppLayout>
      <div className="mb-8">
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
              <div className="flex gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-400">
                    <>Category:</>
                  </span>
                  <span className="text-white ml-2">
                    <>Fighter</>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400">
                    <>Max Crew:</>
                  </span>
                  <span className="text-white ml-2">
                    <>1</>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Build */}
        <div className="mb-8">
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
                </div>
              </div>
            </div>

            {/* Erkul Loadout */}
            <IframeDisplay
              src={topBuild.erkulUrl}
              title={`${topBuild.buildName} Loadout`}
            />
          </div>
        </div>

        {/* Other Builds Carousel */}
        <div className="mb-8">
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
                </div>

                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {build.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    <>by {build.creator}</>
                  </span>
                </div>

                <button className="w-full mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                  <>View Build</>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
