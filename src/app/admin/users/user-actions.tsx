"use client"

import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2, Printer } from "lucide-react"
import { deleteUserAction, softDeleteUserAction } from "./actions"
import { useTransition, useState, useRef, useEffect } from "react"
import Link from "next/link"

export function UserActions({ userId, userName }: { userId: string, userName: string }) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteUserAction(userId)
      if (res?.error) {
        if (res.hasHistory) {
          setShowDeleteModal(false)
          setShowHistoryModal(true)
        } else {
          alert(res.error)
          setShowDeleteModal(false)
        }
      } else {
        setShowDeleteModal(false)
      }
      setIsOpen(false)
    })
  }

  const handleSoftDelete = () => {
    startTransition(async () => {
      const res = await softDeleteUserAction(userId)
      if (res?.error) {
        alert(res.error)
      }
      setShowHistoryModal(false)
    })
  }

  return (
    <div className="relative flex justify-end" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 text-muted-foreground hover:bg-muted"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-border/50 bg-card/95 backdrop-blur-md p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
          <Link href={`/admin/users/print-badges?ids=${userId}`}>
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors">
              <Printer className="h-4 w-4 text-muted-foreground" />
              Imprimir Crachá
            </button>
          </Link>
          <Link href={`/admin/users/${userId}/edit`}>
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              Editar
            </button>
          </Link>
          <button 
            onClick={() => {
              setIsOpen(false)
              setShowDeleteModal(true)
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors mt-1"
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-border/50 zoom-in-95 animate-in duration-200">
            <h2 className="text-xl font-bold text-foreground">Excluir Usuário?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Você tem certeza que deseja excluir o usuário <span className="font-bold text-foreground">{userName}</span>? 
              Esta ação não poderá ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isPending}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl shadow-md"
              >
                {isPending ? "Excluindo..." : "Sim, Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-border/50 zoom-in-95 animate-in duration-200">
            <h2 className="text-xl font-bold text-foreground">Usuário com Histórico</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Este usuário não pode ser excluído completamente pois possui ações registradas no sistema.
              Podemos <strong>apagar o usuário</strong> de forma lógica, garantindo que ele não acesse mais o sistema, mas mantendo seu histórico salvo.<br/><br/>
              Deseja continuar?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowHistoryModal(false)}
                disabled={isPending}
                className="rounded-xl"
              >
                Não
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleSoftDelete}
                disabled={isPending}
                className="rounded-xl shadow-md"
              >
                {isPending ? "Apagando..." : "Sim, Apagar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
