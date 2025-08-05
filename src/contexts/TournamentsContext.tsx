"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Tournament {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  creator: {
    id: string;
    username: string | null;
    displayName: string | null;
  };
  players: Array<{
    id: string;
    user: {
      id: string;
      username: string | null;
      displayName: string | null;
      image: string | null;
    };
  }>;
  matches?: Array<{
    id: string;
    name: string;
    startTime: string;
    endTime: string | null;
    rounds: Array<{
      id: string;
      roundNumber: number;
      startTime: string;
      endTime: string | null;
      winnerId: string | null;
    }>;
  }>;
}

interface TournamentsContextType {
  activeTournaments: Tournament[];
  completedTournaments: Tournament[];
  loading: boolean;
  error: string | null;
  refreshTournaments: () => Promise<void>;
}

const TournamentsContext = createContext<TournamentsContextType | undefined>(undefined);

export function TournamentsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([]);
  const [completedTournaments, setCompletedTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    if (!session?.user?.isAdmin) {
      setActiveTournaments([]);
      setCompletedTournaments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tournaments/status");
      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }

      const data = await response.json();
      setActiveTournaments(data.activeTournaments || []);
      setCompletedTournaments(data.completedTournaments || []);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tournaments");
      setActiveTournaments([]);
      setCompletedTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [session?.user?.isAdmin]);

  const refreshTournaments = async () => {
    await fetchTournaments();
  };

  return (
    <TournamentsContext.Provider
      value={{
        activeTournaments,
        completedTournaments,
        loading,
        error,
        refreshTournaments,
      }}
    >
      {children}
    </TournamentsContext.Provider>
  );
}

export function useTournaments() {
  const context = useContext(TournamentsContext);
  if (context === undefined) {
    throw new Error("useTournaments must be used within a TournamentsProvider");
  }
  return context;
}