import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-full min-h-[70vh] w-full flex-col items-center justify-center gap-6 text-muted-foreground animate-in fade-in duration-500">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/10">
        <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-pulse"></div>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      <p className="animate-pulse text-sm font-semibold tracking-widest text-primary/80 uppercase">Carregando sistema</p>
    </div>
  )
}
