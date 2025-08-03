import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    // Check admin permission
    await requireAdmin();

    // Get unclaimed player accounts
    const unclaimedAccounts = await prisma.user.findMany({
      where: {
        claimed: false,
        username: null, // These are the seeded players
      },
      select: {
        id: true,
        displayName: true,
        claimed: true,
      },
      orderBy: {
        displayName: "asc",
      },
    });

    // Get Discord users who have signed in
    const discordUsers = await prisma.user.findMany({
      where: {
        username: { not: null }, // These are users who signed in with Discord
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        claimed: true,
        image: true,
      },
      orderBy: {
        username: "asc",
      },
    });

    return NextResponse.json({
      unclaimedAccounts,
      discordUsers,
    });
  } catch (error: any) {
    if (error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Failed to fetch admin accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}