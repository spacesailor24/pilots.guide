"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

interface PlayerStats {
  rank: number;
  rating: number;
  gamesPlayed: number;
  ordinal: number;
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
    generationRound: number;
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
  const [selectedWinners, setSelectedWinners] = useState<{ [matchId: string]: string }>({});
  const [submittingResults, setSubmittingResults] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [finalizingTournament, setFinalizingTournament] = useState(false);
  const [currentPlayersPage, setCurrentPlayersPage] = useState(1);
  const playersPerPage = 12;
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error';
    message: string;
  }>>([]);

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

  // Extract isAdmin check to avoid inline type assertion
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;
  const userId = (session?.user as { id?: string })?.id;

  // Redirect if not admin
  useEffect(() => {
    if (status !== "loading" && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, status, router]);

  // Fetch tournament data
  const fetchTournament = useCallback(async () => {
    if (!isAdmin) return;

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
  }, [isAdmin, params, currentTournamentId, tournament, activeTournaments, completedTournaments]);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  // Group matches by their explicit generationRound field
  const groupedMatches = tournament?.matches?.reduce((groups, match) => {
    const roundKey = match.generationRound;
    
    if (!groups[roundKey]) {
      groups[roundKey] = [];
    }
    groups[roundKey].push(match);
    return groups;
  }, {} as { [key: number]: typeof tournament.matches }) || {};

  const rounds = Object.entries(groupedMatches)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([roundKey, matches]) => ({
      roundNumber: parseInt(roundKey),
      matches: matches?.sort((a, b) => a.name.localeCompare(b.name)) || []
    }));

  const currentRoundData = rounds[currentRound - 1];
  const totalRounds = rounds.length;

  // Auto-set current round to latest when tournament data changes
  useEffect(() => {
    if (totalRounds > 0 && currentRound > totalRounds) {
      setCurrentRound(totalRounds);
    } else if (totalRounds > 0 && currentRound === 1 && totalRounds > 1) {
      // On initial load, set to latest round if there are multiple rounds
      setCurrentRound(totalRounds);
    }
  }, [totalRounds, currentRound]);

  // Clear selected winners when changing rounds
  useEffect(() => {
    setSelectedWinners({});
  }, [currentRound]);

  // Notification helpers
  const showNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
  if (!isAdmin) {
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
          
          // Set current round to the latest generation round
          const maxGenerationRound = updatedTournament.matches?.length > 0 
            ? Math.max(...updatedTournament.matches.map((m: { generationRound?: number }) => m.generationRound || 1))
            : 1;
          setCurrentRound(maxGenerationRound);
        }
      } else {
        const error = await response.json();
        showNotification('error', `Failed to generate match: ${error.error}`);
      }
    } catch (error) {
      console.error("Error generating match:", error);
      showNotification('error', 'Failed to generate match. Please try again.');
    } finally {
      setGeneratingMatch(false);
    }
  };

  const handleTeamSelection = (matchId: string, teamId: string) => {
    setSelectedWinners(prev => ({
      ...prev,
      [matchId]: teamId
    }));
  };

  const handleSubmitSelectedResults = async () => {
    if (!tournament || submittingResults) return;
    
    // Get all matches with selected winners that don't already have results
    const matchesToSubmit = Object.entries(selectedWinners).filter(([matchId, teamId]) => {
      const match = tournament.matches?.find(m => m.id === matchId);
      const hasResults = match?.teams?.some(team => team.placement !== null);
      return teamId && !hasResults;
    });

    if (matchesToSubmit.length === 0) {
      showNotification('error', 'No matches selected for result submission.');
      return;
    }

    setSubmittingResults(true);
    let successCount = 0;
    const failedMatches: string[] = [];

    try {
      // Submit results for each selected match
      for (const [matchId, winningTeamId] of matchesToSubmit) {
        try {
          const response = await fetch(`/api/tournaments/${tournament.id}/matches/${matchId}/results`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ winningTeamId }),
          });

          if (response.ok) {
            successCount++;
            // Clear the selection for this match
            setSelectedWinners(prev => {
              const newState = { ...prev };
              delete newState[matchId];
              return newState;
            });
          } else {
            const error = await response.json();
            const match = tournament.matches?.find(m => m.id === matchId);
            failedMatches.push(match?.name || `Match ${matchId}`);
            console.error(`Failed to submit ${match?.name}:`, error.error);
          }
        } catch (error) {
          const match = tournament.matches?.find(m => m.id === matchId);
          failedMatches.push(match?.name || `Match ${matchId}`);
          console.error(`Error submitting ${match?.name}:`, error);
        }
      }

      // Show results summary
      if (successCount > 0 && failedMatches.length === 0) {
        showNotification('success', `Successfully submitted results for ${successCount} match${successCount > 1 ? 'es' : ''}!`);
      } else if (successCount > 0 && failedMatches.length > 0) {
        showNotification('error', `Submitted ${successCount} match${successCount > 1 ? 'es' : ''} successfully. Failed: ${failedMatches.join(', ')}`);
      } else {
        showNotification('error', `Failed to submit results for: ${failedMatches.join(', ')}`);
      }
        
      // Refresh tournament data to show updated match status
      const tournamentResponse = await fetch(`/api/tournaments/${tournament.id}`);
      if (tournamentResponse.ok) {
        const updatedTournament = await tournamentResponse.json();
        setTournament(updatedTournament);
      }
    } catch (error) {
      console.error("Error submitting batch results:", error);
      showNotification('error', 'Failed to submit results. Please try again.');
    } finally {
      setSubmittingResults(false);
    }
  };

  const handleFinalizeTournament = async () => {
    if (!tournament || finalizingTournament) return;

    const confirmed = window.confirm(
      "Are you sure you want to finalize this tournament? This will mark it as completed and cannot be undone."
    );
    
    if (!confirmed) return;

    setFinalizingTournament(true);
    try {
      const response = await fetch(`/api/tournaments/${tournament.id}/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        showNotification('success', 'Tournament has been successfully finalized!');
        // Refresh tournament data
        const tournamentResponse = await fetch(`/api/tournaments/${tournament.id}`);
        if (tournamentResponse.ok) {
          const updatedTournament = await tournamentResponse.json();
          setTournament(updatedTournament);
        }
      } else {
        const error = await response.json();
        showNotification('error', `Failed to finalize tournament: ${error.error}`);
      }
    } catch (error) {
      console.error("Error finalizing tournament:", error);
      showNotification('error', 'Failed to finalize tournament. Please try again.');
    } finally {
      setFinalizingTournament(false);
    }
  };


  // Notification Component
  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right-2 duration-300 max-w-sm ${
            notification.type === 'success'
              ? 'bg-green-900/90 border-green-600 text-green-100'
              : 'bg-red-900/90 border-red-600 text-red-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                notification.type === 'success' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-3 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      <NotificationContainer />
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
                  <Image
                    src={tournament.creator.image}
                    alt={tournament.creator.displayName || "Creator"}
                    width={24}
                    height={24}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">
              Players ({tournament.players.length})
            </h2>
            {tournament.players.length > playersPerPage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPlayersPage(p => Math.max(1, p - 1))}
                  disabled={currentPlayersPage === 1}
                  className="px-3 py-1 bg-zinc-700 text-white text-sm rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm">
                  Page {currentPlayersPage} of {Math.ceil(tournament.players.length / playersPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPlayersPage(p => Math.min(Math.ceil(tournament.players.length / playersPerPage), p + 1))}
                  disabled={currentPlayersPage >= Math.ceil(tournament.players.length / playersPerPage)}
                  className="px-3 py-1 bg-zinc-700 text-white text-sm rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          
          {tournament.players.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No players in this tournament
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {tournament.players
                  .slice((currentPlayersPage - 1) * playersPerPage, currentPlayersPage * playersPerPage)
                  .map((player) => (
                    <PlayerCard key={player.id} player={player} />
                  ))}
              </div>
              
              {tournament.players.length > playersPerPage && (
                <div className="mt-6 text-center text-sm text-gray-400">
                  Showing {Math.min((currentPlayersPage - 1) * playersPerPage + 1, tournament.players.length)} - {Math.min(currentPlayersPage * playersPerPage, tournament.players.length)} of {tournament.players.length} players
                </div>
              )}
            </>
          )}
        </div>

        {/* Tournament Matches */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-white">
                Matches {tournament.matches && tournament.matches.length > 0 && `(${tournament.matches.length})`}
              </h2>
              {totalRounds > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Round:</span>
                  <div className="relative">
                    <select
                      value={currentRound}
                      onChange={(e) => setCurrentRound(parseInt(e.target.value))}
                      className="appearance-none px-3 py-2 pr-8 bg-zinc-800 border border-red-600/30 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 hover:border-red-500/50 transition-colors cursor-pointer"
                    >
                      {rounds.map((round) => (
                        <option key={round.roundNumber} value={round.roundNumber} className="bg-zinc-800 text-white">
                          Round {round.roundNumber} ({round.matches.length} matches)
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-red-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Action buttons for tournament creator */}
            {isActive && userId === tournament.creator.id && (
              <div className="flex items-center gap-3">
                {/* Submit Results button - only show when there are selected winners */}
                {Object.keys(selectedWinners).length > 0 && (
                  <button
                    onClick={handleSubmitSelectedResults}
                    disabled={submittingResults}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submittingResults ? "Submitting..." : `Submit Results (${Object.keys(selectedWinners).length})`}
                  </button>
                )}
                <button
                  onClick={handleGenerateNextMatch}
                  disabled={generatingMatch}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {generatingMatch ? "Generating..." : "Generate Next Round"}
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
          
          {currentRoundData && currentRoundData.matches && currentRoundData.matches.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {currentRoundData.matches.map((match) => {
                const matchStartDate = new Date(match.startTime);
                const matchEndDate = match.endTime ? new Date(match.endTime) : null;
                const matchIsActive = !matchEndDate || matchEndDate > new Date();
                const hasResults = match.teams && match.teams.some(team => team.placement !== null);
                const canSubmitResults = matchIsActive && userId === tournament.creator.id && !hasResults;
                const selectedWinner = selectedWinners[match.id];
                
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
                        {/* Show selected indicator */}
                        {selectedWinner && !hasResults && (
                          <div className="px-2 py-1 rounded text-xs font-medium bg-blue-900/20 text-blue-400 border border-blue-600/30">
                            Selected
                          </div>
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
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-300">Teams</h4>
                          {canSubmitResults && (
                            <span className="text-xs text-gray-400">Click teams to select winners, then use "Submit Results" button</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {match.teams.map((team) => {
                            const isWinner = team.placement === 1;
                            const isRunnerUp = team.placement === 2;
                            const isSelected = selectedWinner === team.id;
                            const isClickable = canSubmitResults;
                            
                            return (
                              <div 
                                key={team.id} 
                                className={`rounded-lg p-3 border transition-all ${
                                  isWinner ? "border-yellow-500/50 bg-yellow-900/10" :
                                  isRunnerUp ? "border-gray-400/50 bg-gray-900/10" :
                                  isSelected ? "border-blue-500/50 bg-blue-900/10" :
                                  isClickable ? "border-zinc-600 bg-zinc-700 hover:border-blue-400/30 hover:bg-blue-900/5 cursor-pointer" :
                                  "border-zinc-600 bg-zinc-700"
                                }`}
                                onClick={() => isClickable && handleTeamSelection(match.id, team.id)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className={`font-medium ${
                                    isWinner ? "text-yellow-400" :
                                    isSelected ? "text-blue-400" :
                                    "text-white"
                                  }`}>
                                    {team.name}
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    {isSelected && !hasResults && (
                                      <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                                        Selected
                                      </span>
                                    )}
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
                                </div>
                                <div className="space-y-2">
                                  {team.players.map((participant) => (
                                    <MatchPlayerCard key={participant.id} participant={participant} />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">{totalRounds === 0 ? "No matches generated yet" : `No matches in Round ${currentRound}`}</p>
              {isActive && userId === tournament.creator.id && (
                <p className="text-sm text-gray-400">
                  {totalRounds === 0 
                    ? "Click \"Generate Next Round\" to create the first round of matches."
                    : "Click \"Generate Next Round\" to create more matches."
                  }
                </p>
              )}
            </div>
          )}
        </div>

        {/* Matchmaking Options Panel */}
        {showMatchmakingOptions && isActive && userId === tournament.creator.id && (
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

        {/* Tournament Actions */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Tournament Status</h2>
              <p className="text-gray-400">
                {isActive ? "Tournament is currently active" : "Tournament has been completed"}
              </p>
            </div>
            
            {/* Finalize Tournament button - only show for active tournaments and if user is the creator */}
            {isActive && userId === tournament.creator.id && (
              <button
                onClick={handleFinalizeTournament}
                disabled={finalizingTournament}
                className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {finalizingTournament ? "Finalizing..." : "Finalize Tournament"}
              </button>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

// Player Card Component with Stats
interface PlayerCardProps {
  player: TournamentPlayer;
}

function PlayerCard({ player }: PlayerCardProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/players/rankings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: player.user.id })
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch player stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [player.user.id]);

  return (
    <div className="bg-zinc-800 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors">
      <div className="flex flex-col items-center space-y-2">
        {/* Avatar */}
        {player.user.claimed && player.user.image ? (
          <Image
            src={player.user.image}
            alt={player.user.displayName || "Player"}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            player.user.claimed ? 'bg-green-600' : 'bg-gray-600'
          }`}>
            <span className="text-xs font-medium text-white">
              {player.user.displayName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Name */}
        <h3 className="font-medium text-white text-xs text-center truncate w-full">
          {player.user.displayName}
        </h3>
        
        {/* Status */}
        <div className={`text-xs px-2 py-0.5 rounded ${
          player.user.claimed 
            ? "bg-green-900/20 text-green-400"
            : "bg-orange-900/20 text-orange-400"
        }`}>
          {player.user.claimed ? "Claimed" : "Unclaimed"}
        </div>
        
        {/* Stats */}
        {loading ? (
          <div className="text-center">
            <div className="w-8 h-3 bg-zinc-700 rounded animate-pulse mb-1"></div>
            <div className="w-6 h-2 bg-zinc-700 rounded animate-pulse"></div>
          </div>
        ) : stats ? (
          <div className="text-center">
            <div className="text-xs font-semibold text-white">
              #{stats.rank}
            </div>
            <div className="text-xs text-gray-400">
              {stats.ordinal.toFixed(1)} rating
            </div>
            <div className="text-xs text-gray-500">
              {stats.gamesPlayed} games
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xs text-gray-400">No rating</div>
            <div className="text-xs text-gray-500">0 games</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Match Player Card Component with inline stats
interface MatchPlayerCardProps {
  participant: {
    id: string;
    userId: string;
    user: {
      id: string;
      username: string | null;
      displayName: string | null;
      image: string | null;
      claimed: boolean;
    };
  };
}

function MatchPlayerCard({ participant }: MatchPlayerCardProps) {
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/players/rankings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: participant.userId })
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch player stats:', error);
      }
    };

    fetchStats();
  }, [participant.userId]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {participant.user.claimed && participant.user.image ? (
          <Image
            src={participant.user.image}
            alt={participant.user.displayName || "Player"}
            width={24}
            height={24}
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
      <div className="text-right">
        {stats ? (
          <>
            <div className="text-xs text-gray-300">#{stats.rank}</div>
            <div className="text-xs text-gray-500">{stats.ordinal.toFixed(1)}</div>
          </>
        ) : (
          <div className="text-xs text-gray-500">-</div>
        )}
      </div>
    </div>
  );
}