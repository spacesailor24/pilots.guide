import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateMatches, MatchmakingOptions } from "@/lib/matchmaking";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: tournamentId } = await params;
    const body = await request.json().catch(() => ({})); // Parse body if provided

    // Get the tournament and verify the user is the creator
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        matches: {
          select: {
            id: true,
            name: true,
            generationRound: true
          },
          orderBy: { createdAt: 'asc' }
        },
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
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    // Check if the user is the tournament creator
    if (tournament.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Only the tournament creator can generate matches" },
        { status: 403 }
      );
    }

    // Check if tournament is still active
    const now = new Date();
    if (tournament.endTime && tournament.endTime < now) {
      return NextResponse.json(
        { error: "Cannot generate matches for completed tournaments" },
        { status: 400 }
      );
    }

    // Check if tournament has enough players
    if (tournament.players.length < 2) {
      return NextResponse.json(
        { error: "Tournament needs at least 2 players to generate matches" },
        { status: 400 }
      );
    }

    // Parse matchmaking options from request body
    const matchmakingOptions: MatchmakingOptions = {
      teamSize: body.teamSize || 1, // Default to 1v1
      teamsPerMatch: body.teamsPerMatch || 2,
      entropyLevel: body.entropyLevel !== undefined ? body.entropyLevel : 0.3,
      maxSkillGap: body.maxSkillGap || 5.0,
      avoidRecentOpponents: body.avoidRecentOpponents !== false, // Default true
      recentMatchLookback: body.recentMatchLookback || 3
    };

    // Generate matches using the improved matchmaking system
    const matchmakingResult = await generateMatches(tournamentId, matchmakingOptions);

    if (matchmakingResult.matches.length === 0) {
      return NextResponse.json(
        { 
          error: "No matches could be generated",
          details: {
            algorithm: matchmakingResult.algorithm,
            totalPlayers: matchmakingResult.totalPlayers,
            unmatchedPlayers: matchmakingResult.unmatchedPlayers.length
          }
        },
        { status: 400 }
      );
    }

    // Determine the next generation round
    const maxGenerationRound = tournament.matches.length > 0 
      ? Math.max(...tournament.matches.map(m => m.generationRound || 1))
      : 0;
    const nextGenerationRound = maxGenerationRound + 1;

    // Create matches in database
    const createdMatches = [];
    const matchCount = tournament.matches.length;

    for (let i = 0; i < matchmakingResult.matches.length; i++) {
      const generatedMatch = matchmakingResult.matches[i];
      const matchName = matchmakingResult.matches.length === 1 
        ? `Match ${matchCount + 1}`
        : `Match ${matchCount + 1 + i}`;

      // Create the match with teams
      const newMatch = await prisma.match.create({
        data: {
          tournamentId: tournament.id,
          name: matchName,
          generationRound: nextGenerationRound,
          startTime: tournament.startTime,
          endTime: tournament.endTime,
          teams: {
            create: generatedMatch.teams.map((team, teamIndex) => ({
              name: `Team ${String.fromCharCode(65 + teamIndex)}`, // Team A, Team B, etc.
              players: {
                create: team.players.map(player => ({
                  userId: player.id
                }))
              }
            }))
          }
        },
        include: {
          rounds: true,
          teams: {
            include: {
              players: {
                include: {
                  user: {
                    select: {
                      id: true,
                      displayName: true,
                      image: true,
                      claimed: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      createdMatches.push({
        ...newMatch,
        matchmakingInfo: {
          teams: generatedMatch.teams.map(team => ({
            players: team.players.map(p => ({
              id: p.id,
              displayName: p.displayName,
              ordinal: p.ordinal
            }))
          })),
          skillDifference: generatedMatch.skillDifference,
          averageSkill: generatedMatch.averageSkill,
          confidence: generatedMatch.confidence,
          drawProbability: generatedMatch.drawProbability
        }
      });
    }

    // Return the created matches with matchmaking information
    return NextResponse.json({
      matches: createdMatches,
      matchmakingResult: {
        algorithm: matchmakingResult.algorithm,
        entropy: matchmakingResult.entropy,
        totalPlayers: matchmakingResult.totalPlayers,
        unmatchedPlayers: matchmakingResult.unmatchedPlayers.map(p => ({
          id: p.id,
          displayName: p.displayName,
          ordinal: p.ordinal
        })),
        teamSize: matchmakingResult.teamSize
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to generate match:", error);
    return NextResponse.json(
      { error: "Failed to generate match" },
      { status: 500 }
    );
  }
}