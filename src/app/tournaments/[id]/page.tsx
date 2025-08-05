"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { useTournaments } from "@/contexts/TournamentsContext";

interface TournamentPlayer {
  id: string;
  user: {
    id: string;
    username: string | null;
    displayName: string | null;
    image: string | null;
    claimed: boolean;
  };
}

interface MatchTeam {
  id: string;
  name: string;
  placement: number | null;
  players: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      username: string | null;
      displayName: string | null;
      image: string | null;
      claimed: boolean;
    };
  }>;
}

interface Tournament {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  creator: {
    id: string;
    username: string | null;
    displayName: string | null;
    image: string | null;
  };
  players: TournamentPlayer[];
  matches?: Array<{
    id: string;
    name: string;
    startTime: string;
    endTime: string | null;
    teams: MatchTeam[];
    rounds: Array<{
      id: string;
      roundNumber: number;
      startTime: string;
      endTime: string | null;
      winnerId: string | null;
    }>;
  }>;
}

export default function TournamentViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { activeTournaments, completedTournaments } = useTournaments();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingMatch, setGeneratingMatch] = useState(false);
  const [showMatchmakingOptions, setShowMatchmakingOptions] = useState(false);
  const [matchmakingOptions, setMatchmakingOptions] = useState({
    teamSize: 1,
    teamsPerMatch: 2,
    entropyLevel: 0.3,
    maxSkillGap: 5.0,
    avoidRecentOpponents: true,
    recentMatchLookback: 3
  });
  const [currentTournamentId, setCurrentTournamentId] = useState<string | null>(null);
  const [showResultsModal, setShowResultsModal] = useState<string | null>(null);
  const [submittingResults, setSubmittingResults] = useState(false);

  // Skeleton Loading Component
  const TournamentSkeleton = () => (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 bg-zinc-800 rounded animate-pulse w-80"></div>
          <div className="h-6 bg-zinc-800 rounded-full animate-pulse w-20"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-24"></div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="h-4 bg-zinc-800 rounded animate-pulse w-32"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-40"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-20"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-36"></div>
          </div>
        </div>
      </div>

      {/* Players Skeleton */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
        <div className="h-8 bg-zinc-800 rounded animate-pulse w-32 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-zinc-700 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-700 rounded animate-pulse w-24"></div>
                  <div className="h-3 bg-zinc-700 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matches Skeleton */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-zinc-800 rounded animate-pulse w-24"></div>
          <div className="h-10 bg-zinc-800 rounded animate-pulse w-40"></div>
        </div>
        <div className="text-center py-8">
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-48 mx-auto mb-4"></div>
          <div className="h-3 bg-zinc-800 rounded animate-pulse w-80 mx-auto"></div>
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
        <div className="h-8 bg-zinc-800 rounded animate-pulse w-24 mb-4"></div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-40"></div>
                <div className="h-3 bg-zinc-800 rounded animate-pulse w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Redirect if not admin
  useEffect(() => {
    if (status !== "loading" && (!session?.user?.isAdmin)) {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch tournament data
  useEffect(() => {
    const fetchTournament = async () => {
      if (!session?.user?.isAdmin) return;

      const { id } = await params;
      
      // If we're already showing this tournament, don't refetch
      if (currentTournamentId === id && tournament && tournament.id === id) {
        return;
      }
      
      // Clear tournament data when switching to ensure skeleton shows during navigation
      if (currentTournamentId !== id) {
        setTournament(null);
        setLoading(true);
      }
      
      // Set the new tournament ID we're loading
      setCurrentTournamentId(id);
      setError(null);
      
      // First check if tournament exists in context to avoid loading flash
      const contextTournament = [...activeTournaments, ...completedTournaments].find(t => t.id === id);
      
      if (contextTournament) {
        // Use tournament from context immediately - no loading flash
        setTournament(contextTournament as Tournament);
        setLoading(false);
        
        // Fetch full details in background to ensure we have all data
        try {
          const response = await fetch(`/api/tournaments/${id}`);
          if (response.ok) {
            const tournamentData = await response.json();
            setTournament(tournamentData);
          }
        } catch (err) {
          // Silently fail if we already have data from context
          console.error("Failed to fetch full tournament details:", err);
        }
      } else {
        // No tournament in context, show loading and fetch from API
        setLoading(true);
        try {
          const response = await fetch(`/api/tournaments/${id}`);
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Tournament not found");
            }
            throw new Error("Failed to fetch tournament");
          }
          const tournamentData = await response.json();
          setTournament(tournamentData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTournament();
  }, [params, session?.user?.isAdmin, activeTournaments, completedTournaments]);

  // Show skeleton loading while checking auth or loading tournament data
  if (status === "loading" || (loading && !tournament)) {
    return (
      <AppLayout>
        <TournamentSkeleton />
      </AppLayout>
    );
  }

  // Also show skeleton if we have tournament but it's not the right one (during navigation)
  if (tournament && currentTournamentId && tournament.id !== currentTournamentId) {
    return (
      <AppLayout>
        <TournamentSkeleton />
      </AppLayout>
    );
  }

  // Return null while redirecting if not admin
  if (!session?.user?.isAdmin) {
    return null;
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

  if (!tournament) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-400">Tournament not found</p>
        </div>
      </AppLayout>
    );
  }

  const startDate = new Date(tournament.startTime);
  const endDate = tournament.endTime ? new Date(tournament.endTime) : null;
  const now = new Date();
  const isActive = !endDate || endDate > now;

  const handleGenerateNextMatch = async () => {
    if (!tournament || generatingMatch) return;

    setGeneratingMatch(true);
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchmakingOptions),
      });

      if (response.ok) {
        // Refresh tournament data to show the new match
        const tournamentResponse = await fetch(`/api/tournaments/${tournament.id}`);
        if (tournamentResponse.ok) {
          const updatedTournament = await tournamentResponse.json();
          setTournament(updatedTournament);
        }
      } else {
        const error = await response.json();
        alert(`Failed to generate match: ${error.error}`);
      }
    } catch (error) {
      console.error("Error generating match:", error);
      alert("Failed to generate match. Please try again.");
    } finally {
      setGeneratingMatch(false);
    }
  };

  const handleSubmitResults = async (matchId: string, winningTeamId: string) => {
    setSubmittingResults(true);
    try {
      const response = await fetch(`/api/tournaments/${tournament?.id}/matches/${matchId}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winningTeamId }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Match results submitted successfully! Updated ${result.updatedRatings.length} player ratings.`);
        setShowResultsModal(null);
        
        // Refresh tournament data to show updated match status
        const tournamentResponse = await fetch(`/api/tournaments/${tournament?.id}`);
        if (tournamentResponse.ok) {
          const updatedTournament = await tournamentResponse.json();
          setTournament(updatedTournament);
        }
      } else {
        const error = await response.json();
        alert(`Failed to submit results: ${error.error}`);
      }
    } catch (error) {
      console.error("Error submitting results:", error);
      alert("Failed to submit results. Please try again.");
    } finally {
      setSubmittingResults(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-semibold text-white">
              {tournament.name}
            </h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive 
                ? "bg-green-900/20 text-green-400 border border-green-600/30"
                : "bg-gray-900/20 text-gray-400 border border-gray-600/30"
            }`}>
              {isActive ? "Active" : "Completed"}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Created by:</span>
              <div className="flex items-center space-x-2 mt-1">
                {tournament.creator.image ? (
                  <img
                    src={tournament.creator.image}
                    alt={tournament.creator.displayName || "Creator"}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {(tournament.creator.displayName || tournament.creator.username)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-white">
                  {tournament.creator.displayName || tournament.creator.username}
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-gray-400">Start Time:</span>
              <p className="text-white mt-1">
                {startDate.toLocaleString()}
              </p>
            </div>
            
            <div>
              <span className="text-gray-400">End Time:</span>
              <p className="text-white mt-1">
                {endDate ? endDate.toLocaleString() : "No end time set"}
              </p>
            </div>
          </div>
        </div>

        {/* Players */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Players ({tournament.players.length})
          </h2>
          
          {tournament.players.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No players in this tournament
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tournament.players.map((player) => (
                <div
                  key={player.id}
                  className="bg-zinc-800 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    {player.user.claimed && player.user.image ? (
                      <img
                        src={player.user.image}
                        alt={player.user.displayName || "Player"}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        player.user.claimed ? 'bg-green-600' : 'bg-gray-600'
                      }`}>
                        <span className="text-sm font-medium text-white">
                          {player.user.displayName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {player.user.displayName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className={`text-xs px-2 py-1 rounded ${
                          player.user.claimed 
                            ? "bg-green-900/20 text-green-400"
                            : "bg-orange-900/20 text-orange-400"
                        }`}>
                          {player.user.claimed ? "Claimed" : "Unclaimed"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tournament Matches */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">
              Matches {tournament.matches && tournament.matches.length > 0 && `(${tournament.matches.length})`}
            </h2>
            {/* Only show Generate Match button for active tournaments and if user is the creator */}
            {isActive && (session?.user as any)?.id === tournament.creator.id && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGenerateNextMatch}
                  disabled={generatingMatch}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generatingMatch ? "Generating..." : "Generate Next Match"}
                </button>
                <button
                  onClick={() => setShowMatchmakingOptions(!showMatchmakingOptions)}
                  className="px-3 py-2 bg-zinc-700 text-white text-sm rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors"
                >
                  ⚙️ Options
                </button>
              </div>
            )}
          </div>
          
          {tournament.matches && tournament.matches.length > 0 ? (
            <div className="space-y-4">
              {tournament.matches.map((match) => {
                const matchStartDate = new Date(match.startTime);
                const matchEndDate = match.endTime ? new Date(match.endTime) : null;
                const matchIsActive = !matchEndDate || matchEndDate > new Date();
                
                return (
                  <div key={match.id} className="bg-zinc-800 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{match.name}</h3>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          matchIsActive 
                            ? "bg-green-900/20 text-green-400 border border-green-600/30"
                            : "bg-gray-900/20 text-gray-400 border border-gray-600/30"
                        }`}>
                          {matchIsActive ? "Active" : "Completed"}
                        </div>
                        {/* Submit Results button - only show for active matches without results and tournament creator */}
                        {matchIsActive && 
                         (session?.user as any)?.id === tournament.creator.id && 
                         match.teams && 
                         !match.teams.some(team => team.placement !== null) && (
                          <button
                            onClick={() => setShowResultsModal(match.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          >
                            Submit Results
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-3">
                      <span>Start: {matchStartDate.toLocaleString()}</span>
                      {matchEndDate && (
                        <span className="ml-4">End: {matchEndDate.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Display Teams */}
                    {match.teams && match.teams.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Teams</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {match.teams.map((team) => (
                            <div key={team.id} className={`bg-zinc-700 rounded-lg p-3 border ${
                              team.placement === 1 ? "border-yellow-500/50 bg-yellow-900/10" :
                              team.placement === 2 ? "border-gray-400/50 bg-gray-900/10" :
                              "border-zinc-600"
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-white font-medium">{team.name}</h5>
                                {team.placement && (
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    team.placement === 1 ? "bg-yellow-500/20 text-yellow-300" :
                                    team.placement === 2 ? "bg-gray-500/20 text-gray-300" :
                                    ""
                                  }`}>
                                    {team.placement === 1 ? "🥇 Winner" : 
                                     team.placement === 2 ? "🥈 Runner-up" : 
                                     `${team.placement}${["", "", "rd", "th"][team.placement] || "th"} Place`}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-2">
                                {team.players.map((participant) => (
                                  <div key={participant.id} className="flex items-center space-x-2">
                                    {participant.user.claimed && participant.user.image ? (
                                      <img
                                        src={participant.user.image}
                                        alt={participant.user.displayName || "Player"}
                                        className="w-6 h-6 rounded-full"
                                      />
                                    ) : (
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                                        participant.user.claimed ? 'bg-green-600' : 'bg-gray-600'
                                      }`}>
                                        {participant.user.displayName?.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <span className="text-sm text-white">
                                      {participant.user.displayName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {match.rounds && match.rounds.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Rounds ({match.rounds.length})</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {match.rounds.map((round) => (
                            <div key={round.id} className="bg-zinc-700 rounded p-2 text-xs">
                              <div className="text-white font-medium">Round {round.roundNumber}</div>
                              <div className="text-gray-400">
                                {new Date(round.startTime).toLocaleString()}
                              </div>
                              {round.winnerId && (
                                <div className="text-green-400 mt-1">Winner assigned</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No matches generated yet</p>
              {isActive && (session?.user as any)?.id === tournament.creator.id && (
                <p className="text-sm text-gray-400">
                  Click "Generate Next Match" to create the first match for this tournament.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Matchmaking Options Panel */}
        {showMatchmakingOptions && isActive && (session?.user as any)?.id === tournament.creator.id && (
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Matchmaking Options</h2>
              <button
                onClick={() => setShowMatchmakingOptions(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Team Size */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Team Size
                </label>
                <select
                  value={matchmakingOptions.teamSize}
                  onChange={(e) => setMatchmakingOptions(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-red-600/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={1}>1v1</option>
                  <option value={2}>2v2</option>
                  <option value={3}>3v3</option>
                  <option value={4}>4v4</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Players per team</p>
              </div>

              {/* Entropy Level */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Randomness ({(matchmakingOptions.entropyLevel * 100).toFixed(0)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={matchmakingOptions.entropyLevel}
                  onChange={(e) => setMatchmakingOptions(prev => ({ ...prev, entropyLevel: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Skill-based</span>
                  <span>Random</span>
                </div>
              </div>

              {/* Max Skill Gap */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Max Skill Gap ({matchmakingOptions.maxSkillGap})
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={matchmakingOptions.maxSkillGap}
                  onChange={(e) => setMatchmakingOptions(prev => ({ ...prev, maxSkillGap: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Tight</span>
                  <span>Loose</span>
                </div>
              </div>

              {/* Avoid Recent Opponents */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={matchmakingOptions.avoidRecentOpponents}
                    onChange={(e) => setMatchmakingOptions(prev => ({ ...prev, avoidRecentOpponents: e.target.checked }))}
                    className="w-4 h-4 text-red-600 bg-zinc-800 border-red-600/30 rounded focus:ring-red-500"
                  />
                  <span className="text-white text-sm font-medium">Avoid Recent Opponents</span>
                </label>
                <p className="text-xs text-gray-400 mt-1">Prevent immediate rematches</p>
              </div>

              {/* Recent Match Lookback */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Lookback Rounds ({matchmakingOptions.recentMatchLookback})
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={matchmakingOptions.recentMatchLookback}
                  onChange={(e) => setMatchmakingOptions(prev => ({ ...prev, recentMatchLookback: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={!matchmakingOptions.avoidRecentOpponents}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Reset to Defaults */}
              <div className="flex items-end">
                <button
                  onClick={() => setMatchmakingOptions({
                    teamSize: 1,
                    teamsPerMatch: 2,
                    entropyLevel: 0.3,
                    maxSkillGap: 5.0,
                    avoidRecentOpponents: true,
                    recentMatchLookback: 3
                  })}
                  className="px-4 py-2 bg-zinc-700 text-white text-sm rounded-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">ℹ️ How It Works</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li><strong>Team Size:</strong> Number of players per team (1v1, 2v2, etc.)</li>
                <li><strong>Randomness:</strong> 0% = purely skill-based, 100% = completely random</li>
                <li><strong>Max Skill Gap:</strong> Maximum allowed difference in player ratings</li>
                <li><strong>Avoid Recent Opponents:</strong> Prevents players from facing same opponents repeatedly</li>
                <li><strong>Lookback Rounds:</strong> How many recent rounds to check for opponent history</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tournament Timeline */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Timeline</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-white font-medium">Tournament Created</p>
                <p className="text-sm text-gray-400">
                  {startDate.toLocaleString()}
                </p>
              </div>
            </div>
            
            {isActive ? (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">Tournament In Progress</p>
                  <p className="text-sm text-gray-400">Currently active</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Tournament Completed</p>
                  <p className="text-sm text-gray-400">
                    {endDate?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Match Results Submission Modal */}
        {showResultsModal && tournament && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Submit Match Results</h2>
                <button
                  onClick={() => setShowResultsModal(null)}
                  className="text-gray-400 hover:text-white"
                  disabled={submittingResults}
                >
                  ✕
                </button>
              </div>
              
              <MatchResultsForm
                matchId={showResultsModal}
                tournament={tournament}
                onSubmit={handleSubmitResults}
                onCancel={() => setShowResultsModal(null)}
                isSubmitting={submittingResults}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Match Results Form Component
interface MatchResultsFormProps {
  matchId: string;
  tournament: Tournament;
  onSubmit: (matchId: string, winningTeamId: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function MatchResultsForm({ matchId, tournament, onSubmit, onCancel, isSubmitting }: MatchResultsFormProps) {
  const [selectedWinningTeamId, setSelectedWinningTeamId] = useState<string>("");

  // Find the match to get its teams
  const match = tournament.matches?.find(m => m.id === matchId);
  
  if (!match || !match.teams || match.teams.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No teams found for this match.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  // Check if match already has results
  const hasResults = match.teams.some(team => team.placement !== null);
  if (hasResults) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Results have already been submitted for this match.</p>
        <div className="mt-4 space-y-2">
          {match.teams
            .sort((a, b) => (a.placement || 999) - (b.placement || 999))
            .map(team => (
              <div key={team.id} className="text-white">
                <span className={team.placement === 1 ? "text-yellow-400" : "text-gray-300"}>
                  {team.placement === 1 ? "🥇" : "🥈"} {team.name}
                </span>
              </div>
            ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  const canSubmit = selectedWinningTeamId && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(matchId, selectedWinningTeamId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-400 mb-4">
        Select the winning team for this match. Player ratings will be updated automatically.
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Select Winner</h3>
        
        <div className="space-y-3">
          {match.teams.map((team) => (
            <label
              key={team.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedWinningTeamId === team.id
                  ? "bg-yellow-900/20 border-yellow-600/50"
                  : "bg-zinc-800 border-gray-600/30 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name="winningTeam"
                value={team.id}
                checked={selectedWinningTeamId === team.id}
                disabled={isSubmitting}
                onChange={(e) => setSelectedWinningTeamId(e.target.value)}
                className="w-5 h-5 text-yellow-600 bg-zinc-800 border-gray-600 focus:ring-yellow-500"
              />
              
              <div className="flex-1">
                <h4 className={`font-medium text-lg ${
                  selectedWinningTeamId === team.id ? "text-yellow-400" : "text-white"
                }`}>
                  {team.name}
                </h4>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {team.players.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-2">
                      {participant.user.claimed && participant.user.image ? (
                        <img
                          src={participant.user.image}
                          alt={participant.user.displayName || "Player"}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                          participant.user.claimed ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {participant.user.displayName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-gray-300">
                        {participant.user.displayName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Results"}
        </button>
      </div>
    </form>
  );
}