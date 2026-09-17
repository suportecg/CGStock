import { db } from "../src/lib/db"

async function main() {
  console.log("Buscando armazém...")
  const warehouse = await db.warehouse.findFirst()
  if (!warehouse) throw new Error("Nenhum armazém encontrado")

  console.log("Buscando localizações...")
  const locations = await db.warehouseLocation.findMany({ take: 4 })
  if (locations.length === 0) throw new Error("Nenhuma localização encontrada")

  console.log("Buscando usuário admin...")
  const adminUser = await db.user.findFirst({ where: { roles: { some: { name: 'ADMIN' } } } })
  if (!adminUser) throw new Error("Admin não encontrado")

  console.log("Criando inventário em andamento...")
  const inv = await db.inventory.create({
    data: {
      code: `INV-MOCK-${Math.floor(Math.random() * 10000)}`,
      name: "Inventário de Teste Coletor",
      warehouseId: warehouse.id,
      status: "IN_PROGRESS",
      type: "PARTIAL",
      createdById: adminUser.id,
      locations: {
        create: locations.map(l => ({
          locationId: l.id,
          status: "PENDING"
        }))
      }
    }
  })

  console.log(`Sucesso! Inventário criado: ${inv.code}`)
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
