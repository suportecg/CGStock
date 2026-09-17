const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.findMany();
  const getRole = (name) => roles.find(r => r.name === name);
  
  const users = [
    { email: "admin@estoka.com", role: "ADMIN" },
    { email: "gestor@estoka.com", role: "GESTOR" },
    { email: "almoxarife@estoka.com", role: "ALMOXARIFE" },
    { email: "conferente@estoka.com", role: "CONFERENTE" },
    { email: "solicitante@estoka.com", role: "SOLICITANTE" },
    { email: "fabiohenrique@cgconstrucoes.com", role: "ADMIN" },
    { email: "lucasximenes@cgconstrucoes.com", role: "ADMIN" }
  ];

  for (const u of users) {
    const roleObj = getRole(u.role);
    if (roleObj) {
      await prisma.user.updateMany({
        where: { email: u.email },
        data: {} // need to use update for relations, wait updateMany doesn't support relations.
      });
      // fetch user
      const user = await prisma.user.findUnique({ where: { email: u.email }});
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { roles: { connect: { id: roleObj.id } } }
        });
        console.log(`Assigned ${u.role} to ${u.email}`);
      }
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
