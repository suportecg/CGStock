"use server"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createStockMovement } from "@/lib/stock"
import { logAudit } from "@/lib/audit"

export async function createReceiptAction(formData: FormData) {
  const session = await getSession()
  if (!session) redirect("/login")

  const supplierId = formData.get("supplierId") as string
  const warehouseId = formData.get("warehouseId") as string
  const documentNumber = formData.get("documentNumber") as string || null
  const documentDateStr = formData.get("documentDate") as string || null
  
  // Como é complexo passar múltiplos itens por FormData nativo (arrays),
  // em um app real com UI dinâmica, normalmente receberíamos um JSON oculto 
  // ou faríamos parse dos keys. Vamos ler os dados como arrays usando getAll.
  const productIds = formData.getAll("item_productId") as string[]
  const locationIds = formData.getAll("item_locationId") as string[]
  const quantities = formData.getAll("item_quantity") as string[]
  const unitCosts = formData.getAll("item_unitCost") as string[]
  const actionType = formData.get("actionType") as string // "DRAFT" ou "COMPLETED"

  if (!supplierId || !warehouseId || productIds.length === 0) {
    redirect("/receipts/new?error=missing_fields")
  }

  try {
    const documentDate = documentDateStr ? new Date(documentDateStr) : null
    
    let subtotal = 0
    const itemsData = productIds.map((productId, index) => {
      const quantity = parseInt(quantities[index]) || 0
      const unitCost = parseFloat(unitCosts[index]) || 0
      const totalCost = quantity * unitCost
      subtotal += totalCost

      return {
        productId,
        locationId: locationIds[index],
        quantity,
        unitCost,
        totalCost,
      }
    }).filter(i => i.quantity > 0)

    if (itemsData.length === 0) {
      redirect("/receipts/new?error=no_valid_items")
    }

    if (actionType === "DRAFT") {
      const receipt = await db.stockReceipt.create({
        data: {
          supplierId,
          warehouseId,
          documentNumber,
          documentDate,
          status: 'DRAFT',
          createdById: session.userId,
          subtotal,
          total: subtotal,
          items: {
            create: itemsData
          }
        }
      })
      await logAudit("RECEIPT_CREATED", "StockReceipt", receipt.id, { status: "DRAFT" })
    } else if (actionType === "COMPLETED") {
      // Cria o recebimento, itens, movimentos e atualiza estoque (tudo numa transaction manual ou sequencial)
      // Como o Prisma Client permite transações iterativas:
      await db.$transaction(async (tx) => {
        const receipt = await tx.stockReceipt.create({
          data: {
            supplierId,
            warehouseId,
            documentNumber,
            documentDate,
            receivedAt: new Date(),
            status: 'COMPLETED',
            createdById: session.userId,
            subtotal,
            total: subtotal,
            items: {
              create: itemsData
            }
          },
          include: { items: true }
        })

        for (const item of receipt.items) {
          await createStockMovement({
            productId: item.productId,
            warehouseId: receipt.warehouseId,
            locationId: item.locationId,
            type: 'ENTRY',
            quantity: item.quantity,
            unitCost: Number(item.unitCost),
            totalCost: Number(item.totalCost),
            referenceType: 'RECEIPT',
            referenceId: receipt.id,
            documentNumber: receipt.documentNumber,
            performedById: session.userId
          }, tx)
        }
        await logAudit("RECEIPT_CREATED", "StockReceipt", receipt.id, { status: "COMPLETED" })
      })
    }

  } catch (error) {
    console.error("Erro ao salvar recebimento", error)
    redirect("/receipts/new?error=create_failed")
  }

  redirect("/receipts")
}

export async function confirmReceiptAction(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error("Não autorizado")

  const receiptId = formData.get("receiptId") as string
  if (!receiptId) throw new Error("ID do recebimento não informado")

  const receipt = await db.stockReceipt.findUnique({
    where: { id: receiptId },
    include: { items: true }
  })

  if (!receipt) throw new Error("Recebimento não encontrado")
  if (receipt.status !== "DRAFT") throw new Error("Apenas recebimentos em rascunho podem ser confirmados")

  try {
    await db.$transaction(async (tx) => {
      await tx.stockReceipt.update({
        where: { id: receipt.id },
        data: {
          status: 'COMPLETED',
          receivedAt: new Date()
        }
      })

      for (const item of receipt.items) {
        await createStockMovement({
          productId: item.productId,
          warehouseId: receipt.warehouseId,
          locationId: item.locationId,
          type: 'ENTRY',
          quantity: item.quantity,
          unitCost: item.unitCost ? Number(item.unitCost) : null,
          totalCost: item.totalCost ? Number(item.totalCost) : null,
          referenceType: 'RECEIPT',
          referenceId: receipt.id,
          documentNumber: receipt.documentNumber,
          performedById: session.userId
        }, tx)
      }
    })

    await logAudit("RECEIPT_CONFIRMED", "StockReceipt", receipt.id, { status: "COMPLETED" })
  } catch (error: any) {
    console.error("Erro ao confirmar recebimento", error)
    throw new Error(error.message || "Erro ao processar a confirmação do recebimento no estoque.")
  }

  redirect(`/receipts/${receipt.id}`)
}
