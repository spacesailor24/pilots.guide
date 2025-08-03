import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ships - Get all ships
export async function GET() {
  try {
    const ships = await prisma.ship.findMany({
      include: {
        builds: {
          where: {
            verified: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(ships);
  } catch (error) {
    console.error("Failed to fetch ships:", error);
    return NextResponse.json(
      { error: "Failed to fetch ships" },
      { status: 500 }
    );
  }
}

// POST /api/ships - Create a new ship (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipId, name, category, imagePath, maxCrew } = body;

    // TODO: Add admin authentication check here
    
    const ship = await prisma.ship.create({
      data: {
        shipId,
        name,
        category,
        imagePath,
        maxCrew: maxCrew || 1,
      },
    });

    return NextResponse.json(ship, { status: 201 });
  } catch (error) {
    console.error("Failed to create ship:", error);
    return NextResponse.json(
      { error: "Failed to create ship" },
      { status: 500 }
    );
  }
}