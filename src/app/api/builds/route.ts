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

    const where: {
      shipId?: string;
      featured?: boolean;
      userId?: string;
    } = {};
    
    if (shipId) where.shipId = shipId;
    if (featured === "true") where.featured = true;
    if (userId) where.userId = userId;

    const builds = await prisma.build.findMany({
      where,
      include: {
        ship: true,
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
      categoryId,
      patchId,
      erkulUrl,
      description,
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

    // Verify the category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Verify the patch exists
    const patch = await prisma.patch.findUnique({
      where: { id: patchId },
    });

    if (!patch) {
      return NextResponse.json(
        { error: "Patch not found" },
        { status: 404 }
      );
    }

    const build = await prisma.build.create({
      data: {
        buildName,
        creator,
        userId: session?.user?.id,
        shipId,
        categoryId,
        patchId,
        erkulUrl,
        description,
      },
      include: {
        ship: true,
        category: true,
        patch: true,
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