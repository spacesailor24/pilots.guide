"use client";

import { useSession } from "next-auth/react";
import AppLayout from "@/components/AppLayout";
import LinkWithTransition from "@/components/LinkWithTransition";
import { useTournaments } from "@/contexts/TournamentsContext";

export default function TournamentsPage() {
  const { data: session } = useSession();
  const { activeTournaments, completedTournaments, loading } = useTournaments();

  // Show loading while fetching tournaments
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading tournaments...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;

  const totalTournaments = activeTournaments.length + completedTournaments.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
          <h1 className="text-4xl font-semibold text-white mb-3">
            Tournaments
          </h1>
          <p className="text-gray-300">
            Manage and view all tournaments in the system.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {activeTournaments.length}
            </div>
            <div className="text-gray-300">Active Tournaments</div>
          </div>
          
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 text-center">
            <div className="text-3xl font-bold text-gray-400 mb-2">
              {completedTournaments.length}
            </div>
            <div className="text-gray-300">Completed Tournaments</div>
          </div>
          
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {totalTournaments}
            </div>
            <div className="text-gray-300">Total Tournaments</div>
          </div>
        </div>

        {/* Quick Actions */}
        {isAdmin && (
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LinkWithTransition
                href="/tournaments/create"
                className="flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Tournament
              </LinkWithTransition>
              
              <LinkWithTransition
                href="/tournaments/completed"
                className="flex items-center justify-center px-6 py-4 bg-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Completed Tournaments
              </LinkWithTransition>
            </div>
          </div>
        )}

        {/* Active Tournaments */}
        {activeTournaments.length > 0 && (
          <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Active Tournaments ({activeTournaments.length})
            </h2>
            
            <div className="space-y-4">
              {activeTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-zinc-800 rounded-lg p-4 border border-gray-600 hover:border-red-600/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {tournament.name}
                      </h3>
                      <div className="text-sm text-gray-400">
                        <span>Started: {new Date(tournament.startTime).toLocaleDateString()}</span>
                        <span className="ml-4">Players: {tournament.players.length}</span>
                      </div>
                    </div>
                    
                    <LinkWithTransition
                      href={`/tournaments/${tournament.id}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      View Details
                    </LinkWithTransition>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}