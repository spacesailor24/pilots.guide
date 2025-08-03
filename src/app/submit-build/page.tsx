"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
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

  // No redirect needed - show sign in screen inline

  // Fetch available ships, categories, and patches
  useEffect(() => {
    Promise.all([
      fetch("/api/ships").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
      fetch("/api/patches").then((res) => res.json()),
    ])
      .then(([shipsData, categoriesData, patchesData]) => {
        setShips(Array.isArray(shipsData) ? shipsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setPatches(Array.isArray(patchesData) ? patchesData : []);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setShips([]);
        setCategories([]);
        setPatches([]);
      });
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
    return (
      <AppLayout>
        <div className="max-w-md mx-auto mt-16">
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
              Authenticate with Discord
            </h1>
            <p className="text-gray-300 mb-8 text-center">
              Sign in with your Discord account to submit ship builds to the
              community.
            </p>
            <button
              onClick={() =>
                signIn("discord", { callbackUrl: "/submit-build" })
              }
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              Sign in with Discord
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">
            Submit Ship Build
          </h1>
          <p className="text-gray-300 mb-8">
            Share your ship build with the community. Your Discord username (
            {session.user.name}) will be credited as the creator.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Build Name */}
            <div>
              <label
                htmlFor="buildName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Build Name *
              </label>
              <input
                type="text"
                id="buildName"
                required
                value={formData.buildName}
                onChange={(e) =>
                  setFormData({ ...formData, buildName: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
                placeholder="e.g., Meta Gladius, Stealth Arrow"
              />
            </div>

            {/* Ship Selection */}
            <div>
              <label
                htmlFor="shipId"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Ship *
              </label>
              <select
                id="shipId"
                required
                value={formData.shipId}
                onChange={(e) =>
                  setFormData({ ...formData, shipId: e.target.value })
                }
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
              <label
                htmlFor="erkulUrl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Erkul Games URL *
              </label>
              <input
                type="url"
                id="erkulUrl"
                required
                value={formData.erkulUrl}
                onChange={(e) =>
                  setFormData({ ...formData, erkulUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-md text-white focus:border-red-500 focus:outline-none"
                placeholder="https://www.erkul.games/loadout/..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Create your loadout on erkul.games and paste the share link here
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Category *
              </label>
              <select
                id="categoryId"
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
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
              <label
                htmlFor="patchId"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Game Patch Version *
              </label>
              <select
                id="patchId"
                required
                value={formData.patchId}
                onChange={(e) =>
                  setFormData({ ...formData, patchId: e.target.value })
                }
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Build Description
              </label>
              <textarea
                id="description"
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
