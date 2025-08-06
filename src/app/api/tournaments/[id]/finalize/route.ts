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
      select: {
        id: true,
        createdBy: true,
        finalized: true
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
        { error: "Only the tournament creator can finalize the tournament" },
        { status: 403 }
      );
    }

    // Check if tournament is already finalized
    if (tournament.finalized) {
      return NextResponse.json(
        { error: "Tournament is already finalized" },
        { status: 400 }
      );
    }

    // Update tournament to set finalized flag
    const updatedTournament = await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        finalized: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Tournament finalized successfully",
      tournament: {
        id: updatedTournament.id,
        finalized: updatedTournament.finalized
      }
    });

  } catch (error) {
    console.error("Failed to finalize tournament:", error);
    return NextResponse.json(
      { error: "Failed to finalize tournament" },
      { status: 500 }
    );
  }
}