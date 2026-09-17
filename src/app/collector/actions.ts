"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitCollectionAction(formData: FormData) {
  const inventoryId = formData.get("inventoryId") as string
  const locationId = formData.get("locationId") as string
  const operatorId = formData.get("operatorId") as string
  
  const itemKeys = Array.from(formData.keys()).filter(k => k.startsWith('qty_'))
  
  const items = itemKeys.map(k => {
    const productId = k.replace('qty_', '')
    const quantity = Number(formData.get(k))
    return { productId, quantity }
  }).filter(i => i.quantity > 0)

  if (items.length === 0) {
    throw new Error("Nenhum item coletado.")
  }

  // Cria a Coleta
  await db.inventoryCollection.create({
    data: {
      inventoryId,
      locationId,
      operatorId,
      status: 'SUBMITTED',
      startedAt: new Date(),
      finishedAt: new Date(),
      items: {
        create: items
      }
    }
  })

  // Marca o local como COMPLETED no inventário
  await db.inventoryLocation.update({
    where: {
      inventoryId_locationId: { inventoryId, locationId }
    },
    data: {
      status: 'COMPLETED',
      finishedAt: new Date()
    }
  })

  revalidatePath(`/collector`)
  revalidatePath(`/inventory/${inventoryId}`)
  redirect(`/collector`)
}
