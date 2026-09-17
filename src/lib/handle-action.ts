"use client"
import { toast } from "sonner"

export function handleAction<T extends (...args: any[]) => Promise<any>>(action: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await action(...args)
    } catch (error: any) {
      // Allow Next.js redirect errors to propagate naturally
      if (
        error?.message === 'NEXT_REDIRECT' || 
        error?.digest?.startsWith('NEXT_REDIRECT')
      ) {
        throw error
      }
      
      // Extract the message from the standard Error object thrown by server actions
      const message = error?.message || "Ocorreu um erro inesperado."
      toast.error(message)
    }
  }) as T
}
