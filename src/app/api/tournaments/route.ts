import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  try {
    // Check admin permission first
    await requireAdmin();
    
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tournamentName, startDateTime, endDateTime, selectedPlayers } = body;

    if (!tournamentName || !startDateTime || !selectedPlayers?.length) {
      return NextResponse.json(
        { error: "Missing required fields: tournamentName, startDateTime, selectedPlayers" },
        { status: 400 }
      );
    }

    // Create the tournament
    const tournament = await prisma.tournament.create({
      data: {
        name: tournamentName,
        startTime: new Date(startDateTime),
        endTime: endDateTime ? new Date(endDateTime) : null,
        createdBy: session.user.id,
        players: {
          create: selectedPlayers.map((playerId: string) => ({
            userId: playerId,
          })),
        },
        // Matches will be created dynamically using the generate match endpoint
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                image: true,
              },
            },
          },
        },
        matches: {
          include: {
            rounds: true,
          },
        },
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    
    console.error("Failed to create tournament:", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                image: true,
              },
            },
          },
        },
        matches: {
          include: {
            rounds: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error("Failed to fetch tournaments:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}