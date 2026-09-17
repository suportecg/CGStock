"use client"
import { usePathname } from "next/navigation"

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Se estivermos na tela de login, retornamos apenas o conteúdo sem o shell
  if (pathname === '/login') {
    return <>{children}</>
  }

  return <>{children}</>
}
