import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ships/[shipId] - Get ship with builds
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shipId: string }> }
) {
  try {
    const { shipId } = await params;
    const ship = await prisma.ship.findUnique({
      where: { shipId },
      include: {
        builds: {
          include: {
            category: true,
            patch: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: [
            { featured: "desc" },
            { createdAt: "desc" },
          ],
        },
      },
    });

    if (!ship) {
      return NextResponse.json(
        { error: "Ship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ship);
  } catch (error) {
    console.error("Failed to fetch ship:", error);
    return NextResponse.json(
      { error: "Failed to fetch ship" },
      { status: 500 }
    );
  }
}