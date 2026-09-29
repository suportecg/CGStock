"use client"

import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-500" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">Acesso não permitido</h1>
        <p className="text-muted-foreground">
          Você não possui permissão para acessar este recurso. Se você acha que isso é um erro, entre em contato com o administrador do sistema.
        </p>
      </div>

      <Button asChild className="bg-primary hover:bg-primary/90">
        <Link href="/">Voltar para o Início</Link>
      </Button>
    </div>
  )
}
