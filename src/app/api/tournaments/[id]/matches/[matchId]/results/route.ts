import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateRatingsAfterMatch } from "@/lib/matchmaking";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; matchId: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: tournamentId, matchId } = await params;
    const body = await request.json();

    // Validate the tournament and match exist
    const match = await prisma.match.findUnique({
      where: { 
        id: matchId,
        tournamentId: tournamentId 
      },
      include: {
        tournament: {
          select: {
            id: true,
            createdBy: true
          }
        }
      }
    });

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    // Check if the user is the tournament creator
    if (match.tournament.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Only the tournament creator can submit match results" },
        { status: 403 }
      );
    }

    // Validate request body structure - expecting winning team ID
    if (!body.winningTeamId || typeof body.winningTeamId !== 'string') {
      return NextResponse.json(
        { error: "Invalid request body. Expected winningTeamId string" },
        { status: 400 }
      );
    }

    // Get match teams to validate the winning team belongs to this match
    const matchTeams = await prisma.matchTeam.findMany({
      where: { matchId },
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

    const winningTeam = matchTeams.find(team => team.id === body.winningTeamId);
    if (!winningTeam) {
      return NextResponse.json(
        { error: "Invalid winning team ID" },
        { status: 400 }
      );
    }

    // Update team placements in database
    for (let i = 0; i < matchTeams.length; i++) {
      const team = matchTeams[i];
      const placement = team.id === body.winningTeamId ? 1 : 2; // Winner gets 1st, others get 2nd
      
      await prisma.matchTeam.update({
        where: { id: team.id },
        data: { placement }
      });
    }

    // Create team results for rating system
    const teamResults = matchTeams.map(team => ({
      playerIds: team.players.map(p => p.userId),
      placement: team.id === body.winningTeamId ? 1 : 2
    }));

    // Update player ratings based on match results
    await updateRatingsAfterMatch({
      tournamentId,
      matchId,
      teamResults
    });

    // Create a round with the results
    if (body.createRound !== false) {
      const firstWinningPlayer = winningTeam.players[0];
      if (firstWinningPlayer) {
        await prisma.round.create({
          data: {
            matchId: matchId,
            roundNumber: 1, // Simple single round for now
            startTime: new Date(),
            endTime: new Date(),
            winnerId: firstWinningPlayer.userId // Use first player from winning team
          }
        });
      }
    }

    // Return updated player ratings for the participants
    const allPlayerIds = matchTeams.flatMap(team => team.players.map(p => p.userId));
    const updatedRatings = await prisma.playerRating.findMany({
      where: {
        userId: { in: allPlayerIds }
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Match results submitted and ratings updated",
      updatedRatings: updatedRatings.map(rating => ({
        userId: rating.userId,
        displayName: rating.user.displayName,
        mu: rating.mu,
        sigma: rating.sigma,
        gamesPlayed: rating.gamesPlayed,
        ordinal: (rating.mu - 3 * rating.sigma) // Conservative skill estimate
      }))
    });

  } catch (error) {
    console.error("Failed to submit match results:", error);
    return NextResponse.json(
      { error: "Failed to submit match results" },
      { status: 500 }
    );
  }
}