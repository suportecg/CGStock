"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { deliverMaterialRequest } from "@/lib/stock"
import { logAudit } from "@/lib/audit"
import { getSession } from "@/lib/auth"

export async function createRequestAction(formData: FormData) {
  const requesterId = formData.get("requesterId") as string
  const warehouseId = formData.get("warehouseId") as string
  const priority = formData.get("priority") as string
  const notes = formData.get("notes") as string
  const actionType = formData.get("actionType") as string

  const itemKeys = Array.from(formData.keys()).filter(k => k.startsWith('item_productId_'))
  const items = itemKeys.map(key => {
    const uniqueSuffix = key.replace('item_productId_', '')
    return {
      productId: formData.get(`item_productId_${uniqueSuffix}`) as string,
      requestedQuantity: Number(formData.get(`item_quantity_${uniqueSuffix}`)),
      unitId: formData.get(`item_unitId_${uniqueSuffix}`) as string,
    }
  }).filter(i => i.productId && i.requestedQuantity > 0 && i.unitId)

  if (items.length === 0) throw new Error("A requisição deve ter pelo menos um item.")

  const count = await db.materialRequest.count()
  const requestNumber = `REQ-${String(count + 1).padStart(4, '0')}`

  const request = await db.materialRequest.create({
    data: {
      requestNumber,
      requesterId,
      warehouseId,
      priority,
      notes,
      status: actionType === 'DRAFT' ? 'DRAFT' : 'PENDING_APPROVAL',
      requestedAt: actionType === 'DRAFT' ? null : new Date(),
      items: { create: items }
    }
  })

  await logAudit("REQUEST_CREATED", "MaterialRequest", request.id, { 
    status: actionType === 'DRAFT' ? 'DRAFT' : 'PENDING_APPROVAL',
    requestNumber: request.requestNumber 
  })

  revalidatePath("/requests")
  redirect(`/requests/${request.id}`)
}

export async function approveRequestAction(requestId: string, userId: string) {
  await db.materialRequest.update({
    where: { id: requestId },
    data: {
      status: 'APPROVED',
      approvedById: userId,
      approvedAt: new Date(),
    }
  })
  
  const req = await db.materialRequest.findUnique({ where: { id: requestId }, include: { items: true } })
  if (req) {
    for (const item of req.items) {
      await db.materialRequestItem.update({
        where: { id: item.id },
        data: { approvedQuantity: item.requestedQuantity }
      })
    }
  }

  await logAudit("REQUEST_APPROVED", "MaterialRequest", requestId)

  revalidatePath(`/requests/${requestId}`)
  revalidatePath("/requests")
}

export async function rejectRequestAction(requestId: string, userId: string, reason: string) {
  await db.materialRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      notes: reason,
    }
  })

  await logAudit("REQUEST_REJECTED", "MaterialRequest", requestId, { reason })

  revalidatePath(`/requests/${requestId}`)
  revalidatePath("/requests")
}

export async function cancelRequestAction(requestId: string, userId: string) {
  const req = await db.materialRequest.findUnique({ where: { id: requestId } })
  if (!req) throw new Error("Requisição não encontrada")

  if (['PARTIALLY_FULFILLED', 'FULFILLED'].includes(req.status)) {
    throw new Error("Não é possível cancelar uma requisição que já teve itens separados/entregues. Faça um estorno das movimentações de saída no módulo de devoluções.")
  }

  await db.materialRequest.update({
    where: { id: requestId },
    data: { status: 'CANCELLED' }
  })

  await logAudit("REQUEST_CANCELLED", "MaterialRequest", requestId)

  revalidatePath(`/requests/${requestId}`)
  revalidatePath("/requests")
}

export async function startSeparationAction(requestId: string, userId: string) {
  const req = await db.materialRequest.findUnique({ where: { id: requestId } })
  if (!req) throw new Error("Requisição não encontrada")

  if (req.status !== 'APPROVED') {
    throw new Error("A requisição precisa estar aprovada para iniciar a separação.")
  }

  await db.materialRequest.update({
    where: { id: requestId },
    data: { status: 'IN_SEPARATION' }
  })

  await logAudit("REQUEST_SEPARATION_STARTED", "MaterialRequest", requestId)

  revalidatePath(`/requests/${requestId}`)
  revalidatePath("/requests")
}

export async function fulfillRequestAction(formData: FormData) {
  const requestId = formData.get("requestId") as string
  const userId = formData.get("userId") as string
  
  const itemKeys = Array.from(formData.keys()).filter(k => k.startsWith('delivery_quantity_'))
  
  const deliveredItems = itemKeys.map(key => {
    const uniqueSuffix = key.replace('delivery_quantity_', '')
    return {
      itemId: uniqueSuffix,
      locationId: formData.get(`delivery_location_${uniqueSuffix}`) as string,
      quantity: Number(formData.get(`delivery_quantity_${uniqueSuffix}`))
    }
  }).filter(d => d.quantity > 0 && d.locationId && d.itemId)

  if (deliveredItems.length === 0) {
    throw new Error("Nenhuma quantidade informada para entrega.")
  }

  await deliverMaterialRequest(requestId, userId, deliveredItems)
  // Audit is logged inside deliverMaterialRequest transactional flow to ensure consistency.

  revalidatePath(`/requests/${requestId}`)
  revalidatePath("/requests")
  redirect(`/requests/${requestId}`)
}
