import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/builds - Get all builds with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shipId = searchParams.get("shipId");
    const featured = searchParams.get("featured");
    const userId = searchParams.get("userId");

    const where: any = {};
    
    if (shipId) where.shipId = shipId;
    if (featured === "true") where.featured = true;
    if (userId) where.userId = userId;

    const builds = await prisma.build.findMany({
      where,
      include: {
        ship: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(builds);
  } catch (error) {
    console.error("Failed to fetch builds:", error);
    return NextResponse.json(
      { error: "Failed to fetch builds" },
      { status: 500 }
    );
  }
}

// POST /api/builds - Create a new build
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    
    const {
      buildName,
      creator,
      shipId,
      erkulUrl,
      description,
      category,
      gameMode,
      patch,
    } = body;

    // Verify the ship exists
    const ship = await prisma.ship.findUnique({
      where: { id: shipId },
    });

    if (!ship) {
      return NextResponse.json(
        { error: "Ship not found" },
        { status: 404 }
      );
    }

    const build = await prisma.build.create({
      data: {
        buildName,
        creator,
        userId: session?.user?.id,
        shipId,
        erkulUrl,
        description,
        category,
        gameMode,
        patch,
        verified: false, // Builds need to be verified by admin
      },
      include: {
        ship: true,
        user: true,
      },
    });

    return NextResponse.json(build, { status: 201 });
  } catch (error) {
    console.error("Failed to create build:", error);
    return NextResponse.json(
      { error: "Failed to create build" },
      { status: 500 }
    );
  }
}