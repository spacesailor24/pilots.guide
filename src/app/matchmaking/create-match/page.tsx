"use client";

import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";

// Mock user data for player selection (sorted alphabetically)
const mockPlayers = [
  { id: "2", username: "bjax", image: null },
  { id: "4", username: "BountySeeker_88", image: null },
  { id: "9", username: "Gatekeeper_77", image: null },
  { id: "6", username: "NightHunter_44", image: null },
  { id: "5", username: "PhantomOps_55", image: null },
  { id: "7", username: "RocketRain_11", image: null },
  { id: "1", username: "spacesai1or", image: null },
  { id: "10", username: "StarSeeker_99", image: null },
  { id: "8", username: "SupportPilot_22", image: null },
  { id: "3", username: "WarHawk_21", image: null },
].sort((a, b) =>
  a.username.toLowerCase().localeCompare(b.username.toLowerCase())
);

export default function CreateMatchPage() {
  const [step, setStep] = useState(1);
  const [matchName, setMatchName] = useState("");
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort players based on search term
  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter((player) =>
      player.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleMatchNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchName.trim()) {
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

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating match:", {
      matchName,
      startDateTime: startDateTime?.toISOString(),
      endDateTime: endDateTime?.toISOString() || null,
      selectedPlayers,
    });
    // TODO: Implement match creation logic
  };

  return (
    <AppLayout>
      <div className="mb-8">
        {/* Header */}
        <div className="bg-zinc-900 rounded-lg border border-red-600 p-6 shadow-lg mb-6">
          <h1 className="text-4xl font-semibold text-white mb-3">
            Create Match
          </h1>
          <p className="text-gray-300">
            Set up a new match by selecting players and configuring match
            settings.
          </p>
        </div>

        {/* Step 1: Match Name */}
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
            <h2 className="text-xl font-semibold text-white">Name the Match</h2>
          </div>

          {step === 1 ? (
            <form onSubmit={handleMatchNameSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-red-600/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  placeholder="Enter match name..."
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!matchName.trim()}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-300">
              <p className="text-lg font-medium text-white">
                Match Name: {matchName}
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
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {player.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {player.username}
                          </span>
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
                  disabled={selectedPlayers.length === 0}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Match
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
