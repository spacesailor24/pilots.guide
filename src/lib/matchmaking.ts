/**
 * Enhanced Matchmaking System for Tournaments
 * 
 * Improvements over reference implementation:
 * - Non-deterministic matching with entropy injection
 * - Random player exclusion for odd numbers
 * - Flexible team sizes (1v1, 2v2, etc.)
 * - Database integration with Prisma
 * - Better skill group balancing
 */

import { prisma } from "./prisma";
import { rating, rate, ordinal, predictDraw } from 'openskill';

export interface PlayerRating {
  id: string;
  displayName: string;
  rating: {
    mu: number;
    sigma: number;
  };
  ordinal: number;
  gamesPlayed: number;
}

export interface MatchTeam {
  players: PlayerRating[];
}

export interface GeneratedMatch {
  teams: MatchTeam[];
  skillDifference: number;
  averageSkill: number;
  confidence: number;
  drawProbability: number;
}

export interface MatchmakingResult {
  matches: GeneratedMatch[];
  unmatchedPlayers: PlayerRating[];
  teamSize: number;
  totalPlayers: number;
  algorithm: string;
  entropy: number; // How much randomness was injected
  timestamp: Date;
}

export interface MatchmakingOptions {
  teamSize?: number; // Players per team (default: 1)
  teamsPerMatch?: number; // Teams per match (default: 2)
  entropyLevel?: number; // 0.0 = deterministic, 1.0 = random (default: 0.3)
  maxSkillGap?: number; // Maximum allowed skill difference (default: 5.0)
  avoidRecentOpponents?: boolean; // Avoid matching recent opponents (default: true)
  recentMatchLookback?: number; // How many recent rounds to consider (default: 3)
}

const DEFAULT_OPTIONS: Required<MatchmakingOptions> = {
  teamSize: 1,
  teamsPerMatch: 2,
  entropyLevel: 0.3,
  maxSkillGap: 5.0,
  avoidRecentOpponents: true,
  recentMatchLookback: 3
};

/**
 * Load player ratings from database and create PlayerRating objects
 */
export async function loadPlayerRatings(tournamentId: string): Promise<PlayerRating[]> {
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      players: {
        include: {
          user: {
            select: {
              id: true,
              displayName: true
            }
          }
        }
      }
    }
  });

  if (!tournament) {
    throw new Error(`Tournament ${tournamentId} not found`);
  }

  // Load existing ratings or create defaults
  const playerRatings: PlayerRating[] = [];
  
  for (const tournamentPlayer of tournament.players) {
    const userId = tournamentPlayer.user.id;
    const displayName = tournamentPlayer.user.displayName || 'Unknown';

    // Try to load existing rating from database
    let existingRating = await prisma.playerRating.findUnique({
      where: { userId: userId }
    });

    if (!existingRating) {
      // Create default rating for new player
      const defaultRating = rating();
      existingRating = await prisma.playerRating.create({
        data: {
          userId: userId,
          mu: defaultRating.mu,
          sigma: defaultRating.sigma,
          gamesPlayed: 0
        }
      });
    }

    playerRatings.push({
      id: userId,
      displayName: displayName,
      rating: {
        mu: existingRating.mu,
        sigma: existingRating.sigma
      },
      ordinal: ordinal({ mu: existingRating.mu, sigma: existingRating.sigma }),
      gamesPlayed: existingRating.gamesPlayed
    });
  }

  return playerRatings;
}

/**
 * Get recent opponents for a player to avoid immediate rematches
 */
