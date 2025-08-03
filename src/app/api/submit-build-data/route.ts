import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/submit-build-data - Get all data needed for submit build form
export async function GET() {
  try {
    const [ships, categories, patches] = await Promise.all([
      prisma.ship.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.patch.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return NextResponse.json({
      ships,
      categories,
      patches,
    });
  } catch (error) {
    console.error("Failed to fetch submit build data:", error);
    return NextResponse.json(
      { error: "Failed to fetch submit build data" },
      { status: 500 }
    );
  }
}