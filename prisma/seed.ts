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