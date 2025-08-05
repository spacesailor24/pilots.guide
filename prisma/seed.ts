import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "PvP", slug: "pvp", order: 1 },
  { name: "PvE", slug: "pve", order: 2 },
  { name: "PvPvE", slug: "pvpve", order: 3 },
  { name: "Stealth", slug: "stealth", order: 4 },
  { name: "Racing", slug: "racing", order: 5 },
  { name: "Cargo", slug: "cargo", order: 6 },
  { name: "Exploration", slug: "exploration", order: 7 },
  { name: "Multi-Role", slug: "multi-role", order: 8 },
  { name: "Interceptor", slug: "interceptor", order: 9 },
];

const patches = [
  { version: "4.2.1-LIVE.10007308", name: "4.2.1 Live", isActive: true, order: 1 },
];

const ships = [
  {
    shipId: "gladius",
    name: "Gladius",
    category: "Light Fighter",
    imagePath: "/images/gladius.png",
    maxCrew: 1,
  },
  {
    shipId: "arrow",
    name: "Arrow",
    category: "Light Fighter",
    imagePath: "/images/arrow.png",
    maxCrew: 1,
  },
  {
    shipId: "f8c-lightning",
    name: "F8C Lightning",
    category: "Heavy Fighter",
    imagePath: "/images/f8c.png",
    maxCrew: 1,
  },
  {
    shipId: "hornet-ghost-mkii",
    name: "F7C-S Hornet Ghost Mk II",
    category: "Medium Stealth Fighter",
    imagePath: "/images/hornet-mkii-ghost.png",
    maxCrew: 1,
  },
  {
    shipId: "hornet-super-mkii",
    name: "F7C-M Super Hornet Mk II",
    category: "Medium Fighter",
    imagePath: "/images/hornet-mkii-super.png",
    maxCrew: 2,
  },
  {
    shipId: "guardian-mx",
    name: "Guardian MX",
    category: "Heavy Missile Boat",
    imagePath: "/images/guardian-mx.png",
    maxCrew: 1,
  },
  {
    shipId: "guardian-qi",
    name: "Guardian QI",
    category: "Heavy Interdictor",
    imagePath: "/images/guardian-qi.png",
    maxCrew: 1,
  },
];

