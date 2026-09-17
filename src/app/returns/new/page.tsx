import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {  Save, Plus, PackageX } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createReturnAction } from "../actions"
import { BackButton } from "@/components/ui/back-button"
import { ReturnItemsForm } from "./return-items-form"

export default async function NewReturnPage() {
  const warehouses = await db.warehouse.findMany({ 
    where: { status: 'ACTIVE' },
    include: { locations: true }
  })
  
  const users = await db.user.findMany({ where: { status: 'ACTIVE' }, include: { roles: true } })
  const products = await db.product.findMany({ 
    where: { status: 'ACTIVE' },
    include: { unit: true }
  })
  const requests = await db.materialRequest.findMany({
    where: { status: { in: ['FULFILLED', 'PARTIALLY_FULFILLED'] } }
  })

  // Almoxarife simulado
  const userAlmox = users.find(u => u.roles && u.roles.length > 0)
  const mockUserId = userAlmox?.id || ""

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nova Devolução</h2>
          <p className="text-muted-foreground">Registre o retorno de materiais ao estoque.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form action={createReturnAction} className="space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Informações da Devolução</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quem está devolvendo?</label>
                  <Select name="returnedById" required>
                    <option value="">Selecione o usuário...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Almoxarifado de Destino</label>
                  <Select name="warehouseId" required>
                    <option value="">Selecione...</option>
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Requisição Original (Opcional)</label>
                  <Select name="requestId">
                    <option value="">Nenhuma (Devolução Avulsa)</option>
                    {requests.map(r => (
                      <option key={r.id} value={r.id}>{r.requestNumber}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Motivo</label>
                  <Input name="reason" placeholder="Ex: Sobrou da obra X" required />
                </div>
              </div>
            </div>

            <ReturnItemsForm products={products} warehouses={warehouses} />

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Link href="/returns">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
                <Save className="h-4 w-4" />
                Receber Devolução
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
