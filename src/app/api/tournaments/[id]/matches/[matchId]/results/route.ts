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

    // Validate request body structure
    if (!body.teamResults || !Array.isArray(body.teamResults)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected teamResults array" },
        { status: 400 }
      );
    }

    // Validate each team result
    for (const team of body.teamResults) {
      if (!Array.isArray(team.playerIds) || typeof team.placement !== 'number') {
        return NextResponse.json(
          { error: "Each team must have playerIds array and placement number" },
          { status: 400 }
        );
      }
    }

    // Update player ratings based on match results
    await updateRatingsAfterMatch({
      tournamentId,
      matchId,
      teamResults: body.teamResults
    });

    // Optionally create a round with the results
    if (body.createRound !== false) {
      const winningTeam = body.teamResults.find((team: any) => team.placement === 1);
      if (winningTeam && winningTeam.playerIds.length > 0) {
        await prisma.round.create({
          data: {
            matchId: matchId,
            roundNumber: 1, // Simple single round for now
            startTime: new Date(),
            endTime: new Date(),
            winnerId: winningTeam.playerIds[0] // Use first player from winning team
          }
        });
      }
    }

    // Return updated player ratings for the participants
    const allPlayerIds = body.teamResults.flatMap((team: any) => team.playerIds);
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