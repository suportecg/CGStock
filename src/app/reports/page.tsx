import { requirePermissionPage } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Package, ArrowRightLeft, ClipboardList, AlertTriangle, RotateCcw, Truck, Box } from "lucide-react"
import Link from "next/link"

export default async function ReportsHubPage() {
  await requirePermissionPage('REPORT_VIEW')

  const reportModules = [
    {
      group: "Estoque",
      items: [
        { name: "Posição Atual", href: "/reports/stock", icon: Package, description: "Visão consolidada por local" },
        { name: "Estoque Baixo/Zerado", href: "/reports/stock/low", icon: AlertTriangle, description: "Itens abaixo do mínimo" },
        { name: "Atividade de Produtos", href: "/reports/products/activity", icon: ActivityIcon, description: "Giro e histórico por item" },
      ]
    },
    {
      group: "Movimentações",
      items: [
        { name: "Histórico Geral", href: "/reports/movements", icon: ArrowRightLeft, description: "Extrato de todas operações" },
        { name: "Entradas", href: "/reports/entries", icon: Box, description: "Recebimentos por período" },
        { name: "Saídas", href: "/reports/exits", icon: Box, description: "Requisições atendidas" },
        { name: "Devoluções", href: "/reports/returns", icon: RotateCcw, description: "Materiais retornados" },
        { name: "Transferências", href: "/reports/transfers", icon: ArrowRightLeft, description: "Remanejos internos" },
        { name: "Ajustes", href: "/reports/adjustments", icon: AlertTriangle, description: "Correções manuais" },
      ]
    },
    {
      group: "Consumo e Requisições",
      items: [
        { name: "Ranking de Consumo", href: "/reports/consumption", icon: BarChart3, description: "Itens mais requisitados" },
      ]
    },
    {
      group: "Auditoria e Inventário",
      items: [
        { name: "Inventários", href: "/reports/inventory", icon: ClipboardList, description: "Status das contagens" },
        { name: "Divergências", href: "/reports/inventory/divergences", icon: AlertTriangle, description: "Diferenças apuradas" },
      ]
    },
    {
      group: "Parceiros",
      items: [
        { name: "Fornecedores", href: "/reports/suppliers", icon: Truck, description: "Volume fornecido" },
      ]
    }
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-emerald-600" />
          Central de Relatórios
        </h1>
        <p className="text-muted-foreground mt-2">Consultas avançadas e inteligência operacional para tomada de decisão.</p>
      </div>

      <div className="space-y-6">
        {reportModules.map((group) => (
          <div key={group.group}>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{group.group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border hover:border-emerald-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                        <item.icon className="h-5 w-5 text-emerald-600" />
                        {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
