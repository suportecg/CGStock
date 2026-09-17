"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({ placeholder = "Buscar...", className }: SearchInputProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const initialQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(initialQuery)

  const handleSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, [pathname, router, searchParams])

  // Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialQuery) {
        handleSearch(value)
      }
    }, 400) // 400ms debounce

    return () => clearTimeout(timer)
  }, [value, handleSearch, initialQuery])

  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder} 
        className={cn("pl-9", isPending && "opacity-70 transition-opacity")} 
      />
    </div>
  )
}
