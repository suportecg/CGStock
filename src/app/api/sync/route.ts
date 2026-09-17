import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { operation, payload } = await request.json()

    if (operation === 'SUBMIT_COLLECTION') {
      const { inventoryId, locationId, operatorId, items } = payload

      // Verifica se já não foi submetido (idempotência básica)
      const existing = await db.inventoryCollection.findFirst({
        where: { inventoryId, locationId, operatorId }
      })

      if (existing) {
        return NextResponse.json({ success: true, message: "Já processado anteriormente" })
      }

      await db.$transaction(async (tx) => {
        await tx.inventoryCollection.create({
          data: {
            inventoryId,
            locationId,
            operatorId,
            status: 'SUBMITTED',
            startedAt: new Date(),
            finishedAt: new Date(),
            items: {
              create: items.map((i: any) => ({
                productId: i.productId,
                quantity: i.quantity
              }))
            }
          }
        })

        await tx.inventoryLocation.update({
          where: {
            inventoryId_locationId: { inventoryId, locationId }
          },
          data: {
            status: 'COMPLETED',
            finishedAt: new Date()
          }
        })
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Operação desconhecida" }, { status: 400 })

  } catch (error: any) {
    console.error("Sync Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
