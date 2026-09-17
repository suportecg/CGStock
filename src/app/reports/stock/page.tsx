import { requirePermissionPage } from "@/lib/permissions"
import { db } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"

export default async function StockReportPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePermissionPage('REPORT_VIEW')

  const params = await searchParams
  const page = Number(params.page) || 1
  const pageSize = 50
  
  const stocks = await db.stock.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: [{ product: { name: 'asc' } }, { location: { code: 'asc' } }],
    include: {
      product: {
        include: { category: true, unit: true }
      },
      warehouse: true,
      location: true
    }
  })

  const total = await db.stock.count()
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-600" />
            Posição Atual de Estoque
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Visão detalhada do saldo de produtos por localização.</p>
        </div>
        </div>
      </div>

      <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl shadow-indigo-500/5 overflow-hidden transition-all duration-200">
        {stocks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhum registro de estoque encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Almoxarifado</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Qtd Atual</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => {
                  let status = 'NORMAL'
                  if (stock.quantity <= 0) status = 'OUT_OF_STOCK'
                  else if (stock.quantity <= stock.product.minimumStock) status = 'LOW'

                  return (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium text-foreground">{stock.product.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{stock.product.code}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{stock.product.category.name}</TableCell>
                      <TableCell className="text-sm">{stock.warehouse.name}</TableCell>
                      <TableCell className="text-sm font-mono bg-muted">{stock.location.code}</TableCell>
                      <TableCell className="text-right font-bold text-foreground">
                        {stock.quantity} <span className="text-xs text-muted-foreground font-normal">{stock.product.unit.code}</span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{stock.product.minimumStock}</TableCell>
                      <TableCell className="text-center">
                        {status === 'NORMAL' && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Normal</Badge>}
                        {status === 'LOW' && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Baixo</Badge>}
                        {status === 'OUT_OF_STOCK' && <Badge variant="destructive">Zerado</Badge>}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <a href={`/reports/stock?page=${Math.max(1, page - 1)}`} className={`px-4 py-2 border rounded-md ${page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}>
            Anterior
          </a>
          <span className="px-4 py-2 text-muted-foreground">Página {page} de {totalPages}</span>
          <a href={`/reports/stock?page=${Math.min(totalPages, page + 1)}`} className={`px-4 py-2 border rounded-md ${page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}>
            Próxima
          </a>
        </div>
      )}
    </div>
  )
}
