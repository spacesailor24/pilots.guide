"use client";

import { useState } from "react";
import Image from "next/image";
import IframeDisplay from "@/components/IframeDisplay";

interface Build {
  id: string;
  buildName: string;
  creator: string;
  erkulUrl: string;
  description: string | null;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  patch: {
    id: string;
    version: string;
    name: string | null;
  };
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface Ship {
  id: string;
  shipId: string;
  name: string;
  category: string;
  imagePath: string | null;
  maxCrew: number;
  builds: Build[];
}

export default function ShipBuildClient({ ship }: { ship: Ship }) {
  const featuredBuild = ship.builds.find(build => build.featured);
  const initialBuild = featuredBuild || ship.builds[0];
  const [selectedBuild, setSelectedBuild] = useState<Build>(initialBuild);
  
  const otherBuilds = ship.builds.filter(build => build.id !== selectedBuild.id);

  return (
    <div className="mb-8">
      {/* Ship Overview */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
        <div className="flex items-start space-x-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={ship.imagePath || "/images/default-ship.png"}
              alt={ship.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {ship.name}
            </h2>
            <p className="text-gray-300 mb-4">
              A versatile {ship.category.toLowerCase()} known for its performance and capabilities.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2">{ship.category}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400">Max Crew:</span>
                <span className="text-white ml-2">{ship.maxCrew}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Build Display */}
      <div className="mb-8">
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">
                  {selectedBuild.buildName}
                </h3>
                {selectedBuild.featured && (
                  <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs font-medium">
                    FEATURED
                  </span>
                )}
              </div>
              {selectedBuild.description && (
                <p className="text-gray-300 mb-2">{selectedBuild.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-400">
                  by {selectedBuild.user?.name || selectedBuild.creator}
                </span>
                <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
                  {selectedBuild.category.name}
                </span>
                <span className="text-gray-500 text-xs">
                  {selectedBuild.patch.name || selectedBuild.patch.version}
                </span>
              </div>
            </div>
          </div>

          {/* Erkul Loadout */}
          <IframeDisplay
            src={selectedBuild.erkulUrl}
            title={`${selectedBuild.buildName} Loadout`}
          />
        </div>
      </div>

      {/* Other Builds */}
      {otherBuilds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Other Builds</h2>
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
                  {build.featured && (
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs font-medium">
                      FEATURED
                    </span>
                  )}
                </div>

                {build.description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {build.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-gray-400">
                    by {build.user?.name || build.creator}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded">
                      {build.category.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBuild(build)}
                  className="w-full block text-center mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  View Build
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}