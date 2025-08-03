import { NextResponse } from "next/server";
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