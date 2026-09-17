import { db } from "@/lib/db"
import InventoryForm from "./inventory-form"

export default async function NewInventoryPage() {
  const warehouses = await db.warehouse.findMany({
    where: { status: 'ACTIVE' },
    include: { locations: true }
  })
  
  const users = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, name: true, roles: { select: { name: true } } }
  })

  // Gestor logado mock
  const userGestor = users.find(u => u.roles.some((r: any) => r.name === 'GESTOR'))
  const mockUserId = userGestor?.id || users[0]?.id || ""

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <InventoryForm 
        warehouses={warehouses} 
        users={users} 
        userId={mockUserId}
      />
    </div>
  )
}
