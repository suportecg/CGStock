import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import CollectorForm from "./collector-form"

export default async function CollectorLocationPage({ 
  params 
}: { 
  params: Promise<{ inventoryId: string, locationId: string }> 
}) {
  const { inventoryId, locationId } = await params
  
  const inv = await db.inventory.findUnique({
    where: { id: inventoryId }
  })

  const loc = await db.warehouseLocation.findUnique({
    where: { id: locationId }
  })

  if (!inv || !loc) notFound()

  // Em produção, buscar da sessão real
  const userAlmox = await db.user.findFirst({ where: { roles: { some: { name: 'ALMOXARIFE' } } } })
  const mockUserId = userAlmox?.id || ""

  // Buscar todos os produtos ativos para permitir bipar qualquer um
  const products = await db.product.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, code: true, name: true, barcode: true }
  })

  return (
    <div className="min-h-screen bg-accent font-sans max-w-lg mx-auto">
      <CollectorForm 
        inventoryId={inv.id} 
        locationId={loc.id} 
        locationCode={loc.code} 
        operatorId={mockUserId}
        products={products}
      />
    </div>
  )
}
