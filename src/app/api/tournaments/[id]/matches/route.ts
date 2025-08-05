import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

    // Get the tournament and verify the user is the creator
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        matches: {
          orderBy: { createdAt: 'asc' }
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

    // Generate match name based on existing matches
    const matchCount = tournament.matches.length;
    const matchName = matchCount === 0 
      ? "Match 1" 
      : `Match ${matchCount + 1}`;

    // Create the new match
    const newMatch = await prisma.match.create({
      data: {
        tournamentId: tournament.id,
        name: matchName,
        startTime: tournament.startTime, // Default to tournament start time
        endTime: tournament.endTime, // Default to tournament end time
      },
      include: {
        rounds: true,
      }
    });

    return NextResponse.json(newMatch, { status: 201 });
  } catch (error) {
    console.error("Failed to generate match:", error);
    return NextResponse.json(
      { error: "Failed to generate match" },
      { status: 500 }
    );
  }
}