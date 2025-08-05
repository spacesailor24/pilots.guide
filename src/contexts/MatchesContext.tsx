"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Match {
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
}

interface MatchesContextType {
  activeMatches: Match[];
  completedMatches: Match[];
  loading: boolean;
  error: string | null;
  refreshMatches: () => Promise<void>;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);
  const [completedMatches, setCompletedMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async () => {
    if (!session?.user?.isAdmin) {
      setActiveMatches([]);
      setCompletedMatches([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/matches/status");
      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setActiveMatches(data.activeMatches || []);
      setCompletedMatches(data.completedMatches || []);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch matches");
      setActiveMatches([]);
      setCompletedMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [session?.user?.isAdmin]);

  const refreshMatches = async () => {
    await fetchMatches();
  };

  return (
    <MatchesContext.Provider
      value={{
        activeMatches,
        completedMatches,
        loading,
        error,
        refreshMatches,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === undefined) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
}