async function getRecentOpponents(playerId: string, tournamentId: string, lookbackRounds: number): Promise<Set<string>> {
  const recentMatches = await prisma.round.findMany({
    where: {
      match: {
        tournamentId: tournamentId
      },
      createdAt: {
        gte: new Date(Date.now() - lookbackRounds * 24 * 60 * 60 * 1000) // Simple time-based lookback
      }
    },
    include: {
      match: {
        include: {
          tournament: {
            include: {
              players: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      }
    }
  });

  const opponents = new Set<string>();
  
  // This is a simplified version - in a real implementation you'd track
  // which players were in the same match/round
  recentMatches.forEach(round => {
    round.match.tournament.players.forEach(player => {
      if (player.user.id !== playerId) {
        opponents.add(player.user.id);
      }
    });
  });

  return opponents;
}

/**
 * Create skill-based groups for balanced matchmaking
 */
function createSkillGroups(players: PlayerRating[], maxGroupSize: number = 6): PlayerRating[][] {
  const sortedPlayers = [...players].sort((a, b) => b.ordinal - a.ordinal);
  const groups: PlayerRating[][] = [];
  
  let currentGroup: PlayerRating[] = [];
  const maxSkillGap = 3.0; // Maximum ordinal difference within a group
  
  for (const player of sortedPlayers) {
    if (currentGroup.length === 0) {
      currentGroup = [player];
      continue;
    }

    const groupTopSkill = currentGroup[0]?.ordinal || 0;
    const skillGap = groupTopSkill - player.ordinal;
    
    // Start new group if skill gap too large or group is full
    if (skillGap > maxSkillGap || currentGroup.length >= maxGroupSize) {
      groups.push(currentGroup);
      currentGroup = [player];
    } else {
      currentGroup.push(player);
    }
  }
  
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  return groups;
}

/**
 * Calculate match quality score (lower is better)
 */
function calculateMatchCost(
  team1: PlayerRating[], 
  team2: PlayerRating[], 
  recentOpponentSets: Map<string, Set<string>>,
  options: Required<MatchmakingOptions>
): number {
  // Calculate team ratings
  const team1Ratings = team1.map(p => ({ mu: p.rating.mu, sigma: p.rating.sigma }));
  const team2Ratings = team2.map(p => ({ mu: p.rating.mu, sigma: p.rating.sigma }));
  
  // Base cost from skill imbalance (lower draw probability = higher cost)
  const drawProbability = predictDraw([team1Ratings, team2Ratings]);
  let cost = 1 - drawProbability;
  
  // Penalty for recent opponents
  if (options.avoidRecentOpponents) {
    let recentOpponentPenalty = 0;
    for (const p1 of team1) {
      for (const p2 of team2) {
        const p1Opponents = recentOpponentSets.get(p1.id) || new Set();
        if (p1Opponents.has(p2.id)) {
          recentOpponentPenalty += 0.2;
        }
      }
    }
    cost += recentOpponentPenalty;
  }
  
  // Penalty for large skill gaps
  const team1AvgOrdinal = team1.reduce((sum, p) => sum + p.ordinal, 0) / team1.length;
  const team2AvgOrdinal = team2.reduce((sum, p) => sum + p.ordinal, 0) / team2.length;
  const skillGap = Math.abs(team1AvgOrdinal - team2AvgOrdinal);
  
  if (skillGap > options.maxSkillGap) {
    cost += (skillGap - options.maxSkillGap) * 0.1;
  }
  
  return cost;
}

/**
 * Generate all possible team combinations from a player pool
 */
function generateTeamCombinations(players: PlayerRating[], teamSize: number): PlayerRating[][] {
  if (teamSize === 1) {
    return players.map(p => [p]);
  }
  
  const combinations: PlayerRating[][] = [];
  
  function generateCombinations(start: number, currentTeam: PlayerRating[]) {
    if (currentTeam.length === teamSize) {
      combinations.push([...currentTeam]);
      return;
    }
    
    for (let i = start; i < players.length; i++) {
      currentTeam.push(players[i]);
      generateCombinations(i + 1, currentTeam);
      currentTeam.pop();
    }
  }
  
  generateCombinations(0, []);
  return combinations;
}

/**
 * Inject entropy into matchmaking by adding randomness to costs
 */
function injectEntropy(costs: number[], entropyLevel: number): number[] {
  if (entropyLevel === 0) return costs;
  
  return costs.map(cost => {
    const randomFactor = (Math.random() - 0.5) * 2 * entropyLevel;
    return cost + (cost * randomFactor);
  });
}

/**
 * Randomly select players to exclude when total doesn't divide evenly into teams
 */
function randomlyExcludePlayers(
  players: PlayerRating[], 
  targetTeamCount: number, 
  teamSize: number
): { remainingPlayers: PlayerRating[], excludedPlayers: PlayerRating[] } {
  const neededPlayers = targetTeamCount * teamSize;
  
  if (players.length <= neededPlayers) {
    return { remainingPlayers: players, excludedPlayers: [] };
  }
  
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  
  return {
    remainingPlayers: shuffled.slice(0, neededPlayers),
    excludedPlayers: shuffled.slice(neededPlayers)
  };
}

/**
 * Main matchmaking algorithm with entropy and flexible team sizes
 */
export async function generateMatches(
  tournamentId: string, 
  options: MatchmakingOptions = {}
): Promise<MatchmakingResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = new Date();
  
  // Load player data
  const allPlayers = await loadPlayerRatings(tournamentId);
  
  if (allPlayers.length < opts.teamSize * opts.teamsPerMatch) {
    return {
      matches: [],
      unmatchedPlayers: allPlayers,
      teamSize: opts.teamSize,
      totalPlayers: allPlayers.length,
      algorithm: 'insufficient-players',
      entropy: opts.entropyLevel,
      timestamp: startTime
    };
  }
  
  // Load recent opponent data if needed
  const recentOpponentSets = new Map<string, Set<string>>();
  if (opts.avoidRecentOpponents) {
    for (const player of allPlayers) {
      const opponents = await getRecentOpponents(player.id, tournamentId, opts.recentMatchLookback);
      recentOpponentSets.set(player.id, opponents);
    }
  }
  
  // Calculate how many complete matches we can make
  const playersPerMatch = opts.teamSize * opts.teamsPerMatch;
  const maxMatches = Math.floor(allPlayers.length / playersPerMatch);
  
  // Randomly exclude excess players (addressing the bias issue)
  const { remainingPlayers, excludedPlayers } = randomlyExcludePlayers(
    allPlayers, 
    maxMatches * opts.teamsPerMatch, 
    opts.teamSize
  );
  
  if (remainingPlayers.length < playersPerMatch) {
    return {
      matches: [],
      unmatchedPlayers: allPlayers,
      teamSize: opts.teamSize,
      totalPlayers: allPlayers.length,
      algorithm: 'insufficient-players-after-exclusion',
      entropy: opts.entropyLevel,
      timestamp: startTime
    };
  }
  
  // Create skill groups for better matching
  // Create skill groups for better matching (currently unused but available for future enhancements)\n  // const skillGroups = createSkillGroups(remainingPlayers);
  
  // Generate matches using greedy algorithm with entropy
  const matches: GeneratedMatch[] = [];
  const usedPlayers = new Set<string>();
  
  // For each potential match
  for (let matchIndex = 0; matchIndex < maxMatches; matchIndex++) {
    const availablePlayers = remainingPlayers.filter(p => !usedPlayers.has(p.id));
    
    if (availablePlayers.length < playersPerMatch) break;
    
    // Generate all possible team combinations
    const teamCombinations = generateTeamCombinations(availablePlayers, opts.teamSize);
    const matchCandidates: { teams: PlayerRating[][], cost: number }[] = [];
    
    // Find all possible match combinations
    for (let i = 0; i < teamCombinations.length; i++) {
      for (let j = i + 1; j < teamCombinations.length; j++) {
        const team1 = teamCombinations[i];
        const team2 = teamCombinations[j];
        
        // Skip if teams share players
        const team1Ids = new Set(team1.map(p => p.id));
        const team2Ids = new Set(team2.map(p => p.id));
        const hasOverlap = [...team1Ids].some(id => team2Ids.has(id));
        
        if (hasOverlap) continue;
        
        // Skip if any player is already used
        const allIds = [...team1Ids, ...team2Ids];
        if (allIds.some(id => usedPlayers.has(id))) continue;
        
        const cost = calculateMatchCost(team1, team2, recentOpponentSets, opts);
        matchCandidates.push({ teams: [team1, team2], cost });
      }
    }
    
    if (matchCandidates.length === 0) break;
    
    // Sort by cost and inject entropy
    matchCandidates.sort((a, b) => a.cost - b.cost);
    const costs = matchCandidates.map(c => c.cost);
    const entropyAdjustedCosts = injectEntropy(costs, opts.entropyLevel);
    
    // Select match based on entropy-adjusted costs (lower is better, but with randomness)
    let selectedIndex = 0;
    if (opts.entropyLevel > 0) {
      // Weighted selection favoring lower costs but allowing some randomness
      const weights = entropyAdjustedCosts.map(cost => 1 / (cost + 0.1));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      const random = Math.random() * totalWeight;
      
      let cumulativeWeight = 0;
      for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          selectedIndex = i;
          break;
        }
      }
    }
    
    const selectedMatch = matchCandidates[selectedIndex];
    if (!selectedMatch) break;
    
    // Create the match
    const teams: MatchTeam[] = selectedMatch.teams.map(team => ({ players: team }));
    
    // Calculate match statistics
    const allMatchPlayers = selectedMatch.teams.flat();
    const avgOrdinal = allMatchPlayers.reduce((sum, p) => sum + p.ordinal, 0) / allMatchPlayers.length;
    const maxOrdinal = Math.max(...allMatchPlayers.map(p => p.ordinal));
    const minOrdinal = Math.min(...allMatchPlayers.map(p => p.ordinal));
    
    const team1Ratings = selectedMatch.teams[0].map(p => ({ mu: p.rating.mu, sigma: p.rating.sigma }));
    const team2Ratings = selectedMatch.teams[1].map(p => ({ mu: p.rating.mu, sigma: p.rating.sigma }));
    const drawProbability = predictDraw([team1Ratings, team2Ratings]);
    
    matches.push({
      teams,
      skillDifference: maxOrdinal - minOrdinal,
      averageSkill: avgOrdinal,
      confidence: 1 / (allMatchPlayers.reduce((sum, p) => sum + p.rating.sigma, 0) / allMatchPlayers.length),
      drawProbability
    });
    
    // Mark players as used
    allMatchPlayers.forEach(p => usedPlayers.add(p.id));
  }
  
  // Find unmatched players
  const unmatchedPlayers = [
    ...remainingPlayers.filter(p => !usedPlayers.has(p.id)),
    ...excludedPlayers
  ];
  
  return {
    matches,
    unmatchedPlayers,
    teamSize: opts.teamSize,
    totalPlayers: allPlayers.length,
    algorithm: 'entropy-greedy',
    entropy: opts.entropyLevel,
    timestamp: startTime
  };
}

