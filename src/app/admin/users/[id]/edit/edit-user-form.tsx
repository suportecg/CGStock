"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { editUserAction } from "./actions"
import { AlertCircle, Loader2 } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  qrToken?: string | null
  qrStatus?: string
  roles: { id: string, name: string }[]
  worksiteAccesses?: { worksiteId: string, canUseQuickIssue: boolean }[]
}

export function EditUserForm({ user, roles, worksites }: { user: User, roles: { id: string, name: string }[], worksites: { id: string, name: string }[] }) {
  const [state, action, isPending] = useActionState(editUserAction, null)
  
  const userRoleIds = user.roles.map(r => r.id)
  const userWorksiteIds = user.worksiteAccesses?.map(a => a.worksiteId) || []

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={user.id} />
      
      {state?.error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2 border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={user.name}
          placeholder="Ex: Carlos Silva" 
          required 
          className="bg-muted/50 focus-visible:ring-primary border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail Corporativo</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          defaultValue={user.email}
          placeholder="carlos@estoka.com" 
          required 
          className="bg-muted/50 focus-visible:ring-primary border-border/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Nova Senha (opcional)</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          placeholder="Deixe em branco para manter a atual" 
          minLength={6}
          className="bg-muted/50 focus-visible:ring-primary border-border/50"
        />
      </div>

      <div className="space-y-3">
        <Label>Perfis de Acesso</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
          {roles.map(role => (
            <label key={role.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="roleIds" 
                  value={role.id}
                  defaultChecked={userRoleIds.includes(role.id)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-primary/50 checked:border-primary checked:bg-primary transition-all"
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {role.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Obras Autorizadas</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-4 rounded-xl border border-border/50">
          {worksites.map(ws => (
            <label key={ws.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="worksiteIds" 
                  value={ws.id}
                  defaultChecked={userWorksiteIds.includes(ws.id)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-emerald-500/50 checked:border-emerald-600 checked:bg-emerald-600 transition-all"
                />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-emerald-700 transition-colors">
                {ws.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Status do QR Code (Entrega Rápida)</Label>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${user.qrToken && user.qrStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {user.qrToken && user.qrStatus === 'ACTIVE' ? 'ATIVO' : 'REVOGADO / INEXISTENTE'}
            </div>
            <span className="text-sm text-muted-foreground">
              {user.qrToken ? 'Token gerado. O funcionário pode usar a Entrega Rápida.' : 'O funcionário ainda não possui um QR Code.'}
            </span>
          </div>
          {user.qrToken && (
            <div className="text-xs font-mono bg-background px-3 py-2 rounded-lg border border-border select-all">
              {user.qrToken}
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Salvando alterações...
          </>
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </form>
  )
}
