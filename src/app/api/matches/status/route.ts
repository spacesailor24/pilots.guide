import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    // Check admin permission
    await requireAdmin();

    const now = new Date();

    // Get active matches (haven't ended yet)
    const activeMatches = await prisma.match.findMany({
      where: {
        OR: [
          { endTime: null }, // No end time specified
          { endTime: { gt: now } }, // End time is in the future
        ],
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
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Get completed matches (have ended)
    const completedMatches = await prisma.match.findMany({
      where: {
        endTime: {
          lte: now, // End time is in the past
        },
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
      },
      orderBy: {
        startTime: "desc", // Most recent first
      },
    });

    return NextResponse.json({
      activeMatches,
      completedMatches,
    });
  } catch (error: any) {
    if (error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Failed to fetch matches by status:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}