"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Package, ShieldCheck, Zap, BarChart3, LayoutDashboard } from "lucide-react"
import { useActionState, useEffect } from "react"
import { loginAction } from "./actions"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(loginAction, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  if (state?.success) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-24 h-24 border-4 border-primary/20 rounded-full animate-ping"></div>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10"></div>
        </div>
        <h2 className="text-2xl font-bold text-foreground ">Autenticando e carregando o sistema...</h2>
        <p className="text-muted-foreground">Preparando seu ambiente de trabalho.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background font-sans overflow-hidden">
      
      {/* Lado Esquerdo - Branding & Marketing (Oculto em telas muito pequenas) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-slate-950 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Premium Abstrato */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] "></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[100px] " style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] " style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Header Branding */}
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-md ">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">CGSTOCK</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-xl mt-12 mb-auto pt-16">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            O fim do caos no <span className="text-transparent bg-clip-text   ">seu almoxarifado.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-300 font-medium leading-relaxed">
            Plataforma corporativa de gestão de estoque baseada no princípio da imutabilidade. Elimine fraudes, feche furos de inventário e assuma o controle.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-200">100% Auditável</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-200">Coletor em Tempo Real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-200">Curva ABC e Alertas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="font-semibold text-slate-200">Visão Multi-Almoxarifado</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 left-12 z-20 text-primary-foreground/80/60 text-sm">
        &copy; {new Date().getFullYear()} CGStock Systems. Todos os direitos reservados.
      </div>
      </div>

      {/* Lado Direito - Form Login */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background relative z-10">
        
        {/* Mobile Logo Only */}
        <div className="flex items-center gap-2 mb-8 md:hidden justify-center">
          <div className="bg-primary/10 p-2 rounded-md">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">CGSTOCK</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Acesse sua conta</h2>
            <p className="text-muted-foreground text-sm font-medium">
              Informe suas credenciais corporativas para entrar na plataforma.
            </p>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <form action={formAction} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground" htmlFor="email">
                    E-mail Corporativo
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@estok.com"
                    required
                    className="h-12 bg-muted/50 border-border focus:bg-background "
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-foreground" htmlFor="password">
                      Senha
                    </label>
                    <a href="#" className="text-xs font-semibold text-primary hover:text-primary hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="h-12 bg-muted/50 border-border focus:bg-background "
                  />
                </div>

                {state?.error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 font-medium   slide-in-">
                    {state.error}
                  </div>
                )}

                <Button 
                  className="w-full h-12 text-base font-bold bg-primary hover:bg-primary text-white shadow-sm   active:scale-[0.98]" 
                  disabled={isPending || state?.success}
                >
                  {isPending ? "Autenticando..." : "Entrar no Sistema"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
