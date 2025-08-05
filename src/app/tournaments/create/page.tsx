"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import { useTournaments } from "@/contexts/TournamentsContext";

interface Player {
  id: string;
  username: string | null;
  displayName: string | null;
  image: string | null;
  claimed: boolean;
}

export default function CreateTournamentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { refreshTournaments } = useTournaments();
  const [step, setStep] = useState(1);
  const [tournamentName, setTournamentName] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status !== "loading" && (!session?.user?.isAdmin)) {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch players from database
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!session?.user?.isAdmin) return;
      
      try {
        const response = await fetch("/api/players");
        if (response.ok) {
          const data = await response.json();
          setPlayers(data);
        }
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };

    fetchPlayers();
  }, [session?.user?.isAdmin]);

  // Filter and sort players based on search term
  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  const handleTournamentNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tournamentName.trim()) {
      // Auto-populate start time with current time rounded to nearest 15 minutes
      if (!startDateTime) {
        const now = new Date();
        const minutes = now.getMinutes();
        const roundedMinutes = Math.ceil(minutes / 15) * 15;
        now.setMinutes(roundedMinutes, 0, 0); // Set to nearest 15min, clear seconds/ms
        setStartDateTime(now);
      }
      setStep(2);
    }
  };

  const handleDateTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDateTime) {
      setStep(3);
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDateTime || selectedPlayers.length === 0) return;

    setCreating(true);
    try {
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentName,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime?.toISOString() || null,
          selectedPlayers,
        }),
      });

      if (response.ok) {
        const tournament = await response.json();
        console.log("Tournament created successfully:", tournament);
        
        // Refresh tournaments in context
        await refreshTournaments();
        
        // Reset form
        setStep(1);
        setTournamentName("");
        setStartDateTime(null);
        setEndDateTime(null);
        setSelectedPlayers([]);
        setSearchTerm("");
        
        // Redirect to tournament view
        router.push(`/tournaments/${tournament.id}`);
      } else {
        const error = await response.json();
        console.error("Failed to create tournament:", error);
        alert("Failed to create tournament. Please try again.");
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Failed to create tournament. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Return null while redirecting if not admin
  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <div className="mb-8">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-semibold text-white mb-3">
            Create Tournament
          </h1>
          <p className="text-gray-300">
            Set up a new tournament by selecting players and configuring tournament
            settings.
          </p>
        </div>

        {/* Step 1: Tournament Name */}
        <div
          className={`bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6 ${
            step === 1 ? "" : "opacity-75"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step === 1
                  ? "bg-red-600 text-white"
                  : step > 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {step > 1 ? "✓" : "1"}
            </div>
            <h2 className="text-xl font-semibold text-white">Name the Tournament</h2>
          </div>

          {step === 1 ? (
            <form onSubmit={handleTournamentNameSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-red-600/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  placeholder="Enter tournament name..."
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!tournamentName.trim()}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-300">
              <p className="text-lg font-medium text-white">
                Tournament Name: {tournamentName}
              </p>
              <button
                onClick={() => setStep(1)}
                className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Date and Time */}
        <div
          className={`bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6 ${
            step === 2
              ? ""
              : step > 2
              ? "opacity-75"
              : "opacity-50 pointer-events-none"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step === 2
                  ? "bg-red-600 text-white"
                  : step > 2
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {step > 2 ? "✓" : "2"}
            </div>
            <h2 className="text-xl font-semibold text-white">
              Set Date and Time
            </h2>
          </div>

          {step === 2 ? (
            <form onSubmit={handleDateTimeSubmit} className="space-y-4">
              {/* Date and Time Inputs Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date and Time */}
                <div>
                  <label
                    htmlFor="startDateTime"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Start Date and Time *
                  </label>
                  <CustomDateTimePicker
                    selected={startDateTime}
                    onChange={(date) => setStartDateTime(date)}
                    placeholderText="Select start date and time..."
                    minDate={new Date()}
                    required
                  />
                </div>

                {/* End Date and Time */}
                <div>
                  <label
                    htmlFor="endDateTime"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    End Date and Time <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <CustomDateTimePicker
                    selected={endDateTime}
                    onChange={(date) => setEndDateTime(date)}
                    placeholderText="Select end date and time..."
                    minDate={startDateTime || undefined}
                    required={false}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!startDateTime}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : step > 2 ? (
            <div className="text-gray-300">
              <p className="text-lg font-medium text-white">
                Start: {startDateTime?.toLocaleString()}
              </p>
              {endDateTime && (
                <p className="text-lg font-medium text-white">
                  End: {endDateTime.toLocaleString()}
                </p>
              )}
              <button
                onClick={() => setStep(2)}
                className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
              >
                Edit
              </button>
            </div>
          ) : null}
        </div>

        {/* Step 3: Player Selection */}
        <div
          className={`bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg ${
            step >= 3 ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step === 3
                  ? "bg-red-600 text-white"
                  : step > 3
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              3
            </div>
            <h2 className="text-xl font-semibold text-white">Select Players</h2>
          </div>

          {step >= 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              {/* Search Bar */}
              <div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 border border-red-600/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Search players by name..."
                />
              </div>

              {/* Selected Players Counter */}
              <div className="text-sm text-gray-300">
                {selectedPlayers.length} player
                {selectedPlayers.length !== 1 ? "s" : ""} selected
              </div>

              {/* Player Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-4 bg-zinc-800 rounded-lg border border-red-600/30">
                {filteredPlayers.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    No players found matching "{searchTerm}"
                  </div>
                ) : (
                  filteredPlayers.map((player) => {
                    const isSelected = selectedPlayers.includes(player.id);
                    return (
                      <div
                        key={player.id}
                        onClick={() => handlePlayerSelect(player.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-red-600/20 border border-red-600 text-red-400"
                            : "bg-zinc-700 border border-gray-600 text-gray-300 hover:bg-zinc-600"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            player.claimed ? 'bg-green-600' : 'bg-gray-600'
                          }`}>
                            {player.claimed && player.image ? (
                              <img
                                src={player.image}
                                alt={player.displayName || "Player"}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <span className="text-xs font-medium">
                                {player.displayName?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {player.displayName}
                            </span>
                            {!player.claimed && (
                              <span className="text-xs text-gray-500">unclaimed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={selectedPlayers.length === 0 || creating}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {creating ? "Creating..." : "Create Tournament"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}