"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";

interface Ship {
  id: string;
  shipId: string;
  name: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Patch {
  id: string;
  version: string;
  name: string;
}

export default function SubmitBuildPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [ships, setShips] = useState<Ship[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [patches, setPatches] = useState<Patch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    buildName: "",
    shipId: "",
    categoryId: "",
    patchId: "",
    erkulUrl: "",
    description: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin?callbackUrl=/submit-build");
    }
  }, [session, status, router]);

  // Fetch available ships, categories, and patches
  useEffect(() => {
    Promise.all([
      fetch("/api/ships").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/patches").then((res) => res.json()),
    ])
      .then(([shipsData, categoriesData, patchesData]) => {
        setShips(shipsData);
        setCategories(categoriesData);
        setPatches(patchesData);
      })
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          creator: session?.user?.name || "Anonymous",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit build");
      }

      const build = await response.json();
      router.push(`/ship-builds/${build.ship.shipId}`);
    } catch (err) {
      setError("Failed to submit build. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">Submit Ship Build</h1>
          <p className="text-gray-300 mb-8">
            Share your ship build with the community. Your Discord username ({session.user.name}) will be credited as the creator.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Build Name */}
            <div>
              <label htmlFor="buildName" className="block text-sm font-medium text-gray-300 mb-2">
                Build Name *
              </label>
              <input
                type="text"
                id="buildName"
                required
                value={formData.buildName}
                onChange={(e) => setFormData({ ...formData, buildName: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
                placeholder="e.g., Meta Gladius, Stealth Arrow"
              />
            </div>

            {/* Ship Selection */}
            <div>
              <label htmlFor="shipId" className="block text-sm font-medium text-gray-300 mb-2">
                Ship *
              </label>
              <select
                id="shipId"
                required
                value={formData.shipId}
                onChange={(e) => setFormData({ ...formData, shipId: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Select a ship</option>
                {ships.map((ship) => (
                  <option key={ship.id} value={ship.id}>
                    {ship.name} - {ship.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Erkul URL */}
            <div>
              <label htmlFor="erkulUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Erkul Games URL *
              </label>
              <input
                type="url"
                id="erkulUrl"
                required
                value={formData.erkulUrl}
                onChange={(e) => setFormData({ ...formData, erkulUrl: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
                placeholder="https://www.erkul.games/loadout/..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Create your loadout on erkul.games and paste the share link here
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Patch Version */}
            <div>
              <label htmlFor="patchId" className="block text-sm font-medium text-gray-300 mb-2">
                Game Patch Version *
              </label>
              <select
                id="patchId"
                required
                value={formData.patchId}
                onChange={(e) => setFormData({ ...formData, patchId: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Select patch version</option>
                {patches.map((patch) => (
                  <option key={patch.id} value={patch.id}>
                    {patch.name || patch.version}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Build Description
              </label>
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
                placeholder="Describe your build strategy, strengths, weaknesses, and any special tactics... (optional)"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded-md p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Build"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}