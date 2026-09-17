import { db } from "@/lib/db"
import ReceiptForm from "./receipt-form"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NewReceiptPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const suppliers = await db.supplier.findMany({ where: { status: 'ACTIVE' }, orderBy: { name: 'asc' } })
  const warehouses = await db.warehouse.findMany({ where: { status: 'ACTIVE' } })
  const products = await db.product.findMany({ where: { status: 'ACTIVE' }, include: { unit: true } })
  const locations = await db.warehouseLocation.findMany({ where: { status: 'ACTIVE' } })

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ReceiptForm 
        suppliers={suppliers} 
        warehouses={warehouses} 
        products={products.map(p => ({ ...p, averageCost: p.averageCost ? Number(p.averageCost) : null }))}
        locations={locations} 
      />
    </div>
  )
}
