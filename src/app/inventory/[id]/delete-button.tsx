"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"

export function DeleteInventoryButton({ deleteAction, invId }: { deleteAction: (formData: FormData) => void, invId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        type="button" 
        variant="destructive" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        Excluir
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-destructive">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Excluir Inventário</h3>
              </div>
              <p className="text-muted-foreground pl-13">
                Tem certeza que deseja excluir este inventário? Esta ação não poderá ser desfeita.
              </p>
            </div>
            <div className="bg-muted/30 p-4 flex justify-end gap-3 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <form action={deleteAction} onSubmit={() => setIsOpen(false)}>
                <input type="hidden" name="id" value={invId} />
                <Button type="submit" variant="destructive">
                  Excluir
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
