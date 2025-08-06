"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import AppLayout from "@/components/AppLayout";

interface RankedPlayer {
  userId: string;
  displayName: string;
  image: string | null;
  claimed: boolean;
  mu: number;
  sigma: number;
  gamesPlayed: number;
  ordinal: number;
  conservativeRating: number;
  lastUpdated: string;
  rank: number;
}

interface RankingsResponse {
  players: RankedPlayer[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: {
    minGames: number;
  };
}

export default function RankingsPage() {
  const { data: session } = useSession();
  const [rankings, setRankings] = useState<RankingsResponse | null>(null);
  
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minGames, setMinGames] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 25;

  // Fetch rankings data
  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const offset = (currentPage - 1) * playersPerPage;
        const response = await fetch(
          `/api/players/rankings?limit=${playersPerPage}&offset=${offset}&minGames=${minGames}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch rankings");
        }
        
        const data = await response.json();
        setRankings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [currentPage, minGames]);

  // Rankings skeleton component
  const RankingsSkeleton = () => (
    <div className="space-y-4">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="bg-zinc-800 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-zinc-700 rounded animate-pulse"></div>
            <div className="w-12 h-12 bg-zinc-700 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-700 rounded animate-pulse w-48"></div>
              <div className="h-3 bg-zinc-700 rounded animate-pulse w-32"></div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-zinc-700 rounded animate-pulse w-16"></div>
              <div className="h-3 bg-zinc-700 rounded animate-pulse w-20"></div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 bg-zinc-700 rounded animate-pulse w-12"></div>
              <div className="h-3 bg-zinc-700 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
            <div className="h-10 bg-zinc-800 rounded animate-pulse w-64 mb-4"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-96"></div>
          </div>
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
            <RankingsSkeleton />
          </div>
        </div>
      </AppLayout>
    );
  }


  if (error) {
    return (
      <AppLayout>
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-red-400 mb-2">Error</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </AppLayout>
    );
  }

  const totalPages = rankings ? Math.ceil(rankings.pagination.total / playersPerPage) : 1;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h1 className="text-4xl font-semibold text-white mb-4">Player Rankings</h1>
          <p className="text-gray-400">
            Global leaderboard based on OpenSkill rating system. Rankings are updated after each match.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-white font-medium">Minimum Games:</label>
              <select
                value={minGames}
                onChange={(e) => {
                  setMinGames(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-zinc-800 border border-red-600/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={0}>All Players</option>
                <option value={1}>1+ Games</option>
                <option value={3}>3+ Games</option>
                <option value={5}>5+ Games</option>
                <option value={10}>10+ Games</option>
              </select>
            </div>
            
            {rankings && (
              <div className="text-gray-400 text-sm">
                Showing {rankings.players.length} of {rankings.pagination.total} players
              </div>
            )}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          {rankings && rankings.players.length > 0 ? (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-right">Rating</div>
                <div className="col-span-2 text-right">Conservative</div>
                <div className="col-span-2 text-right">Games</div>
                <div className="col-span-1 text-center">Uncertainty</div>
              </div>

              {/* Player Rows */}
              {rankings.players.map((player) => (
                <div
                  key={player.userId}
                  className="grid grid-cols-12 gap-4 py-3 hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <div className={`text-lg font-bold ${
                      player.rank === 1 ? "text-yellow-400" :
                      player.rank === 2 ? "text-gray-300" :
                      player.rank === 3 ? "text-amber-600" :
                      "text-white"
                    }`}>
                      #{player.rank}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="col-span-4 flex items-center space-x-3">
                    {player.claimed && player.image ? (
                      <Image
                        src={player.image}
                        alt={player.displayName || "Player"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        player.claimed ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        <span className="text-sm font-medium text-white">
                          {player.displayName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-white">{player.displayName}</h3>
                      {isAdmin && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          player.claimed 
                            ? "bg-green-900/20 text-green-400"
                            : "bg-orange-900/20 text-orange-400"
                        }`}>
                          {player.claimed ? "Claimed" : "Unclaimed"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ordinal Rating */}
                  <div className="col-span-2 text-right">
                    <div className="text-lg font-semibold text-white">
                      {player.ordinal.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">
                      μ={player.mu.toFixed(1)} σ={player.sigma.toFixed(1)}
                    </div>
                  </div>

                  {/* Conservative Rating */}
                  <div className="col-span-2 text-right">
                    <div className="text-lg font-medium text-gray-300">
                      {player.conservativeRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">99.7% CI</div>
                  </div>

                  {/* Games Played */}
                  <div className="col-span-2 text-right">
                    <div className="text-lg font-medium text-white">
                      {player.gamesPlayed}
                    </div>
                    <div className="text-xs text-gray-400">matches</div>
                  </div>

                  {/* Uncertainty */}
                  <div className="col-span-1 flex justify-center">
                    <div className={`w-3 h-3 rounded-full ${
                      player.sigma < 4 ? "bg-green-500" :
                      player.sigma < 6 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`} title={`Uncertainty: ${player.sigma.toFixed(2)}`}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No players found with the current filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {rankings && totalPages > 1 && (
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-md transition-colors ${
                        currentPage === pageNum
                          ? "bg-red-600 text-white"
                          : "bg-zinc-700 text-white hover:bg-zinc-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-400 mt-4">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}

        {/* Rating System Info */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">About the Rating System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-medium text-white mb-2">OpenSkill Rating</h3>
              <ul className="space-y-1">
                <li><strong>Rating:</strong> Current skill estimate (ordinal)</li>
                <li><strong>Conservative:</strong> 99.7% confidence lower bound</li>
                <li><strong>μ (Mu):</strong> Mean skill level</li>
                <li><strong>σ (Sigma):</strong> Uncertainty in skill level</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Uncertainty Indicator</h3>
              <ul className="space-y-1">
                <li><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>Low uncertainty (σ &lt; 4)</li>
                <li><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Medium uncertainty (σ 4-6)</li>
                <li><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>High uncertainty (σ &gt; 6)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}