import { PrismaClient } from "@prisma/client";
import { updateRatingsAfterMatch } from "../src/lib/matchmaking";

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
  const threeDaysFromNow = new Date(currentTime.getTime() + 3 * 24 * 60 * 60 * 1000);

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

    // Create an active tournament without pre-generated matches
    const activeTournament = await prisma.tournament.create({
      data: {
        name: "Winter Championship 2025",
        startTime: oneHourAgo,
        endTime: threeDaysFromNow,
        finalized: false,
        createdBy: spacesailorUser.id,
        players: {
          create: tournamentPlayers.map(player => ({
            userId: player.id,
          })),
        },
        // Matches will be generated dynamically using the API
      },
    });

    console.log("✅ Created tournament:", activeTournament.name);

    // Create Legacy Matches tournament from historical data
    const legacyMatches = [
      { "winner": "TheChiropractor", "loser": "TangibleRaptor" },
      { "winner": "MrOldMaan", "loser": "AltFour_Industries" },
      { "winner": "ChicagoTed", "loser": "Apau11o" },
      { "winner": "spacesai1or", "loser": "Zero0721" },
      { "winner": "bjax", "loser": "HarryComa" },
      { "winner": "WinRAR42", "loser": "Savaulis" },
      { "winner": "TheChiropractor", "loser": "MrOldMaan" },
      { "winner": "spacesai1or", "loser": "ChicagoTed" },
      { "winner": "bjax", "loser": "WinRAR42" },
      { "winner": "Mandoolk", "loser": "TangibleRaptor" },
      { "winner": "Apau11o", "loser": "AltFour_Industries" },
      { "winner": "Zero0721", "loser": "HarryComa" },
      { "winner": "spacesai1or", "loser": "TheChiropractor" },
      { "winner": "bjax", "loser": "Mandoolk" },
      { "winner": "ChicagoTed", "loser": "MrOldMaan" },
      { "winner": "WinRAR42", "loser": "Zero0721" },
      { "winner": "Apau11o", "loser": "Savaulis" },
      { "winner": "AltFour_Industries", "loser": "TangibleRaptor" },
      { "winner": "bjax", "loser": "spacesai1or" },
      { "winner": "ChicagoTed", "loser": "TheChiropractor" },
      { "winner": "Apau11o", "loser": "WinRAR42" },
      { "winner": "MrOldMaan", "loser": "Mandoolk" },
      { "winner": "Zero0721", "loser": "AltFour_Industries" },
      { "winner": "Savaulis", "loser": "HarryComa" },
      { "winner": "bjax", "loser": "spacesai1or" },
      { "winner": "ChicagoTed", "loser": "TheChiropractor" },
      { "winner": "MrOldMaan", "loser": "WinRAR42" },
      { "winner": "Savaulis", "loser": "TangibleRaptor" },
      { "winner": "LaoPak", "loser": "Zwoid" },
      { "winner": "Cypher-1", "loser": "PelicanHazard" },
      { "winner": "bjax", "loser": "ChicagoTed" },
      { "winner": "MrOldMaan", "loser": "Savaulis" },
      { "winner": "Cypher-1", "loser": "LaoPak" },
      { "winner": "spacesai1or", "loser": "TheChiropractor" },
      { "winner": "WinRAR42", "loser": "TangibleRaptor" },
      { "winner": "Zwoid", "loser": "PelicanHazard" },
      { "winner": "bjax", "loser": "MrOldMaan" },
      { "winner": "spacesai1or", "loser": "Cypher-1" },
      { "winner": "ChicagoTed", "loser": "LaoPak" },
      { "winner": "WinRAR42", "loser": "Savaulis" },
      { "winner": "TheChiropractor", "loser": "Zwoid" },
      { "winner": "PelicanHazard", "loser": "TangibleRaptor" },
      { "winner": "bjax", "loser": "WinRAR42" },
      { "winner": "MrOldMaan", "loser": "spacesai1or" },
      { "winner": "ChicagoTed", "loser": "Cypher-1" },
      { "winner": "TheChiropractor", "loser": "LaoPak" },
      { "winner": "PelicanHazard", "loser": "Savaulis" },
      { "winner": "Zwoid", "loser": "TangibleRaptor" },
      { "winner": "bjax", "loser": "spacesai1or" },
      { "winner": "Cypher-1", "loser": "MrOldMaan" },
      { "winner": "PelicanHazard", "loser": "SIGNCUTTER" },
      { "winner": "Zwoid", "loser": "Captain Maddog" },
      { "winner": "ComradeBunji", "loser": "IntruderThree" },
      { "winner": "Lobus", "loser": "Bloodangel92" },
      { "winner": "AltFour_Industries", "loser": "TangibleRaptor" },
      { "winner": "bjax", "loser": "Cypher-1" },
      { "winner": "PelicanHazard", "loser": "Zwoid" },
      { "winner": "Lobus", "loser": "ComradeBunji" },
      { "winner": "MrOldMaan", "loser": "SIGNCUTTER" },
      { "winner": "IntruderThree", "loser": "Captain Maddog" },
      { "winner": "TangibleRaptor", "loser": "Bloodangel92" },
      { "winner": "bjax", "loser": "PelicanHazard" },
      { "winner": "Lobus", "loser": "AltFour_Industries" },
      { "winner": "Cypher-1", "loser": "ComradeBunji" },
      { "winner": "Zwoid", "loser": "TangibleRaptor" },
      { "winner": "MrOldMaan", "loser": "IntruderThree" },
      { "winner": "spacesai1or", "loser": "SIGNCUTTER" },
      { "winner": "Captain Maddog", "loser": "Bloodangel92" },
      { "winner": "bjax", "loser": "Lobus" },
      { "winner": "Cypher-1", "loser": "PelicanHazard" },
      { "winner": "MrOldMaan", "loser": "Zwoid" },
      { "winner": "spacesai1or", "loser": "ComradeBunji" },
      { "winner": "AltFour_Industries", "loser": "Captain Maddog" },
      { "winner": "IntruderThree", "loser": "TangibleRaptor" },
      { "winner": "SIGNCUTTER", "loser": "Bloodangel92" }
    ];

    // Get all unique players from legacy matches
    const legacyPlayerNames = Array.from(new Set([
      ...legacyMatches.map(m => m.winner),
      ...legacyMatches.map(m => m.loser)
    ]));

    console.log(`Found ${legacyPlayerNames.length} unique players in legacy matches`);

    // Get existing players from database
    const existingPlayers = await prisma.user.findMany({
      where: {
        displayName: {
          in: legacyPlayerNames
        }
      }
    });

    // Find players that don't exist yet
    const existingPlayerNames = existingPlayers.map(p => p.displayName);
    const missingPlayerNames = legacyPlayerNames.filter(name => !existingPlayerNames.includes(name));

    console.log(`Found ${missingPlayerNames.length} players to create:`, missingPlayerNames);

    // Create missing players
    for (const playerName of missingPlayerNames) {
      await prisma.user.create({
        data: {
          username: null, // Will be filled when they sign in with Discord
          displayName: playerName,
          claimed: false,
          image: null,
        },
      });
      console.log(`✅ Created unclaimed user: ${playerName}`);
    }

    // Now get all players for legacy matches (existing + newly created)
    const legacyPlayers = await prisma.user.findMany({
      where: {
        displayName: {
          in: legacyPlayerNames
        }
      }
    });

    // Create legacy tournament
    const legacyTournament = await prisma.tournament.create({
      data: {
        name: "Legacy Matches",
        startTime: new Date(currentTime.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        endTime: new Date(currentTime.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        finalized: true,
        createdBy: spacesailorUser.id,
        players: {
          create: legacyPlayers.map(player => ({
            userId: player.id,
          })),
        },
      },
    });

    // Create matches from legacy data
    let matchNumber = 1;

    for (const legacyMatch of legacyMatches) {
      const winnerPlayer = legacyPlayers.find(p => p.displayName === legacyMatch.winner);
      const loserPlayer = legacyPlayers.find(p => p.displayName === legacyMatch.loser);

      if (winnerPlayer && loserPlayer) {
        const matchStartTime = new Date(currentTime.getTime() - 365 * 24 * 60 * 60 * 1000 + (matchNumber - 1) * 60 * 60 * 1000 * 2); // 2 hours apart
        const matchEndTime = new Date(matchStartTime.getTime() + 30 * 60 * 1000); // 30 minutes duration

        // Create match
        const createdMatch = await prisma.match.create({
          data: {
            tournamentId: legacyTournament.id,
            name: `Legacy Match ${matchNumber}`,
            generationRound: Math.ceil(matchNumber / 10), // Group every 10 matches into a round
            startTime: matchStartTime,
            endTime: matchEndTime,
          },
        });

        // Create teams
        const winnerTeam = await prisma.matchTeam.create({
          data: {
            matchId: createdMatch.id,
            name: "Team A",
            placement: 1, // Winner
          },
        });

        const loserTeam = await prisma.matchTeam.create({
          data: {
            matchId: createdMatch.id,
            name: "Team B",
            placement: 2, // Loser
          },
        });

        // Create participants
        await prisma.matchParticipant.create({
          data: {
            teamId: winnerTeam.id,
            userId: winnerPlayer.id,
          },
        });

        await prisma.matchParticipant.create({
          data: {
            teamId: loserTeam.id,
            userId: loserPlayer.id,
          },
        });

        // Create round
        await prisma.round.create({
          data: {
            matchId: createdMatch.id,
            roundNumber: 1,
            startTime: matchStartTime,
            endTime: matchEndTime,
            winnerId: winnerPlayer.id,
          },
        });

        matchNumber++;
      }
    }

    console.log("✅ Created tournament:", legacyTournament.name, `with ${legacyMatches.length} matches`);

    // Initialize player ratings using the same OpenSkill system as the API
    console.log("📊 Initializing player ratings from legacy matches using OpenSkill...");
    
    // Create default ratings for all players who participated in legacy matches
    const { rating } = await import('openskill');
    
    for (const player of legacyPlayers) {
      const defaultRating = rating();
      const existingRating = await prisma.playerRating.findUnique({
        where: { userId: player.id }
      });
      
      if (!existingRating) {
        await prisma.playerRating.create({
          data: {
            userId: player.id,
            mu: defaultRating.mu,
            sigma: defaultRating.sigma,
            gamesPlayed: 0
          }
        });
      }
    }
    
    // Process all legacy matches through the rating system
    const allMatches = await prisma.match.findMany({
      where: { tournamentId: legacyTournament.id },
      include: {
        teams: {
          include: {
            players: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    for (const match of allMatches) {
      // Convert match data to the format expected by updateRatingsAfterMatch
      const teamResults = match.teams.map(team => ({
        playerIds: team.players.map(p => p.userId),
        placement: team.placement || 2
      }));
      
      // Update ratings using the same system as live matches
      await updateRatingsAfterMatch({
        tournamentId: legacyTournament.id,
        matchId: match.id,
        teamResults
      });
    }
    
    console.log("📊 Player ratings initialized using OpenSkill rating system!");
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