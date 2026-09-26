import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-full min-h-[70vh] w-full flex-col items-center justify-center gap-6 text-muted-foreground   ">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-md bg-card  border border-border shadow-sm ">
        <div className="absolute inset-0 rounded-md border border-primary/20 "></div>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      <p className=" text-sm font-semibold tracking-widest text-primary/80 uppercase">Carregando sistema</p>
    </div>
  )
}
