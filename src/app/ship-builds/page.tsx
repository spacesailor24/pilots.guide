import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import Image from "next/image";

interface ShipBuild {
  id: string;
  name: string;
  ship: string;
  buildName: string;
  description: string;
  erkulUrl: string;
  icon: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imagePath?: string;
  maxCrew: number;
  creator: string;
  thumbsUp: number;
  thumbsDown: number;
}

interface Ship {
  id: string;
  name: string;
  category: string;
  imagePath: string;
  maxCrew: number;
  bestBuild: {
    buildName: string;
    creator: string;
    thumbsUp: number;
    thumbsDown: number;
    erkulUrl: string;
  };
}

const ships: Ship[] = [
  {
    id: "gladius",
    name: "Gladius",
    category: "Fighter",
    imagePath: "/images/gladius.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Meta Gladius",
      creator: "AcePilot_42",
      thumbsUp: 127,
      thumbsDown: 3,
      erkulUrl: "https://www.erkul.games/loadout/KXHBgPy1",
    },
  },
  {
    id: "arrow",
    name: "Arrow",
    category: "Fighter",
    imagePath: "/images/arrow.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Speed Demon",
      creator: "Interceptor_Pro",
      thumbsUp: 89,
      thumbsDown: 7,
      erkulUrl: "https://www.erkul.games/loadout/example-arrow",
    },
  },
  {
    id: "f8c-lightning",
    name: "F8C Lightning",
    category: "Fighter",
    imagePath: "/images/f8c.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Thunder Strike",
      creator: "Lightning_Strike",
      thumbsUp: 203,
      thumbsDown: 12,
      erkulUrl: "https://www.erkul.games/loadout/example-f8c",
    },
  },
  {
    id: "hornet-ghost",
    name: "F7C-M Hornet Ghost",
    category: "Fighter",
    imagePath: "/images/hornet-mkii-ghost.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Stealth Hornet",
      creator: "Ghost_Operator",
      thumbsUp: 156,
      thumbsDown: 8,
      erkulUrl: "https://www.erkul.games/loadout/example-hornet-ghost",
    },
  },
  {
    id: "hornet-super",
    name: "F7C-M Hornet Super",
    category: "Fighter",
    imagePath: "/images/hornet-mkii-super.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Super Hornet Elite",
      creator: "Super_Hornet_Ace",
      thumbsUp: 134,
      thumbsDown: 5,
      erkulUrl: "https://www.erkul.games/loadout/example-hornet-super",
    },
  },
  {
    id: "guardian-mx",
    name: "Guardian MX",
    category: "Multi-Role",
    imagePath: "/images/guardian-mx.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Guardian Defender",
      creator: "Guardian_Master",
      thumbsUp: 98,
      thumbsDown: 4,
      erkulUrl: "https://www.erkul.games/loadout/example-guardian-mx",
    },
  },
  {
    id: "guardian-qi",
    name: "Guardian QI",
    category: "Multi-Role",
    imagePath: "/images/guardian-qi.png",
    maxCrew: 1,
    bestBuild: {
      buildName: "Quantum Guardian",
      creator: "Quantum_Pilot",
      thumbsUp: 178,
      thumbsDown: 15,
      erkulUrl: "https://www.erkul.games/loadout/example-guardian-qi",
    },
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

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Fighter":
      return "bg-red-600/20 text-red-400 border-red-600/30";
    case "Multi-Role":
      return "bg-blue-600/20 text-blue-400 border-blue-600/30";
    case "Explorer":
      return "bg-purple-600/20 text-purple-400 border-purple-600/30";
    case "Freighter":
      return "bg-green-600/20 text-green-400 border-green-600/30";
    default:
      return "bg-gray-600/20 text-gray-400 border-gray-600/30";
  }
};

export default function ShipBuildsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🚀</span>
          <h1 className="text-3xl font-bold text-white">
            Ship Builds Overview
          </h1>
        </div>
        <p className="text-lg text-gray-300 leading-relaxed mb-6">
          Explore optimized ship builds for different roles and playstyles. Each
          build is carefully crafted for maximum effectiveness.
        </p>

        {/* Build Categories */}
        {/* <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Build Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚔️</div>
              <h3 className="font-medium text-red-400">Fighters</h3>
              <p className="text-sm text-gray-400">Combat-focused builds</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-medium text-blue-400">Multi-Role</h3>
              <p className="text-sm text-gray-400">Versatile builds</p>
            </div>
            <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🌟</div>
              <h3 className="font-medium text-purple-400">Explorers</h3>
              <p className="text-sm text-gray-400">Long-range builds</p>
            </div>
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-medium text-green-400">Freighters</h3>
              <p className="text-sm text-gray-400">Cargo-focused builds</p>
            </div>
          </div>
        </div> */}

        {/* Ship Builds Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Available Builds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ships.map((ship) => (
              <Link
                key={ship.id}
                href={`/ship-builds/${ship.id}`}
                className="group block"
              >
                <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  {/* Top Section - Ship Image */}
                  <div className="relative h-48 bg-gradient-to-br from-red-900/20 to-black">
                    {ship.imagePath ? (
                      <Image
                        src={ship.imagePath}
                        alt={ship.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl text-gray-600">🚀</div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section - Ship Info */}
                  <div className="bg-gradient-to-r from-blue-900/80 to-teal-900/80 p-4">
                    {/* Ship Name */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {ship.name}
                    </h3>

                    {/* Ship Type and Crew */}
                    <div className="flex items-center text-white text-sm">
                      <div className="flex items-center">
                        <span>{ship.category}</span>
                      </div>
                      <span className="mx-2">/</span>
                      <div className="flex items-center">
                        <span>Max crew: {ship.maxCrew}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
