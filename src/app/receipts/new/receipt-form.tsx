/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Card, CardContent } from "@/components/ui/card"
import {  Save, Plus, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createReceiptAction } from "../actions"
import { BackButton } from "@/components/ui/back-button"
import { formatCurrency } from "@/lib/utils"

type ItemData = {
  id: string
  productId: string
  locationId: string
  quantity: number
  unitCost: number
}

export default function ReceiptForm({ suppliers, warehouses, products, locations }: any) {
  const [warehouseId, setWarehouseId] = useState("")
  const [items, setItems] = useState<ItemData[]>([])

  const filteredLocations = warehouseId ? locations.filter((l: any) => l.warehouseId === warehouseId) : []

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), productId: "", locationId: "", quantity: 1, unitCost: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (id: string, field: keyof ItemData, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const updateItemFields = (id: string, fields: Partial<ItemData>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...fields } : i))
  }

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0)

  return (
    <>
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nova Entrada</h2>
          <p className="text-muted-foreground">Registre o recebimento de materiais.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form action={createReceiptAction} className="space-y-8">
            {/* Cabeçalho */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Dados do Recebimento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fornecedor *</label>
                  <Select name="supplierId" required>
                    <option value="">Selecione...</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} {s.document ? `(${s.document})` : ''}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Almoxarifado Destino *</label>
                  <Select 
                    name="warehouseId" 
                    required 
                    value={warehouseId} 
                    onChange={e => setWarehouseId(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {warehouses.map((w: any) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número do Documento / NF</label>
                  <Input name="documentNumber" placeholder="Ex: NF 123456" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data do Documento</label>
                  <Input name="documentDate" type="date" />
                </div>
              </div>
            </div>

            {/* Itens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-medium">Itens da Entrada</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem} disabled={!warehouseId}>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Produto
                </Button>
              </div>

              {!warehouseId && (
                <div className="p-4 bg-yellow-50 text-yellow-700 text-sm rounded-md border border-yellow-200">
                  Selecione um Almoxarifado destino primeiro para adicionar itens.
                </div>
              )}

              {items.length === 0 && warehouseId && (
                <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
                  Nenhum item adicionado. Clique no botão acima para adicionar.
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end border p-4 rounded-md bg-muted">
                    <div className="col-span-12 md:col-span-4 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Produto *</label>
                      <SearchableSelect 
                        name="item_productId" 
                        required 
                        value={item.productId}
                        onChange={val => {
                          const product = products.find((p: any) => p.id === val)
                          updateItemFields(item.id, { 
                            productId: val, 
                            unitCost: product && product.averageCost ? Number(product.averageCost) : 0 
                          })
                        }}
                        options={products.map((p: any) => ({
                          value: p.id,
                          label: `${p.code} - ${p.name}`
                        }))}
                      />
                    </div>
                    
                    <div className="col-span-6 md:col-span-2 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Qtd *</label>
                      <Input 
                        name="item_quantity" 
                        type="number" 
                        min="1" 
                        required 
                        value={item.quantity || ''}
                        onChange={e => updateItem(item.id, "quantity", Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="col-span-6 md:col-span-2 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Custo Unitário (R$)</label>
                      <Input 
                        name="item_unitCost" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={item.unitCost || ''}
                        onChange={e => updateItem(item.id, "unitCost", Number(e.target.value))}
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">Localização *</label>
                      <Select 
                        name="item_locationId" 
                        required
                        value={item.locationId}
                        onChange={e => updateItem(item.id, "locationId", e.target.value)}
                      >
                        <option value="">Selecionar...</option>
                        {filteredLocations.map((l: any) => (
                          <option key={l.id} value={l.id}>{l.code} - {l.name}</option>
                        ))}
                      </Select>
                    </div>

                    <div className="col-span-12 md:col-span-1 text-right md:text-center pb-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="flex justify-end pt-2">
                  <div className="bg-blue-50 text-blue-900 px-4 py-2 rounded-lg font-medium border border-blue-100 flex items-center gap-3">
                    <span>Total Estimado:</span>
                    <span className="text-xl font-bold">{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Link href="/receipts">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              
              <Button type="submit" name="actionType" value="DRAFT" variant="secondary" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Rascunho
              </Button>

              <Button type="submit" name="actionType" value="COMPLETED" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle className="h-4 w-4" />
                Finalizar e Atualizar Estoque
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
