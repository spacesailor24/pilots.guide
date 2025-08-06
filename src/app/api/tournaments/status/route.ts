import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    // Check admin permission
    await requireAdmin();

    // Get active tournaments (not finalized)
    const activeTournaments = await prisma.tournament.findMany({
      where: {
        finalized: false,
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
      orderBy: {
        startTime: "asc",
      },
    });

    // Get completed tournaments (finalized)
    const completedTournaments = await prisma.tournament.findMany({
      where: {
        finalized: true,
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
      orderBy: {
        startTime: "desc", // Most recent first
      },
    });

    return NextResponse.json({
      activeTournaments,
      completedTournaments,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Failed to fetch tournaments by status:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}