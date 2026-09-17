import { requirePermissionPage } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, MapPin, Tags, Settings, Activity, ShieldCheck, Database, PackageOpen, Truck } from "lucide-react"
import Link from "next/link"

export default async function AdminHubPage() {
  // Apenas usuários com permissão podem ver este hub
  await requirePermissionPage('USER_VIEW')

  const adminModules = [
    {
      group: "Controle de Acesso",
      items: [
        { name: "Usuários", href: "/admin/users", icon: Users, description: "Gerenciar contas e ativações" },
        { name: "Permissões", href: "/admin/permissions", icon: ShieldCheck, description: "Matriz de acesso e papéis" },
      ]
    },
    {
      group: "Cadastros Base",
      items: [
        { name: "Almoxarifados", href: "/admin/warehouses", icon: PackageOpen, description: "Unidades e galpões" },
        { name: "Fornecedores", href: "/admin/suppliers", icon: Truck, description: "Empresas parceiras" },
        { name: "Localizações", href: "/admin/locations", icon: MapPin, description: "Corredores, estantes e prateleiras" },
        { name: "Categorias", href: "/admin/categories", icon: Tags, description: "Famílias de produtos" },
      ]
    },
    {
      group: "Sistema",
      items: [
        { name: "Auditoria (Logs)", href: "/admin/audit", icon: Shield, description: "Rastreabilidade de ações" },
        { name: "Configurações", href: "/admin/settings", icon: Settings, description: "Parametrização global" },
        { name: "Saúde do Sistema", href: "/admin/system", icon: Activity, description: "Status e métricas do DB" },
      ]
    }
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Database className="h-8 w-8 text-blue-600" />
          Administração do Sistema
        </h1>
        <p className="text-muted-foreground mt-2">Central de configurações, cadastros vitais e auditoria.</p>
      </div>

      <div className="space-y-6">
        {adminModules.map((group) => (
          <div key={group.group}>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{group.group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-border hover:border-blue-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                        <item.icon className="h-5 w-5 text-blue-600" />
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
