"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { receiveMaterialReturn } from "@/lib/stock"

export async function createReturnAction(formData: FormData) {
  const warehouseId = formData.get("warehouseId") as string
  const returnedById = formData.get("returnedById") as string
  const reason = formData.get("reason") as string
  const requestId = formData.get("requestId") as string || null

  const count = await db.materialReturn.count()
  const returnNumber = `RET-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

  const ret = await db.materialReturn.create({
    data: {
      returnNumber,
      warehouseId,
      returnedById,
      requestId,
      reason,
      status: 'DRAFT'
    }
  })

  // Os itens da devolução seriam processados aqui também em um fluxo completo
  // Mas para simplificar, já vamos simular que os itens vieram no form e recebê-los imediatamente
  
  const productIds = formData.getAll("productId") as string[]
  const locationIds = formData.getAll("locationId") as string[]
  const quantities = formData.getAll("quantity") as string[]
  const conditions = formData.getAll("condition") as ('GOOD'|'DAMAGED'|'UNUSABLE')[]
  const unitIds = formData.getAll("unitId") as string[]

  if (productIds.length > 0) {
    const items = productIds.map((pid, idx) => ({
      productId: pid,
      locationId: locationIds[idx],
      quantity: Number(quantities[idx]),
      unitId: unitIds[idx],
      condition: conditions[idx]
    }))

    // Receber e consolidar no estoque
    // O mockUserId deveria vir da sessão, simulando um Almoxarife recebendo
    const userAlmox = await db.user.findFirst({ where: { roles: { some: { name: 'ALMOXARIFE' } } } })
    await receiveMaterialReturn(ret.id, userAlmox?.id || returnedById, items)
  }

  revalidatePath("/returns")
  revalidatePath("/dashboard")
  redirect("/returns")
}
