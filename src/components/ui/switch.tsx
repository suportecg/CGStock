import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
    <input
      type="checkbox"
      className={cn(
        "peer sr-only",
        className
      )}
      ref={ref}
      {...props}
    />
    <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors"></div>
    <div className="absolute left-0 inline-block h-5 w-5 transform rounded-full bg-card border border-border shadow-sm transition-transform peer-checked:translate-x-4"></div>
  </div>
))
Switch.displayName = "Switch"

export { Switch }
