const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      unit: true,
      stocks: { select: { quantity: true } }
    }
  });
  console.log(JSON.stringify(products, null, 2));
}

main().finally(() => prisma.$disconnect());
