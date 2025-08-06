import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            displayName: true,
            image: true,
          },
        },
        players: {
          where: {
            active: true
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                image: true,
                claimed: true,
              },
            },
          },
        },
        matches: {
          include: {
            rounds: {
              include: {
                winner: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    image: true,
                  },
                },
              },
            },
            teams: {
              include: {
                players: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        username: true,
                        displayName: true,
                        image: true,
                        claimed: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: [
            { generationRound: "asc" },
            { startTime: "asc" }
          ],
        },
      },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tournament);
  } catch (error: unknown) {
    console.error("Failed to fetch tournament:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament" },
      { status: 500 }
    );
  }
}