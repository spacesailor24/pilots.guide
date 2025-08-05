import AppLayout from "@/components/AppLayout";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShipBuildClient from "./ShipBuildClient";

interface Build {
  id: string;
  buildName: string;
  creator: string;
  erkulUrl: string;
  description: string | null;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  patch: {
    id: string;
    version: string;
    name: string | null;
  };
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface Ship {
  id: string;
  shipId: string;
  name: string;
  category: string;
  imagePath: string | null;
  maxCrew: number;
  builds: Build[];
}

async function getShipWithBuilds(shipId: string): Promise<Ship | null> {
  try {
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
                username: true,
                displayName: true,
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

    return ship as any;
  } catch (error) {
    console.error("Failed to fetch ship with builds:", error);
    return null;
  }
}

export default async function ShipBuildPage({
  params,
}: {
  params: Promise<{ shipId: string }>;
}) {
  const { shipId } = await params;
  const ship = await getShipWithBuilds(shipId);

  if (!ship || ship.builds.length === 0) {
    notFound();
  }

  return (
    <AppLayout>
      <ShipBuildClient ship={ship} />
    </AppLayout>
  );
}