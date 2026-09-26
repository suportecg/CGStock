"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  MapPin, 
  ArrowRightLeft, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ClipboardList, 
  RotateCcw, 
  CheckSquare, 
  AlertTriangle,
  BarChart3, 
  Users, 
  Shield, 
  Settings,
  LogOut,
  FolderSync,
  HelpCircle
} from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Sidebar({ user }: { user?: { name: string; email: string; roles: string[] } | null }) {
  const pathname = usePathname()

  const isRequesterOnly = user?.roles && 
    user.roles.includes('SOLICITANTE') && 
    !user.roles.some(r => ['ADMIN', 'GESTOR', 'ALMOXARIFE'].includes(r))

  const menuGroups = [
    {
      title: "Menu Inicial",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ]
    },
    ...(!isRequesterOnly ? [{
      title: "Estoque",
      items: [
        { name: "Produtos", href: "/products", icon: Package },
        { name: "Categorias", href: "/categories", icon: Tags },
        { name: "Unidades", href: "/units", icon: Package },
        { name: "Localizações", href: "/locations", icon: MapPin },
        { name: "Movimentações", href: "/movements", icon: ArrowRightLeft },
      ]
    }] : []),
    {
      title: "Operações",
      items: [
        ...(!isRequesterOnly ? [
          { name: "Entradas", href: "/receipts", icon: ArrowDownToLine },
          { name: "Saídas", href: "/issues", icon: ArrowUpFromLine },
          { name: "Entrega Rápida", href: "/quick-issue", icon: Shield },
        ] : []),
        { name: "Requisições", href: "/requests", icon: ClipboardList },
        ...(!isRequesterOnly ? [
          { name: "Devoluções", href: "/returns", icon: RotateCcw },
        ] : []),
      ]
    },
    ...(!isRequesterOnly ? [{
      title: "Inventário",
      items: [
        { name: "Inventários", href: "/inventory", icon: ClipboardList },
        { name: "Coletor (Scanner)", href: "/collector", icon: CheckSquare },
      ]
    }] : []),
    ...(!isRequesterOnly ? [{
      title: "Integração",
      items: [
        { name: "Importar", href: "/import", icon: FolderSync },
        { name: "Exportar", href: "/export", icon: FolderSync },
      ]
    }] : []),
    ...(!isRequesterOnly ? [{
      title: "Sistema",
      items: [
        { name: "Relatórios", href: "/reports", icon: BarChart3 },
        { name: "API / Conectores", href: "/api", icon: Settings },
        { name: "Central de Ajuda", href: "/help", icon: HelpCircle },
      ]
    }] : []),
    ...(!isRequesterOnly ? [{
      title: "Administração",
      items: [
        { name: "Gestão Central", href: "/admin", icon: Shield },
        { name: "Usuários", href: "/admin/users", icon: Users },
        { name: "Configurações", href: "/admin/settings", icon: Settings },
      ]
    }] : []),
  ]

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-background">
      <div className="flex h-12 items-center border-b border-border px-4 shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg text-foreground tracking-tight">
          <Package className="h-4 w-4" />
          CGSTOCK
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-4 px-2">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {group.title}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/dashboard' && item.href !== '/admin' && item.href !== '#' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-1.5 text-sm font-medium border-l-2",
                          isActive 
                            ? "border-primary text-foreground bg-muted/50" 
                            : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-foreground leading-none truncate">{user?.name || 'Administrador'}</span>
            <span className="text-xs text-muted-foreground mt-1 truncate">{user?.roles?.join(', ') || 'ADMIN'}</span>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
