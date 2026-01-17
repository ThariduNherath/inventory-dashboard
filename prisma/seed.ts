import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoUserId = "17fb6ca78-0fda-4fe2-bbf6-cfa2bca5d83f";

  await prisma.product.createMany({
    data: Array.from({ length: 25 }).map((_, i) => ({
      userId: demoUserId,
      name: `Product ${i + 1}`,
      price: Number((Math.random() * 90 + 10).toFixed(2)),
      quantity: Math.floor(Math.random() * 20),
      lowStockAt: 5,
      createAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
    })),
  });

  console.log("Seed data created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
