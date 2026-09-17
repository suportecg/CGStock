"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Printer } from "lucide-react"
import Link from "next/link"
import { UserActions } from "./user-actions"

export function UsersClient({ users }: { users: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(users.map(u => u.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectUser = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(userId => userId !== id))
    }
  }

  const printUrl = selectedIds.length > 0 
    ? `/admin/users/print-badges?ids=${selectedIds.join(',')}`
    : `/admin/users/print-badges`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">Gerencie o acesso da equipe à plataforma web e coletores mobile.</p>
        </div>
        <div className="flex gap-2">
          <Link href={printUrl}>
            <Button variant="outline" className="flex items-center gap-2 bg-background hover:bg-muted shadow-sm transition-all active:scale-95">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">
                Imprimir Crachás {selectedIds.length > 0 ? `(${selectedIds.length})` : '(Todos)'}
              </span>
            </Button>
          </Link>
          <Link href="/admin/users/new">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95">
              <UserPlus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card/95 backdrop-blur-xl p-4 rounded-2xl border border-border/40 shadow-sm">
        <form className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-primary/60" />
          <Input name="q" placeholder="Buscar por nome ou e-mail..." className="pl-10 rounded-full border-border/50 bg-muted/50 focus-visible:ring-primary transition-all focus:bg-background" />
        </form>
      </div>

      <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/40 shadow-xl shadow-indigo-500/5 overflow-hidden transition-all duration-200">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-border/50">
          {users.map((user) => (
            <div key={user.id} className="p-4 space-y-4 hover:bg-muted/30 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 rounded-md border-border/50 bg-background text-primary focus:ring-primary focus:ring-offset-1 cursor-pointer transition-all accent-indigo-600 shrink-0 shadow-sm"
                    checked={selectedIds.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  />
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground leading-tight">{user.name}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
                  </div>
                </div>
                <Badge variant={user.status === 'ACTIVE' ? 'success' : (user.status === 'DELETED' ? 'destructive' : 'secondary')} className="text-[10px]">
                  {user.status === 'ACTIVE' ? 'Ativo' : (user.status === 'DELETED' ? 'Excluído' : 'Inativo')}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {user.roles.map((role: any) => (
                  <Badge key={role.id} variant="outline" className="font-normal text-xs bg-muted/20">
                    {role.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground">
                  Desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <UserActions userId={user.id} userName={user.name} />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded-sm border-border bg-background text-primary focus:ring-primary cursor-pointer transition-all accent-indigo-600 shadow-sm"
                  checked={users.length > 0 && selectedIds.length === users.length}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Último acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded-sm border-border bg-background text-primary focus:ring-primary cursor-pointer transition-all accent-indigo-600 shadow-sm"
                    checked={selectedIds.includes(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role: any) => (
                      <Badge key={role.id} variant="outline" className="font-normal text-xs bg-muted/20">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'ACTIVE' ? 'success' : (user.status === 'DELETED' ? 'destructive' : 'secondary')}>
                    {user.status === 'ACTIVE' ? 'Ativo' : (user.status === 'DELETED' ? 'Excluído' : 'Inativo')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UserActions userId={user.id} userName={user.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
