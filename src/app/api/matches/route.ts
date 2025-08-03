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
    const { matchName, startDateTime, endDateTime, selectedPlayers } = body;

    if (!matchName || !startDateTime || !selectedPlayers?.length) {
      return NextResponse.json(
        { error: "Missing required fields: matchName, startDateTime, selectedPlayers" },
        { status: 400 }
      );
    }

    // Create the match
    const match = await prisma.match.create({
      data: {
        name: matchName,
        startTime: new Date(startDateTime),
        endTime: endDateTime ? new Date(endDateTime) : null,
        createdBy: session.user.id,
        players: {
          create: selectedPlayers.map((playerId: string) => ({
            userId: playerId,
          })),
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
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error: any) {
    if (error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    
    console.error("Failed to create match:", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
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
        startTime: "desc",
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}