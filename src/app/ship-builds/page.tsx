import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import Image from "next/image";

interface ShipBuild {
  id: string;
  name: string;
  ship: string;
  description: string;
  erkulUrl: string;
  icon: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imagePath?: string;
  maxCrew: number;
}

const shipBuilds: ShipBuild[] = [
  {
    id: "gladius-fighter",
    name: "Gladius Fighter",
    ship: "Gladius",
    description:
      "A versatile light fighter build optimized for dogfighting and escort missions.",
    erkulUrl: "https://www.erkul.games/loadout/KXHBgPy1",
    icon: "⚔️",
    category: "Fighter",
    difficulty: "Beginner",
    imagePath: "/images/gladius.png",
    maxCrew: 1,
  },
  {
    id: "arrow-interceptor",
    name: "Arrow Interceptor",
    ship: "Arrow",
    description:
      "High-speed interceptor build designed for hit-and-run tactics.",
    erkulUrl: "https://www.erkul.games/loadout/example-arrow",
    icon: "🏹",
    category: "Fighter",
    difficulty: "Intermediate",
    imagePath: "/images/arrow.png",
    maxCrew: 1,
  },
  {
    id: "f8c-lightning",
    name: "F8C Lightning",
    ship: "F8C Lightning",
    description:
      "Heavy fighter with exceptional firepower and durability for experienced pilots.",
    erkulUrl: "https://www.erkul.games/loadout/example-f8c",
    icon: "⚡",
    category: "Fighter",
    difficulty: "Advanced",
    imagePath: "/images/f8c.png",
    maxCrew: 1,
  },
  {
    id: "hornet-ghost",
    name: "Hornet Ghost",
    ship: "F7C-M Hornet Ghost",
    description:
      "Stealth-focused fighter with advanced electronic warfare capabilities.",
    erkulUrl: "https://www.erkul.games/loadout/example-hornet-ghost",
    icon: "👻",
    category: "Fighter",
    difficulty: "Advanced",
    imagePath: "/images/hornet-mkii-ghost.png",
    maxCrew: 1,
  },
  {
    id: "hornet-super",
    name: "Hornet Super",
    ship: "F7C-M Hornet Super",
    description:
      "Heavy fighter variant with enhanced firepower and superior combat capabilities.",
    erkulUrl: "https://www.erkul.games/loadout/example-hornet-super",
    icon: "🦅",
    category: "Fighter",
    difficulty: "Intermediate",
    imagePath: "/images/hornet-mkii-super.png",
    maxCrew: 1,
  },
  {
    id: "guardian-mx",
    name: "Guardian MX",
    ship: "Guardian MX",
    description:
      "Multi-role fighter with balanced combat and utility capabilities.",
    erkulUrl: "https://www.erkul.games/loadout/example-guardian-mx",
    icon: "🛡️",
    category: "Multi-Role",
    difficulty: "Intermediate",
    imagePath: "/images/guardian-mx.png",
    maxCrew: 1,
  },
  {
    id: "guardian-qi",
    name: "Guardian QI",
    ship: "Guardian QI",
    description:
      "Advanced multi-role fighter with quantum interference technology.",
    erkulUrl: "https://www.erkul.games/loadout/example-guardian-qi",
    icon: "🔮",
    category: "Multi-Role",
    difficulty: "Advanced",
    imagePath: "/images/guardian-qi.png",
    maxCrew: 1,
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
            {shipBuilds.map((build) => (
              <Link
                key={build.id}
                href={`/ship-builds/${build.id}`}
                className="group block"
              >
                <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  {/* Top Section - Ship Image */}
                  <div className="relative h-48 bg-gradient-to-br from-red-900/20 to-black">
                    {build.imagePath ? (
                      <Image
                        src={build.imagePath}
                        alt={build.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl text-gray-600">
                          {build.icon}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Section - Ship Info */}
                  <div className="bg-gradient-to-r from-blue-900/80 to-teal-900/80 p-4">
                    {/* Ship Type and Crew */}
                    <div className="flex items-center text-white text-sm mb-2">
                      <div className="flex items-center">
                        <span className="mr-2">🚀</span>
                        <span>{build.category}</span>
                      </div>
                      <span className="mx-2">/</span>
                      <div className="flex items-center">
                        <span className="mr-2">👤</span>
                        <span>Max crew: {build.maxCrew}</span>
                      </div>
                    </div>

                    {/* Ship Name */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                      {build.ship}
                    </h3>
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
