import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding worksites...')
  
  // Create "Obra Principal"
  let mainWorksite = await prisma.worksite.findUnique({ where: { code: 'MAIN' } })
  if (!mainWorksite) {
    mainWorksite = await prisma.worksite.create({
      data: {
        code: 'MAIN',
        name: 'Obra Principal',
        description: 'Obra padrão para migração de almoxarifados legados',
      }
    })
    console.log('Created Worksite: Obra Principal')
  }

  // Find all warehouses that don't have a worksiteId and link them
  const unlinkedWarehouses = await prisma.warehouse.findMany({
    where: { worksiteId: null }
  })
  
  for (const wh of unlinkedWarehouses) {
    await prisma.warehouse.update({
      where: { id: wh.id },
      data: { worksiteId: mainWorksite.id }
    })
    console.log(`Linked warehouse ${wh.name} to Obra Principal`)
  }

  // Generate QR tokens for users that don't have one
  const users = await prisma.user.findMany({
    where: { qrToken: null }
  })

  for (const user of users) {
    const token = `ESTOK-USER-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    await prisma.user.update({
      where: { id: user.id },
      data: { qrToken: token }
    })
    
    // Also give them access to Obra Principal so they don't lose access
    await prisma.userWorksiteAccess.upsert({
      where: { userId_worksiteId: { userId: user.id, worksiteId: mainWorksite.id } },
      update: {},
      create: {
        userId: user.id,
        worksiteId: mainWorksite.id,
        canViewStock: true,
        canRequestMaterial: true,
        canUseQuickIssue: true,
      }
    })
    
    console.log(`Updated user ${user.name} with QR token and Worksite Access`)
  }

  console.log('Seeding finished!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
