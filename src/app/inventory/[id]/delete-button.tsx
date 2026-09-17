"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function DeleteInventoryButton({ deleteAction, invId }: { deleteAction: (formData: FormData) => void, invId: string }) {
  return (
    <form action={deleteAction} onSubmit={(e) => {
      if(!confirm('Tem certeza que deseja excluir este inventário?')) e.preventDefault()
    }}>
      <input type="hidden" name="id" value={invId} />
      <Button variant="destructive" className="flex items-center gap-2">
        <Trash2 className="h-4 w-4" />
        Excluir
      </Button>
    </form>
  )
}
