import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import Image from "next/image";

interface Ship {
  id: string;
  name: string;
  category: string;
  imagePath: string;
  maxCrew: number;
}

const ships: Ship[] = [
  {
    id: "gladius",
    name: "Gladius",
    category: "Fighter",
    imagePath: "/images/gladius.png",
    maxCrew: 1,
  },
  {
    id: "arrow",
    name: "Arrow",
    category: "Fighter",
    imagePath: "/images/arrow.png",
    maxCrew: 1,
  },
  {
    id: "f8c-lightning",
    name: "F8C Lightning",
    category: "Fighter",
    imagePath: "/images/f8c.png",
    maxCrew: 1,
  },
  {
    id: "hornet-ghost",
    name: "F7C-M Hornet Ghost",
    category: "Fighter",
    imagePath: "/images/hornet-mkii-ghost.png",
    maxCrew: 1,
  },
  {
    id: "hornet-super",
    name: "F7C-M Hornet Super",
    category: "Fighter",
    imagePath: "/images/hornet-mkii-super.png",
    maxCrew: 1,
  },
  {
    id: "guardian-mx",
    name: "Guardian MX",
    category: "Multi-Role",
    imagePath: "/images/guardian-mx.png",
    maxCrew: 1,
  },
  {
    id: "guardian-qi",
    name: "Guardian QI",
    category: "Multi-Role",
    imagePath: "/images/guardian-qi.png",
    maxCrew: 1,
  },
];

export default function ShipBuildsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        {/* Ship Builds Overview */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-semibold text-white mb-3">
            <>Ship Builds</>
          </h1>
          <p className="text-gray-300 mb-4">
            <>
              Explore optimized ship builds for different roles and playstyles.
            </>
          </p>
        </div>

        {/* Ship Builds Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-6">
            {/* Add a Build Card */}
            <a
              href="https://github.com/spacesailor24/pilots.guide"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="bg-black rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 h-full p-4">
                <div className="h-full border-2 border-red-600 rounded-lg flex flex-col items-center justify-center p-8">
                  <div className="text-8xl text-red-600 group-hover:text-red-400 transition-colors mb-4">
                    +
                  </div>
                  <h3 className="text-xl font-bold text-red-600 group-hover:text-red-400 transition-colors">
                    Submit a Build
                  </h3>
                </div>
              </div>
            </a>

            {ships.map((ship, index) => (
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
                        priority={index < 3}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-xl text-gray-600 font-bold">
                          No Image
                        </div>
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
