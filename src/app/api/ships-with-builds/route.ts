import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ships-with-builds - Get ships that have builds
export async function GET() {
  try {
    const ships = await prisma.ship.findMany({
      where: {
        builds: {
          some: {},
        },
      },
      select: {
        id: true,
        shipId: true,
        name: true,
        category: true,
        _count: {
          select: {
            builds: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(ships);
  } catch (error) {
    console.error("Failed to fetch ships with builds:", error);
    return NextResponse.json(
      { error: "Failed to fetch ships with builds" },
      { status: 500 }
    );
  }
}