import { requirePermissionPage } from "@/lib/permissions"
import { db } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePermissionPage('AUDIT_VIEW')

  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 50
  
  const logs = await db.auditLog.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { timestamp: 'desc' },
    include: {
      user: true
    }
  })

  const total = await db.auditLog.count()
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            Trilha de Auditoria
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Registro imutável de operações e eventos do sistema.</p>
        </div>
        </div>
      </div>

      <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl shadow-indigo-500/5 overflow-hidden transition-all duration-200">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum log de auditoria encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>ID Entidade</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {log.timestamp.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {log.user?.name || 'Sistema'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs font-bold text-gray-700 bg-accent">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.entityType}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[120px]" title={log.entityId}>
                      {log.entityId}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.ip || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <a href={`/admin/audit?page=${Math.max(1, page - 1)}`} className={`px-4 py-2 border rounded-md ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}>
            Anterior
          </a>
          <span className="px-4 py-2 text-muted-foreground">Página {page} de {totalPages}</span>
          <a href={`/admin/audit?page=${Math.min(totalPages, page + 1)}`} className={`px-4 py-2 border rounded-md ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}>
            Próxima
          </a>
        </div>
      )}
    </div>
  )
}
