"use client"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Bell, Menu, Search } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { logoutAction } from "@/app/auth-actions"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sidebar } from "./sidebar"

export function Topbar({ user }: { user?: { name: string; email: string; roles: string[] } | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])
  
  const titleMap: Record<string, string> = {
    'new': 'Novo',
    'edit': 'Editar',
    'dashboard': 'Painel Geral',
    'users': 'Usuários',
    'products': 'Produtos',
    'categories': 'Categorias',
    'units': 'Unidades',
    'warehouses': 'Almoxarifados',
    'suppliers': 'Fornecedores',
    'locations': 'Localizações',
    'movements': 'Movimentações',
    'receipts': 'Entradas',
    'issues': 'Saídas',
    'requests': 'Requisições',
    'returns': 'Devoluções',
    'inventory': 'Auditorias',
    'collector': 'Coletor',
    'import': 'Importar',
    'export': 'Exportar',
    'reports': 'Relatórios',
    'api': 'API / Conectores',
    'admin': 'Gestão Central',
    'settings': 'Configurações',
    'notifications': 'Notificações',
  }

  const segments = pathname.split('/').filter(Boolean)
  let lastSegment = segments[segments.length - 1] || 'dashboard'
  
  // Se o último segmento não estiver mapeado (ex: um ID/UUID), procuramos o último segmento válido
  if (!titleMap[lastSegment] && segments.length > 1) {
    const validSegment = [...segments].reverse().find(seg => titleMap[seg])
    if (validSegment) {
      lastSegment = validSegment
    }
  }

  const mappedTitle = titleMap[lastSegment] || lastSegment.replace(/-/g, ' ')
  const titleFormatted = mappedTitle.charAt(0).toUpperCase() + mappedTitle.slice(1)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 shadow-sm shadow-black/5">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 text-muted-foreground hover:bg-accent rounded-md"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* O botão de voltar agora fica ao lado dos títulos nas páginas */}
        <h1 className="text-xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {titleFormatted}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <form 
          className="relative hidden sm:block"
          onSubmit={(e) => {
            e.preventDefault()
            const q = new FormData(e.currentTarget).get('q')
            if (q) {
              router.push(`/search?q=${encodeURIComponent(q as string)}`)
            }
          }}
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            type="search" 
            name="q"
            placeholder="Busca global..." 
            className="h-9 w-64 rounded-full border border-border/50 bg-muted/50 pl-9 pr-4 text-sm transition-all focus:w-72 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>
        <ThemeToggle />
        <Link href="/notifications" className="relative p-2 text-muted-foreground hover:bg-accent rounded-md">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </Link>
        {user && (
          <div className="flex items-center gap-3 ml-2 border-l border-border/50 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">{user.roles.join(', ')}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shadow-inner ring-2 ring-background">
              {user.name.charAt(0)}
            </div>
            <button 
              onClick={() => logoutAction()}
              className="text-xs text-red-600 hover:text-red-700 hover:underline ml-2"
            >
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay via Portal */}
      {isMobileMenuOpen && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative flex w-[280px] max-w-[80vw] flex-1 flex-col bg-background shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar user={user} />
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}
