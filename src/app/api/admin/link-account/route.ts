import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";

export async function POST(request: NextRequest) {
  try {
    // Check admin permission
    await requireAdmin();

    const body = await request.json();
    const { discordUserId, playerAccountId } = body;

    if (!discordUserId || !playerAccountId) {
      return NextResponse.json(
        { error: "discordUserId and playerAccountId are required" },
        { status: 400 }
      );
    }

    // Get the Discord user and player account
    const discordUser = await prisma.user.findUnique({
      where: { id: discordUserId },
      select: { id: true, username: true, displayName: true, image: true },
    });

    const playerAccount = await prisma.user.findUnique({
      where: { id: playerAccountId },
      select: { id: true, displayName: true, claimed: true },
    });

    if (!discordUser) {
      return NextResponse.json(
        { error: "Discord user not found" },
        { status: 404 }
      );
    }

    if (!playerAccount) {
      return NextResponse.json(
        { error: "Player account not found" },
        { status: 404 }
      );
    }

    if (playerAccount.claimed) {
      return NextResponse.json(
        { error: "Player account is already claimed" },
        { status: 400 }
      );
    }

    // Transfer displayName from player account to Discord user and delete player account
    await prisma.$transaction(async (tx) => {
      // Update Discord user with player's displayName and mark as claimed
      await tx.user.update({
        where: { id: discordUserId },
        data: {
          displayName: playerAccount.displayName,
          claimed: true,
        },
      });

      // Transfer any builds that were created under the player's displayName
      if (playerAccount.displayName) {
        await tx.build.updateMany({
          where: {
            creator: playerAccount.displayName,
            userId: null,
          },
          data: {
            userId: discordUserId,
          },
        });
      }

      // Transfer any match participations
      await tx.matchParticipant.updateMany({
        where: {
          userId: playerAccountId,
        },
        data: {
          userId: discordUserId,
        },
      });

      // Delete the player account (it's no longer needed)
      await tx.user.delete({
        where: { id: playerAccountId },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Successfully linked ${discordUser.username} to ${playerAccount.displayName}`,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Failed to link accounts:", error);
    return NextResponse.json(
      { error: "Failed to link accounts" },
      { status: 500 }
    );
  }
}