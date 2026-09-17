const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.product.findMany({
    include: {
      stocks: { select: { quantity: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const p2 = await prisma.product.findMany({
    include: {
      stocks: {
        include: { location: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  const p1Map = new Map(p1.map(p => [p.id, p.stocks.reduce((a, s) => a + s.quantity, 0)]));
  const p2Map = new Map(p2.map(p => [p.id, p.stocks.reduce((a, s) => a + s.quantity, 0)]));

  for (const [id, q1] of p1Map.entries()) {
    const q2 = p2Map.get(id);
    if (q1 !== q2) {
      console.log(`Mismatch for product ${id}: products/page=${q1} vs stock/page=${q2}`);
    }
  }
  console.log("Check complete.");
}

main().finally(() => prisma.$disconnect());