const builds = [
  // Gladius builds
  {
    buildName: "[PvP] Duel",
    creator: "bjax",
    shipSlug: "gladius",
    categorySlug: "pvp",
    patchSlug: "4.2.1-LIVE.10007308",
    erkulUrl: "https://www.erkul.games/loadout/FTu1RNIn",
    description: "",
    featured: false,
  },
  {
    buildName: "[PvP] Squadron Battle / PU",
    creator: "bjax",
    shipSlug: "gladius",
    categorySlug: "pvp",
    erkulUrl: "https://www.erkul.games/loadout/PBQ03dFh",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "",
    featured: true,
  },
  {
    buildName: "[PvE] PU",
    creator: "bjax",
    shipSlug: "gladius",
    categorySlug: "pve",
    erkulUrl: "https://www.erkul.games/loadout/AHo86SmZ",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "",
    featured: false,
  },
  {
    buildName: "PvP PU",
    creator: "spacesai1or",
    shipSlug: "gladius",
    categorySlug: "pvp",
    erkulUrl: "https://www.erkul.games/loadout/lrnkDPos",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "",
    featured: false,
  },

  // Arrow builds
  {
    buildName: "[PvE] PU",
    creator: "bjax",
    shipSlug: "arrow",
    categorySlug: "pve",
    erkulUrl: "https://www.erkul.games/loadout/DqLUKfXU",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "",
    featured: true,
  },

  // F8C Lightning builds
  {
    buildName: "Lightning Heavy Assault",
    creator: "WarHawk_21",
    shipSlug: "f8c-lightning",
    categorySlug: "pvp",
    erkulUrl: "https://www.erkul.games/loadout/JKL012",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "Heavy assault F8C build designed for sustained combat. Maximum firepower with reinforced defenses for prolonged engagements.",
    featured: true,
  },
  {
    buildName: "Lightning PvE Hunter",
    creator: "BountySeeker_88",
    shipSlug: "f8c-lightning",
    categorySlug: "pve",
    erkulUrl: "https://www.erkul.games/loadout/MNO345",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "PvE optimized F8C for bounty hunting and security missions. Balanced approach with good staying power for multiple targets.",
    featured: false,
  },

  // Hornet MK-2 Ghost builds
  {
    buildName: "Ghost Deep Strike",
    creator: "PhantomOps_55",
    shipSlug: "hornet-ghost-mkii",
    categorySlug: "stealth",
    erkulUrl: "https://www.erkul.games/loadout/PQR678",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "Advanced stealth Hornet Ghost build for deep penetration missions. Ultra-low signature with devastating alpha strike capability.",
    featured: true,
  },
  {
    buildName: "Ghost Interceptor",
    creator: "NightHunter_44",
    shipSlug: "hornet-ghost-mkii",
    categorySlug: "interceptor",
    erkulUrl: "https://www.erkul.games/loadout/STU901",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "High-speed interceptor variant focusing on target acquisition and elimination. Fast response with precision weapons.",
    featured: false,
  },

  // Super Hornet MK-2 builds
  {
    buildName: "[PvE] PU",
    creator: "bjax",
    shipSlug: "hornet-super-mkii",
    categorySlug: "pve",
    erkulUrl: "https://www.erkul.games/loadout/UHHXRd2b",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "",
    featured: true,
  },
  {
    buildName: "Purchaseable Components PU",
    creator: "bjax",
    shipSlug: "hornet-super-mkii",
    categorySlug: "pvpve",
    erkulUrl: "https://www.erkul.games/loadout/58HAnyqk",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "",
    featured: false,
  },

  // Guardian MX builds
  {
    buildName: "MX Missile Boat",
    creator: "RocketRain_11",
    shipSlug: "guardian-mx",
    categorySlug: "interceptor",
    erkulUrl: "https://www.erkul.games/loadout/BCD890",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "Pure missile boat configuration for the Guardian MX. Massive missile payload for eliminating high-value targets at range.",
    featured: true,
  },
  {
    buildName: "MX Multi-Role Support",
    creator: "SupportPilot_22",
    shipSlug: "guardian-mx",
    categorySlug: "multi-role",
    erkulUrl: "https://www.erkul.games/loadout/EFG123",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "Versatile Guardian MX build balancing missiles and guns. Great for both support roles and independent operations.",
    featured: false,
  },

  // Guardian QI builds
  {
    buildName: "QI Quantum Disruptor",
    creator: "Gatekeeper_77",
    shipSlug: "guardian-qi",
    categorySlug: "interceptor",
    erkulUrl: "https://www.erkul.games/loadout/HIJ456",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "Specialized Guardian QI for quantum interdiction and area control. Maximum EMP and quantum dampening capability.",
    featured: true,
  },
  {
    buildName: "QI Exploration Scout",
    creator: "StarSeeker_99",
    shipSlug: "guardian-qi",
    categorySlug: "exploration",
    erkulUrl: "https://www.erkul.games/loadout/KLM789",
    patchSlug: "4.2.1-LIVE.10007308",
    description: "Long-range exploration variant of the Guardian QI. Enhanced sensors and extended fuel capacity for deep space missions.",
    featured: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create permissions
  const adminPermission = await prisma.permission.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Allows access to admin features",
    },
  });
  console.log("✅ Created permission: ADMIN");

  // Active players list
  const players = [
    "bjax",
    "MrOldMaan",
    "ChicagoTed",
    "spacesai1or",
    "Cypher-1",
    "Lobus",
    "Apau11o",
    "PelicanHazard",
    "WinRAR42",
    "Zwoid",
    "Zero0721",
    "IntruderThree",
    "AltFour_Industries",
    "Mandoolk",
    "LaoPak",
    "SIGNCUTTER",
    "Nanolis",
    "Captain Maddog",
    "HarryComa",
    "Bloodangel92",
    "TangibleRaptor"
  ];

  // Create all players as unclaimed users
  for (const playerName of players) {
    await prisma.user.create({
      data: {
        username: null, // Will be filled when they sign in with Discord
        displayName: playerName, // The name we show in the app
        claimed: false,
        image: null,
      },
    });
    console.log(`✅ Created unclaimed user: ${playerName}`);
  }

  // Find spacesai1or user and grant admin permission
  const spacesailorUser = await prisma.user.findFirst({
    where: { displayName: "spacesai1or" }
  });

  if (spacesailorUser) {
    await prisma.userPermission.create({
      data: {
        userId: spacesailorUser.id,
        permissionId: adminPermission.id,
        grantedBy: "system",
      },
    });
    console.log("✅ Granted ADMIN permission to spacesai1or");
  }

  // Create categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✅ Created category: ${category.name}`);
  }

  // Create patches
  for (const patch of patches) {
    await prisma.patch.upsert({
      where: { version: patch.version },
      update: {},
      create: patch,
    });
    console.log(`✅ Created patch: ${patch.version}`);
  }

  // Create ships
  for (const ship of ships) {
    await prisma.ship.upsert({
      where: { shipId: ship.shipId },
      update: {},
      create: ship,
    });
    console.log(`✅ Created ship: ${ship.name}`);
  }

  // Get created data for builds
  const createdShips = await prisma.ship.findMany();
  const createdCategories = await prisma.category.findMany();
  const createdPatches = await prisma.patch.findMany();

  // Create builds using explicit definitions
  for (const buildData of builds) {
    const ship = createdShips.find(s => s.shipId === buildData.shipSlug);
    const category = createdCategories.find(c => c.slug === buildData.categorySlug);
    const patch = createdPatches.find(p => p.version === buildData.patchSlug);

    if (ship && category && patch) {
      await prisma.build.create({
        data: {
          buildName: buildData.buildName,
          creator: buildData.creator,
          shipId: ship.id,
          categoryId: category.id,
          patchId: patch.id,
          erkulUrl: buildData.erkulUrl,
          description: buildData.description,
          featured: buildData.featured,
        },
      });
      console.log(`✅ Created build: ${buildData.buildName}`);
    } else {
      console.log(`❌ Failed to create build: ${buildData.buildName} (missing ship, category, or patch)`);
    }
  }

  // Create sample tournaments
  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
  const threeDaysFromNow = new Date(currentTime.getTime() + 3 * 24 * 60 * 60 * 1000);
  const oneDayAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

  // Get some players for tournaments
  const tournamentPlayers = await prisma.user.findMany({
    where: {
      displayName: {
        in: ["spacesai1or", "bjax", "MrOldMaan", "ChicagoTed", "Cypher-1", "Lobus"]
      }
    },
    take: 6
  });

  if (tournamentPlayers.length >= 4) {
    // Find spacesai1or to be the tournament creator
    const spacesailorUser = tournamentPlayers.find(p => p.displayName === "spacesai1or") || tournamentPlayers[0];

    // Create an active tournament
    const activeTournament = await prisma.tournament.create({
      data: {
        name: "Test Tournament Active",
        startTime: oneHourAgo,
        endTime: threeDaysFromNow,
        createdBy: spacesailorUser.id,
        players: {
          create: tournamentPlayers.map(player => ({
            userId: player.id,
          })),
        },
        matches: {
          create: [
            {
              name: "Semifinals Match 1",
              startTime: oneHourAgo,
              endTime: oneHourFromNow,
              rounds: {
                create: [
                  {
                    roundNumber: 1,
                    startTime: oneHourAgo,
                    endTime: new Date(oneHourAgo.getTime() + 20 * 60 * 1000),
                    winnerId: tournamentPlayers[0].id,
                  },
                  {
                    roundNumber: 2,
                    startTime: new Date(oneHourAgo.getTime() + 25 * 60 * 1000),
                    endTime: new Date(oneHourAgo.getTime() + 45 * 60 * 1000),
                    winnerId: tournamentPlayers[1].id,
                  },
                  {
                    roundNumber: 3,
                    startTime: new Date(oneHourAgo.getTime() + 50 * 60 * 1000),
                    endTime: oneHourFromNow,
                    winnerId: tournamentPlayers[0].id,
                  },
                ],
              },
            },
            {
              name: "Semifinals Match 2",
              startTime: new Date(currentTime.getTime() + 2 * 60 * 60 * 1000),
              endTime: null, // Still to be played
            },
            {
              name: "Grand Final",
              startTime: new Date(currentTime.getTime() + 24 * 60 * 60 * 1000),
              endTime: null, // Still to be played
            },
          ],
        },
      },
    });

    // Create a completed tournament
    const completedTournament = await prisma.tournament.create({
      data: {
        name: "Test Tournament Completed",
        startTime: new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endTime: oneDayAgo,
        createdBy: spacesailorUser.id,
        players: {
          create: tournamentPlayers.slice(0, 4).map(player => ({
            userId: player.id,
          })),
        },
        matches: {
          create: [
            {
              name: "Semifinals Match 1",
              startTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000),
              endTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
              rounds: {
                create: [
                  {
                    roundNumber: 1,
                    startTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000),
                    endTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
                    winnerId: tournamentPlayers[0].id,
                  },
                  {
                    roundNumber: 2,
                    startTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
                    endTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
                    winnerId: tournamentPlayers[1].id,
                  },
                  {
                    roundNumber: 3,
                    startTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
                    endTime: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
                    winnerId: tournamentPlayers[0].id,
                  },
                ],
              },
            },
            {
              name: "Grand Final",
              startTime: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000),
              endTime: oneDayAgo,
              rounds: {
                create: [
                  {
                    roundNumber: 1,
                    startTime: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000),
                    endTime: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
                    winnerId: tournamentPlayers[1].id,
                  },
                  {
                    roundNumber: 2,
                    startTime: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
                    endTime: oneDayAgo,
                    winnerId: tournamentPlayers[1].id, // bjax wins!
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log("✅ Created tournament:", activeTournament.name);
    console.log("✅ Created tournament:", completedTournament.name);
  }

  console.log("🎉 Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });