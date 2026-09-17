import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  
  const variants = {
    default: "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80",
    secondary: "border-transparent bg-accent text-foreground hover:bg-accent/80",
    destructive: "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80",
    outline: "text-foreground",
    success: "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80",
    warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