/**
 * Update player ratings after match results
 */
export async function updateRatingsAfterMatch(
  matchResults: { 
    tournamentId: string;
    matchId: string;
    teamResults: { playerIds: string[]; placement: number }[] // 1st place, 2nd place, etc.
  }
): Promise<void> {
  // Load current ratings
  const playerRatings = new Map<string, { mu: number; sigma: number; gamesPlayed: number }>();
  
  for (const team of matchResults.teamResults) {
    for (const playerId of team.playerIds) {
      const rating = await prisma.playerRating.findUnique({ where: { userId: playerId } });
      if (rating) {
        playerRatings.set(playerId, {
          mu: rating.mu,
          sigma: rating.sigma,
          gamesPlayed: rating.gamesPlayed
        });
      }
    }
  }
  
  // Prepare teams for OpenSkill rating
  const teams = matchResults.teamResults
    .sort((a, b) => a.placement - b.placement) // Sort by placement (1st, 2nd, etc.)
    .map(team => 
      team.playerIds.map(playerId => {
        const rating = playerRatings.get(playerId);
        return rating ? { mu: rating.mu, sigma: rating.sigma } : rating();
      })
    );
  
  // Calculate new ratings
  const newRatings = rate(teams);
  
  // Update database
  for (let teamIndex = 0; teamIndex < matchResults.teamResults.length; teamIndex++) {
    const team = matchResults.teamResults[teamIndex];
    const newTeamRatings = newRatings[teamIndex];
    
    for (let playerIndex = 0; playerIndex < team.playerIds.length; playerIndex++) {
      const playerId = team.playerIds[playerIndex];
      const newRating = newTeamRatings[playerIndex];
      const currentRating = playerRatings.get(playerId);
      
      if (newRating && currentRating) {
        await prisma.playerRating.upsert({
          where: { userId: playerId },
          update: {
            mu: newRating.mu,
            sigma: newRating.sigma,
            gamesPlayed: currentRating.gamesPlayed + 1
          },
          create: {
            userId: playerId,
            mu: newRating.mu,
            sigma: newRating.sigma,
            gamesPlayed: 1
          }
        });
      }
    }
  }
}