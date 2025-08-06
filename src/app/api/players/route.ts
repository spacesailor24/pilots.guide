import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const players = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        image: true,
        claimed: true,
      },
    });

    // Sort case-insensitively by displayName
    const sortedPlayers = players.sort((a, b) => {
      const nameA = a.displayName?.toLowerCase() || '';
      const nameB = b.displayName?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });

    return NextResponse.json(sortedPlayers);
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { displayName, claimed = false } = body;

    if (!displayName || typeof displayName !== "string") {
      return NextResponse.json(
        { error: "displayName is required and must be a string" },
        { status: 400 }
      );
    }

    // Check if a player with this displayName already exists
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

    // Create the new unclaimed player
    const newPlayer = await prisma.user.create({
      data: {
        displayName: displayName.trim(),
        claimed,
        username: null,
        image: null,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        image: true,
        claimed: true,
      }
    });

    return NextResponse.json(newPlayer);
  } catch (error) {
    console.error("Failed to create player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}