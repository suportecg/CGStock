"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { executeStockTransfer } from "@/lib/stock"

export async function createTransferAction(formData: FormData) {
  const createdById = formData.get("createdById") as string
  
  const sourceLocationId = formData.get("sourceLocationId") as string
  const destinationLocationId = formData.get("destinationLocationId") as string

  if (!sourceLocationId || !destinationLocationId) {
    redirect("/transfers/new?error=Selecione a localização de origem e destino.")
  }

  if (sourceLocationId === destinationLocationId) {
    throw new Error("Localização de origem e destino não podem ser iguais.")
  }

  // Obter os almoxarifados a partir dos locais
  const sourceLoc = await db.warehouseLocation.findUnique({ where: { id: sourceLocationId } })
  const destLoc = await db.warehouseLocation.findUnique({ where: { id: destinationLocationId } })

  if (!sourceLoc || !destLoc) throw new Error("Localizações inválidas.")

  const count = await db.stockTransfer.count()
  const transferNumber = `TRF-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

  const trf = await db.stockTransfer.create({
    data: {
      transferNumber,
      sourceWarehouseId: sourceLoc.warehouseId,
      sourceLocationId,
      destinationWarehouseId: destLoc.warehouseId,
      destinationLocationId,
      createdById,
      status: 'DRAFT'
    }
  })
  
  const productIds = formData.getAll("productId") as string[]
  const quantities = formData.getAll("quantity") as string[]
  const unitIds = formData.getAll("unitId") as string[]

  if (productIds.length > 0) {
    const items = productIds.map((pid, idx) => ({
      productId: pid,
      quantity: Number(quantities[idx]),
      unitId: unitIds[idx]
    }))

    // Simula a execução imediata (no mundo real poderia passar por status IN_TRANSIT)
    await executeStockTransfer(trf.id, createdById, items)
  }

  revalidatePath("/transfers")
  revalidatePath("/dashboard")
  redirect("/transfers")
}
