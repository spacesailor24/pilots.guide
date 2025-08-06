import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Add player to tournament
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const body = await request.json();
    const { playerId, createPlayer } = body;

    // Check if tournament exists and is not finalized
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    if (tournament.finalized) {
      return NextResponse.json(
        { error: "Cannot modify finalized tournament" },
        { status: 400 }
      );
    }

    let playerToAdd;

    // If createPlayer is provided, create new player first
    if (createPlayer) {
      const { displayName } = createPlayer;
      
      if (!displayName || typeof displayName !== "string") {
        return NextResponse.json(
          { error: "displayName is required when creating a new player" },
          { status: 400 }
        );
      }

      // Check if player with this name already exists
      const existingPlayer = await prisma.user.findFirst({
        where: {
          displayName: {
            equals: displayName.trim(),
            mode: 'insensitive'
          }
        }
      });

      if (existingPlayer) {
        return NextResponse.json(
          { error: "A player with this name already exists" },
          { status: 409 }
        );
      }

      // Create new player
      playerToAdd = await prisma.user.create({
        data: {
          displayName: displayName.trim(),
          claimed: false,
          username: null,
          image: null,
        }
      });
    } else if (playerId) {
      // Use existing player
      playerToAdd = await prisma.user.findUnique({
        where: { id: playerId }
      });

      if (!playerToAdd) {
        return NextResponse.json(
          { error: "Player not found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Either playerId or createPlayer must be provided" },
        { status: 400 }
      );
    }

    // Check if player is already in tournament
    const existingTournamentPlayer = await prisma.tournamentPlayer.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId: playerToAdd.id
        }
      }
    });

    if (existingTournamentPlayer) {
      if (existingTournamentPlayer.active) {
        return NextResponse.json(
          { error: "Player is already in this tournament" },
          { status: 409 }
        );
      } else {
        // Reactivate the player
        await prisma.tournamentPlayer.update({
          where: {
            tournamentId_userId: {
              tournamentId,
              userId: playerToAdd.id
            }
          },
          data: { active: true }
        });
      }
    } else {
      // Add new tournament player
      await prisma.tournamentPlayer.create({
        data: {
          tournamentId,
          userId: playerToAdd.id,
          active: true
        }
      });
    }

    // Return the updated tournament with full structure
    const updatedTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
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
                claimed: true
              }
            }
          }
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
      }
    });

    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error("Failed to add player to tournament:", error);
    return NextResponse.json(
      { error: "Failed to add player to tournament" },
      { status: 500 }
    );
  }
}

// Remove player from tournament (set active: false to keep match history)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tournamentId } = await params;
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json(
        { error: "playerId is required" },
        { status: 400 }
      );
    }

    // Check if tournament exists and is not finalized
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    if (tournament.finalized) {
      return NextResponse.json(
        { error: "Cannot modify finalized tournament" },
        { status: 400 }
      );
    }

    // Check if player is in tournament
    const tournamentPlayer = await prisma.tournamentPlayer.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId: playerId
        }
      }
    });

    if (!tournamentPlayer) {
      return NextResponse.json(
        { error: "Player is not in this tournament" },
        { status: 404 }
      );
    }

    // Set player as inactive (keeps match history)
    await prisma.tournamentPlayer.update({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId: playerId
        }
      },
      data: { active: false }
    });

    // Return the updated tournament with full structure
    const updatedTournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
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
                claimed: true
              }
            }
          }
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
      }
    });

    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error("Failed to remove player from tournament:", error);
    return NextResponse.json(
      { error: "Failed to remove player from tournament" },
      { status: 500 }
    );
  }
}