"use client"

import { Button } from "@/components/ui/button"
import { Ban } from "lucide-react"
import { handleAction } from "@/lib/handle-action"

export function CancelRequestButton({ cancelAction }: { cancelAction: () => Promise<void> }) {
  return (
    <form action={handleAction(cancelAction)} onSubmit={(e) => {
      if(!confirm('Deseja realmente cancelar esta requisição?')) e.preventDefault()
    }}>
      <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
        <Ban className="h-4 w-4" />
        Cancelar Requisição
      </Button>
    </form>
  )
}
