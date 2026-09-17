import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Trash2 } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/db"
import { ProductActions } from "./product-actions"
import { DeleteAllButton } from "./delete-all-button"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams.q as string
  const categoryId = resolvedSearchParams.category as string
  const status = resolvedSearchParams.status as string

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (categoryId) where.categoryId = categoryId
  if (status) where.status = status

  const page = parseInt(resolvedSearchParams.page as string) || 1
  const pageSize = 50

  const [productsList, totalCount, categories, allProductsSlim] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: true,
        unit: true,
        defaultLocation: { include: { warehouse: true } },
        stocks: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    db.product.count({ where }),
    db.productCategory.findMany({ orderBy: { name: 'asc' } }),
    // Optimized slim fetch for summary cards
    db.product.findMany({
      where,
      select: {
        averageCost: true,
        stocks: { select: { quantity: true } }
      }
    })
  ])

  // Calculate summaries efficiently
  let grandTotalValue = 0
  let totalItemsInStock = 0

  allProductsSlim.forEach(product => {
    const totalStock = product.stocks.reduce((acc: number, stock: any) => acc + stock.quantity, 0)
    const cost = Number(product.averageCost || 0)
    grandTotalValue += totalStock * cost
    totalItemsInStock += totalStock
  })
  
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">Gerencie os produtos cadastrados no almoxarifado.</p>
        </div>
        <div className="flex gap-2">
          <DeleteAllButton />
          <Link href="/products/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo produto
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm transition-all hover:border-primary/20">
          <p className="text-sm font-semibold text-muted-foreground">Total de Produtos (Tipos)</p>
          <p className="text-3xl font-black text-foreground mt-1">{totalCount}</p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm transition-all hover:border-primary/20">
          <p className="text-sm font-semibold text-muted-foreground">Itens em Estoque (Unidades)</p>
          <p className="text-3xl font-black text-foreground mt-1">
            {new Intl.NumberFormat('pt-BR').format(totalItemsInStock)}
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm transition-all hover:border-primary/20">
          <p className="text-sm font-semibold text-muted-foreground">Valor Total em Estoque</p>
          <p className="text-3xl font-black text-foreground mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(grandTotalValue)}
          </p>
        </div>
      </div>

      <form method="GET" className="flex flex-col sm:flex-row gap-4 bg-card/95 backdrop-blur-xl p-4 rounded-2xl border border-border/40 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input name="q" defaultValue={search || ""} placeholder="Buscar por código ou descrição..." className="pl-9" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select name="category" defaultValue={categoryId || ""} className="flex h-10 w-full sm:w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Categorias (Todas)</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="status" defaultValue={status || ""} className="flex h-10 w-full sm:w-36 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Status (Todos)</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
          <Button type="submit" variant="secondary" className="flex items-center gap-2 shrink-0">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </form>

      <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl shadow-indigo-500/5 overflow-hidden transition-all duration-200">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-border/50">
          {productsList.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">Nenhum produto</p>
              <p className="text-sm text-muted-foreground">Você ainda não possui produtos ou os filtros não retornaram resultados.</p>
            </div>
          ) : (
            productsList.map((product) => {
              const totalStock = product.stocks.reduce((acc: number, stock: any) => acc + stock.quantity, 0)
              const totalValue = totalStock * Number(product.averageCost || 0)
              return (
                <div key={product.id} className="p-5 space-y-4 bg-transparent hover:bg-muted/20 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Link href={`/products/${product.id}`} className="font-semibold text-base text-foreground leading-tight hover:text-primary transition-colors">
                            {product.name}
                          </Link>
                        </div>
                        <span className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                          Cod: {product.code}
                        </span>
                      </div>
                    </div>
                    {product.status === 'ACTIVE' ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-medium whitespace-nowrap">
                        <span className="h-1 w-1 rounded-full bg-emerald-600 animate-pulse"></span>
                        Ativo
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-600 border border-zinc-500/20 text-[10px] font-medium whitespace-nowrap">
                        <span className="h-1 w-1 rounded-full bg-zinc-600"></span>
                        Inativo
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm p-3 bg-muted/30 rounded-lg border border-border/30">
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">Estoque</span>
                      <span className="font-medium text-foreground">{totalStock} {product.unit.code}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">Valor Total</span>
                      <span className="font-bold text-indigo-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-secondary/60 text-foreground px-2 py-1 rounded-md border border-border/50">{product.category.name}</span>
                    </div>
                    <ProductActions 
                      productId={product.id} 
                      productCode={product.code} 
                      productName={product.name} 
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto p-1">
          <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Código</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Produto</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Categoria</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-center">Unid.</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Estoque</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Valor Total</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Status</TableHead>
              <TableHead className="h-14 px-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsList.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="rounded-full bg-muted/50 p-4">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-medium text-foreground">Nenhum produto encontrado</p>
                    <p className="text-sm text-muted-foreground">Você ainda não possui produtos cadastrados no sistema.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              productsList.map((product) => {
                const totalStock = product.stocks.reduce((acc: number, stock: any) => acc + stock.quantity, 0)
                const totalValue = totalStock * Number(product.averageCost || 0)
                return (
                  <TableRow 
                    key={product.id}
                    className="group border-b border-border/40 hover:bg-primary/[0.02] transition-all duration-300 ease-in-out"
                  >
                    <TableCell className="px-6 py-4 font-mono text-sm text-muted-foreground">{product.code}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/products/${product.id}`} className="font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-300">
                          {product.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border/30 text-sm">
                        {product.category.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/50 uppercase">
                        {product.unit.code}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="font-semibold text-foreground">{totalStock}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <span className="font-bold text-indigo-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {product.status === 'ACTIVE' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-sm font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-[pulse_2s_ease-in-out_infinite]"></span>
                          Ativo
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 text-zinc-600 border border-zinc-500/20 text-sm font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-600"></span>
                          Inativo
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <ProductActions 
                          productId={product.id} 
                          productCode={product.code} 
                          productName={product.name} 
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
          </Table>
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">{(page - 1) * pageSize + 1}</span> a <span className="font-medium text-foreground">{Math.min(page * pageSize, totalCount)}</span> de <span className="font-medium text-foreground">{totalCount}</span> produtos
          </p>
          <div className="flex items-center gap-2">
            <Link href={page > 1 ? `/products?${new URLSearchParams({ ...resolvedSearchParams, page: String(page - 1) }).toString()}` : '#'}>
              <Button variant="outline" size="sm" disabled={page <= 1}>
                Anterior
              </Button>
            </Link>
            <Link href={page < totalPages ? `/products?${new URLSearchParams({ ...resolvedSearchParams, page: String(page + 1) }).toString()}` : '#'}>
              <Button variant="outline" size="sm" disabled={page >= totalPages}>
                Próxima
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
