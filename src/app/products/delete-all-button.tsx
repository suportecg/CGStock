"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { deleteAllProducts } from "./actions"
import { toast } from "sonner"

export function DeleteAllButton() {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm("ATENÇÃO: Você tem certeza que deseja excluir TODOS os produtos e seu histórico de estoque? Esta ação é irreversível!")) return
    if (!window.confirm("CONFIRMAÇÃO FINAL: Deseja mesmo apagar o banco de produtos?")) return

    setIsDeleting(true)
    try {
      await deleteAllProducts()
      toast.success("Todos os produtos foram apagados.")
    } catch (error) {
      toast.error("Erro ao apagar produtos.")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Apagando..." : "Excluir Todos"}
    </Button>
  )
}
