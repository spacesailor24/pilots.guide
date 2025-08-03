import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    shipId: "hornet-ghost",
    name: "F7C-M Hornet Ghost",
    category: "Medium Stealth Fighter",
    imagePath: "/images/hornet-mkii-ghost.png",
    maxCrew: 1,
  },
  {
    shipId: "hornet-super",
    name: "F7C-M Hornet Super",
    category: "Medium Fighter",
    imagePath: "/images/hornet-mkii-super.png",
    maxCrew: 1,
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

async function main() {
  console.log("🌱 Seeding database...");

  // Create ships
  for (const ship of ships) {
    await prisma.ship.upsert({
      where: { shipId: ship.shipId },
      update: {},
      create: ship,
    });
    console.log(`✅ Created ship: ${ship.name}`);
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