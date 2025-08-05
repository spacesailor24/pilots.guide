import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ordinal } from "openskill";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const minGames = parseInt(searchParams.get("minGames") || "0");

    // Get player ratings with user information
    const playerRatings = await prisma.playerRating.findMany({
      where: {
        gamesPlayed: {
          gte: minGames
        }
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            image: true,
            claimed: true
          }
        }
      },
      skip: offset,
      take: limit
    });

    // Calculate ordinals and sort by skill
    const rankedPlayers = playerRatings
      .map(rating => ({
        userId: rating.userId,
        displayName: rating.user.displayName,
        image: rating.user.image,
        claimed: rating.user.claimed,
        mu: rating.mu,
        sigma: rating.sigma,
        gamesPlayed: rating.gamesPlayed,
        ordinal: ordinal({ mu: rating.mu, sigma: rating.sigma }),
        conservativeRating: rating.mu - 3 * rating.sigma, // 99.7% confidence lower bound
        lastUpdated: rating.updatedAt
      }))
      .sort((a, b) => b.ordinal - a.ordinal); // Sort by ordinal descending (best first)

    // Add rank numbers
    const rankedWithPosition = rankedPlayers.map((player, index) => ({
      ...player,
      rank: offset + index + 1
    }));

    // Get total count for pagination
    const totalCount = await prisma.playerRating.count({
      where: {
        gamesPlayed: {
          gte: minGames
        }
      }
    });

    return NextResponse.json({
      players: rankedWithPosition,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      filters: {
        minGames
      }
    });

  } catch (error) {
    console.error("Failed to fetch player rankings:", error);
    return NextResponse.json(
      { error: "Failed to fetch player rankings" },
      { status: 500 }
    );
  }
}

// Get specific player rating and rank
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get the specific player's rating
    const playerRating = await prisma.playerRating.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            image: true,
            claimed: true
          }
        }
      }
    });

    if (!playerRating) {
      return NextResponse.json(
        { error: "Player rating not found" },
        { status: 404 }
      );
    }

    // Calculate how many players have higher ordinal (for ranking)
    const playerOrdinal = ordinal({ mu: playerRating.mu, sigma: playerRating.sigma });
    
    const playersWithHigherRating = await prisma.playerRating.count({
      where: {
        OR: [
          { mu: { gt: playerRating.mu } },
          {
            AND: [
              { mu: playerRating.mu },
              { sigma: { lt: playerRating.sigma } } // Lower uncertainty = higher rank when mu is equal
            ]
          }
        ]
      }
    });

    const rank = playersWithHigherRating + 1;

    return NextResponse.json({
      userId: playerRating.userId,
      displayName: playerRating.user.displayName,
      image: playerRating.user.image,
      claimed: playerRating.user.claimed,
      mu: playerRating.mu,
      sigma: playerRating.sigma,
      gamesPlayed: playerRating.gamesPlayed,
      ordinal: playerOrdinal,
      conservativeRating: playerRating.mu - 3 * playerRating.sigma,
      rank,
      lastUpdated: playerRating.updatedAt
    });

  } catch (error) {
    console.error("Failed to fetch player rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch player rating" },
      { status: 500 }
    );
  }
}