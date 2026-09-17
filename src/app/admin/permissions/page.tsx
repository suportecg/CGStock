import { requirePermissionPage } from "@/lib/permissions"
import { db } from "@/lib/db"
import { ShieldCheck } from "lucide-react"
import { PermissionsTable } from "./permissions-table"
import { BackButton } from "@/components/ui/back-button"

export default async function PermissionsPage() {
  await requirePermissionPage('CONFIG_MANAGE')

  const roles = await db.role.findMany({
    orderBy: { name: 'asc' },
    include: { permissions: true }
  })
  
  const permissions = await db.permission.findMany({
    orderBy: { key: 'asc' }
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            Matriz de Permissões
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Controle de acesso granular por papel (Role-Based Access Control).</p>
        </div>
        </div>
      </div>

      <PermissionsTable roles={roles} permissions={permissions} />
    </div>
  )
}
