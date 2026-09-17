"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { executeDivergenceAdjustment } from "@/lib/stock"

export async function reviewDivergenceAction(divergenceId: string, inventoryId: string, userId: string, formData: FormData) {
  const notes = formData.get("notes") as string
  
  await db.inventoryDivergence.update({
    where: { id: divergenceId },
    data: {
      status: 'REVIEWED',
      reviewedById: userId,
      reviewedAt: new Date(),
      reviewNotes: notes
    }
  })

  revalidatePath(`/inventory/${inventoryId}/divergences/${divergenceId}`)
  revalidatePath(`/inventory/${inventoryId}/divergences`)
}

export async function approveDivergenceAction(divergenceId: string, inventoryId: string, userId: string, formData: FormData) {
  const notes = formData.get("notes") as string
  
  await db.inventoryDivergence.update({
    where: { id: divergenceId },
    data: {
      status: 'APPROVED',
      approvedById: userId,
      approvedAt: new Date(),
      approvalNotes: notes
    }
  })

  // Executar o ajuste imediatamente após a aprovação
  await executeDivergenceAdjustment(divergenceId, userId, notes)

  revalidatePath(`/inventory/${inventoryId}/divergences/${divergenceId}`)
  revalidatePath(`/inventory/${inventoryId}/divergences`)
  redirect(`/inventory/${inventoryId}/divergences`)
}

export async function rejectDivergenceAction(divergenceId: string, inventoryId: string, userId: string, formData: FormData) {
  const reason = formData.get("reason") as string
  if (!reason) throw new Error("Motivo da rejeição é obrigatório.")
  
  await db.inventoryDivergence.update({
    where: { id: divergenceId },
    data: {
      status: 'REJECTED',
      rejectedById: userId,
      rejectedAt: new Date(),
      rejectionReason: reason
    }
  })

  revalidatePath(`/inventory/${inventoryId}/divergences/${divergenceId}`)
  revalidatePath(`/inventory/${inventoryId}/divergences`)
  redirect(`/inventory/${inventoryId}/divergences`)
}
