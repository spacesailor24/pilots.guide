"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AppLayout from "@/components/AppLayout";
import { useTournaments } from "@/contexts/TournamentsContext";
import LinkWithTransition from "@/components/LinkWithTransition";


export default function CompletedTournamentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { completedTournaments, loading, error, refreshTournaments } = useTournaments();

  // Redirect if not admin
  useEffect(() => {
    const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;
    if (status !== "loading" && !isAdmin) {
      router.push("/");
    }
  }, [session, status, router]);

  // Show loading while checking auth
  if (status === "loading" || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading completed tournaments...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Return null while redirecting if not admin
  if (!(session?.user as { isAdmin?: boolean })?.isAdmin) {
    return null;
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-red-400 mb-2">Error</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={refreshTournaments}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-4xl font-semibold text-white">
              Completed Tournaments
            </h1>
            <button
              onClick={refreshTournaments}
              className="px-4 py-2 bg-zinc-700 text-gray-300 rounded-md hover:bg-zinc-600 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          <p className="text-gray-300">
            View all completed and cancelled tournaments.
          </p>
        </div>

        {/* Matches List */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {completedTournaments.length > 0 
              ? `${completedTournaments.length} Completed Tournament${completedTournaments.length !== 1 ? 's' : ''}`
              : "No Completed Tournaments"
            }
          </h2>
          
          {completedTournaments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">No completed tournaments yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Tournaments will appear here once they have ended or been cancelled.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedTournaments.map((tournament) => {
                const startDate = new Date(tournament.startTime);
                const endDate = tournament.endTime ? new Date(tournament.endTime) : null;
                const duration = endDate && startDate 
                  ? Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)) // hours
                  : null;

                return (
                  <div
                    key={tournament.id}
                    className="bg-zinc-800 rounded-lg p-6 border border-gray-600 hover:border-red-600/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {tournament.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>
                            Created by: {tournament.creator.displayName || tournament.creator.username}
                          </span>
                          <span>•</span>
                          <span>
                            {tournament.players.length} player{tournament.players.length !== 1 ? 's' : ''}
                          </span>
                          {duration && (
                            <>
                              <span>•</span>
                              <span>
                                Duration: {duration}h
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <LinkWithTransition
                        href={`/tournaments/${tournament.id}`}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                      >
                        View Details
                      </LinkWithTransition>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Started:</span>
                        <p className="text-white">
                          {startDate.toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Ended:</span>
                        <p className="text-white">
                          {endDate ? endDate.toLocaleString() : "No end time recorded"}
                        </p>
                      </div>
                    </div>

                    {/* Player previews */}
                    <div className="mt-4">
                      <span className="text-gray-400 text-sm">Players:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tournament.players.slice(0, 6).map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center space-x-2 bg-zinc-700 px-3 py-1 rounded-full"
                          >
                            {player.user.image ? (
                              <Image
                                src={player.user.image}
                                alt={player.user.displayName || "Player"}
                                width={20}
                                height={20}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">
                                  {player.user.displayName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-white text-sm">
                              {player.user.displayName}
                            </span>
                          </div>
                        ))}
                        {tournament.players.length > 6 && (
                          <div className="flex items-center justify-center bg-zinc-700 px-3 py-1 rounded-full">
                            <span className="text-gray-300 text-sm">
                              +{tournament.players.length - 6} more
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}