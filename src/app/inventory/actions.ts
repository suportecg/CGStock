"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { consolidateInventory } from "@/lib/stock"

export async function createInventoryAction(formData: FormData) {
  const name = formData.get("name") as string
  const warehouseId = formData.get("warehouseId") as string
  const createdById = formData.get("createdById") as string
  
  const locationKeys = Array.from(formData.keys()).filter(k => k.startsWith('loc_') && formData.get(k) === 'on')
  const operatorKeys = Array.from(formData.keys()).filter(k => k.startsWith('op_') && formData.get(k) === 'on')

  const locationIds = locationKeys.map(k => k.replace('loc_', ''))
  const operatorIds = operatorKeys.map(k => k.replace('op_', ''))

  if (locationIds.length === 0) throw new Error("Selecione pelo menos um local para contagem.")
  if (operatorIds.length === 0) throw new Error("Selecione pelo menos um operador.")

  const currentYear = new Date().getFullYear()
  const lastInventory = await db.inventory.findFirst({
    where: {
      code: {
        startsWith: `INV-${currentYear}-`
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  let nextNumber = 1
  if (lastInventory) {
    const lastNumber = parseInt(lastInventory.code.split('-')[2], 10)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }
  
  const code = `INV-${currentYear}-${String(nextNumber).padStart(3, '0')}`

  const inv = await db.inventory.create({
    data: {
      code,
      name,
      warehouseId,
      createdById,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      locations: {
        create: locationIds.map(locId => ({
          locationId: locId,
          status: 'PENDING'
        }))
      },
      operators: {
        create: operatorIds.map(opId => ({
          userId: opId
        }))
      }
    }
  })

  revalidatePath("/inventory")
  redirect(`/inventory/${inv.id}`)
}

export async function finishInventoryAction(inventoryId: string, userId: string) {
  await consolidateInventory(inventoryId, userId)
  revalidatePath(`/inventory/${inventoryId}`)
  revalidatePath("/inventory")
}

export async function deleteInventoryAction(formData: FormData) {
  const inventoryId = formData.get("id") as string
  await db.inventory.delete({ where: { id: inventoryId } })
  revalidatePath("/inventory")
  redirect("/inventory")
}

export async function concludeInventoryAction(formData: FormData) {
  const inventoryId = formData.get("id") as string
  await db.inventory.update({
    where: { id: inventoryId },
    data: { status: 'COMPLETED' }
  })
  
  revalidatePath(`/inventory/${inventoryId}`)
  revalidatePath(`/inventory/${inventoryId}/divergences`)
  revalidatePath("/inventory")
  redirect(`/inventory/${inventoryId}`)
}
