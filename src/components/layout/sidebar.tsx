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
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-[#F8F9FA]">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 shrink-0">
        <div className="flex items-center gap-2 font-black text-xl text-indigo-600 tracking-tight">
          <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
            <Package className="h-5 w-5" />
          </div>
          CGSTOCK
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-8 px-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 px-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && item.href !== '/dashboard' && item.href !== '/admin' && item.href !== '#' && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-4 rounded-xl px-3 py-3 md:py-2 text-base md:text-sm font-medium transition-all duration-200 ease-in-out",
                          isActive 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                            : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 md:h-4 md:w-4 transition-transform duration-200 shrink-0",
                          isActive ? "text-white" : "text-slate-500 group-hover:scale-110 group-hover:text-slate-700"
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

      <div className="border-t border-slate-200 p-4 bg-transparent shrink-0">
        <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-200/50 cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-base md:text-sm font-bold text-slate-900 leading-none truncate">{user?.name || 'Administrador Sistema'}</span>
            <span className="text-sm md:text-xs text-slate-500 mt-1 truncate">{user?.roles?.join(', ') || 'ADMIN'}</span>
          </div>
        </div>
        <button className="mt-2 flex w-full items-center justify-center md:justify-start gap-3 rounded-xl px-3 py-3 md:py-2 text-base md:text-sm font-bold md:font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-all duration-200">
          <LogOut className="h-5 w-5 md:h-4 md:w-4 text-slate-500" />
          Encerrar Sessão
        </button>
      </div>
    </aside>
  )
}
