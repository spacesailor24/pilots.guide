import AppLayout from "@/components/AppLayout";
import Image from "next/image";
import SubmitBuildCard from "@/components/SubmitBuildCard";
import LinkWithTransition from "@/components/LinkWithTransition";
import { prisma } from "@/lib/prisma";

interface Ship {
  id: string;
  shipId: string;
  name: string;
  category: string;
  imagePath: string | null;
  maxCrew: number;
  _count: {
    builds: number;
  };
}

async function getShipsWithBuilds(): Promise<Ship[]> {
  try {
    const ships = await prisma.ship.findMany({
      where: {
        builds: {
          some: {},
        },
      },
      include: {
        _count: {
          select: {
            builds: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return ships;
  } catch (error) {
    console.error("Failed to fetch ships with builds:", error);
    return [];
  }
}

export default async function ShipBuildsPage() {
  const ships = await getShipsWithBuilds();
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
            <SubmitBuildCard />

            {ships.map((ship, index) => (
              <LinkWithTransition
                key={ship.id}
                href={`/ship-builds/${ship.shipId}`}
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
                  <div className="bg-gradient-to-r to-red-900/80 from-black p-4">
                    {/* Ship Name */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {ship.name}
                    </h3>

                    {/* Ship Type, Crew, and Build Count */}
                    <div className="flex items-center text-white text-sm">
                      <div className="flex items-center">
                        <span>{ship.category}</span>
                      </div>
                      <span className="mx-2">/</span>
                      <div className="flex items-center">
                        <span>Max crew: {ship.maxCrew}</span>
                      </div>
                      <span className="mx-2">/</span>
                      <div className="flex items-center">
                        <span>{ship._count.builds} builds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </LinkWithTransition>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
