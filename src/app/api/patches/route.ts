import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/patches - Get all active patches
export async function GET() {
  try {
    const patches = await prisma.patch.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(patches);
  } catch (error) {
    console.error("Failed to fetch patches:", error);
    return NextResponse.json(
      { error: "Failed to fetch patches" },
      { status: 500 }
    );
  }
}